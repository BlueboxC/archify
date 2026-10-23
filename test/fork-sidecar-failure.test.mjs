import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(root,'archify/bin/archify.mjs');
function fixture(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'archify-namespace-failure-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const bytes=fs.readFileSync(path.join(root,'archify/examples/class-payments-rendered.html'));
 return {dir,bytes};
}
function failedReceipt(args,dir,wrapper){
 const result=spawnSync(process.execPath,wrapper?[wrapper,...args]:[cli,...args],{cwd:dir,encoding:'utf8',timeout:10000,maxBuffer:1048576});
 assert.ifError(result.error);assert.equal(result.status,1,result.stderr);
 assert.doesNotMatch(result.stderr,/\n\s+at /u);
 const receipt=JSON.parse(result.stdout);assert.equal(receipt.ok,false);
 assert.ok(receipt.diagnostics.length>0);return receipt;
}
test('read-only gates report unknown provenance when namespace probing is denied',t=>{
 const {dir,bytes}=fixture(t);const artifact=path.join(dir,'Locked.html');fs.writeFileSync(artifact,bytes);
 const wrapper=path.join(dir,'denied.mjs');
 fs.writeFileSync(wrapper,`import fs from 'node:fs';import path from 'node:path';import {syncBuiltinESMExports} from 'node:module';
 const open=fs.openSync;fs.openSync=(file,...args)=>{if(path.basename(String(file)).startsWith('.archify-path-semantics-')){const err=new Error('probe denied');err.code='EACCES';throw err;}return open(file,...args);};syncBuiltinESMExports();
 process.argv=[process.execPath,${JSON.stringify(cli)},...process.argv.slice(2)];await import(${JSON.stringify(pathToFileURL(cli).href)});`);
 for(const command of ['check','browser-check','visual-check']){
  const receipt=failedReceipt([command,artifact,'--json'],dir,wrapper);
  assert.ok(receipt.diagnostics.some(d=>d.evidence?.namespaceReason?.code==='sidecar-case-semantics-indeterminate'),JSON.stringify(receipt));
  assert.deepEqual(fs.readFileSync(artifact),bytes);
 }
 assert.deepEqual(fs.readdirSync(dir).sort(),['Locked.html','denied.mjs']);
});
test('failed evidence with a regular-file out-dir returns diagnostics and preserves bytes',t=>{
 const {dir,bytes}=fixture(t);const artifact=path.join(dir,'lower.html');fs.writeFileSync(artifact,bytes);
 const out=path.join(dir,'afile');fs.writeFileSync(out,'preserve');
 for(const command of ['browser-check','visual-check']){
  const receipt=failedReceipt([command,artifact,'--require-provenance','--json','--out-dir',out],dir);
  assert.ok(receipt.diagnostics.some(d=>d.code==='viewer/evidence-write'),JSON.stringify(receipt));
  assert.deepEqual(fs.readFileSync(artifact),bytes);assert.equal(fs.readFileSync(out,'utf8'),'preserve');
 }
 assert.deepEqual(fs.readdirSync(dir).sort(),['afile','lower.html']);
});
