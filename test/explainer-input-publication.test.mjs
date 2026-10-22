import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const cli = fileURLToPath(new URL('../archify/bin/archify.mjs', import.meta.url));
const data = '[{"name":"North","value":60},{"name":"South","value":40}]\n';
function fixture(t, dependency, invalid = false) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-input-publication-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const model = {schema_version:1,diagram_type:'explainer',meta:{id:'source-preservation',title:'Recorded values',locale:'en'},answer:{summary:'Compare the recorded values.'},panels:[{id:'data',title:'Which values differ?',blocks:[{id:'measurements',type:'chart',data:{path:dependency,kind:'bar',x:'name',y:['value']}}]}],sources:[]};
  fs.writeFileSync(path.join(dir,'draft.json'),JSON.stringify(model));
  const bytes = invalid ? data.replace('60','"invalid"') : data;
  fs.writeFileSync(path.join(dir,dependency),bytes);
  return {dir,bytes,run(command,extra=[]) {return spawnSync(process.execPath,[cli,command,'explainer','draft.json','page.html','--json',...extra],{cwd:dir,encoding:'utf8',timeout:30000,env:{...process.env,ARCHIFY_UPDATE_CHECK_DISABLED:'1'}});}};
}
for (const [command,dependency,extra] of [
  ['deliver','page.delivery.json',[]],
  ['finalize','page.finalize.json',[]],
  ['finalize','page.finalize-summary.json',[]],
  ['finalize','values.json',['--receipt','values.json']],
]) test(`${command} preserves local input colliding with ${dependency}`,t=>{
  const f=fixture(t,dependency);
  const r=f.run(command,extra);
  assert.equal(fs.readFileSync(path.join(f.dir,dependency),'utf8'),f.bytes,r.stdout+r.stderr);
  assert.notEqual(r.status,0,'colliding sidecar must be refused');
  assert.equal(fs.existsSync(path.join(f.dir,'page.html')),false);
});
test('failed redelivery preserves invalid dependency and existing HTML',t=>{
  const f=fixture(t,'page.delivery.json',true);
  fs.writeFileSync(path.join(f.dir,'page.html'),'previous HTML');
  const r=f.run('deliver');
  assert.notEqual(r.status,0);
  assert.equal(fs.readFileSync(path.join(f.dir,'page.delivery.json'),'utf8'),f.bytes,r.stdout+r.stderr);
  assert.equal(fs.readFileSync(path.join(f.dir,'page.html'),'utf8'),'previous HTML');
});
for (const alias of ['symlink','hardlink']) test(`finalize refuses ${alias} receipt aliases`,t=>{
  const f=fixture(t,'values.json');
  const receipt=path.join(f.dir,'receipt.json'),input=path.join(f.dir,'values.json');
  if(alias==='symlink')fs.symlinkSync(input,receipt);else fs.linkSync(input,receipt);
  const r=f.run('finalize',['--receipt','receipt.json']);
  assert.notEqual(r.status,0);
  assert.equal(fs.readFileSync(input,'utf8'),f.bytes,r.stdout+r.stderr);
  assert.equal(fs.existsSync(path.join(f.dir,'page.html')),false);
});
test('non-colliding repeated delivery retains input and succeeds',t=>{
  const f=fixture(t,'values.json');
  for(let i=0;i<2;i++){
    const r=f.run('deliver');assert.equal(r.status,0,r.stdout+r.stderr);
    assert.equal(fs.readFileSync(path.join(f.dir,'values.json'),'utf8'),f.bytes);
  }
});


test('finalize preserves an external native diagram at its receipt path', t => {
  const f=fixture(t,'values.json');
  const draft=JSON.parse(fs.readFileSync(path.join(f.dir,'draft.json'),'utf8'));
  draft.panels[0].blocks=[{id:'native',type:'diagram',diagramType:'tree',source:'page.finalize.json'}];
  fs.writeFileSync(path.join(f.dir,'draft.json'),JSON.stringify(draft));
  const spec=fs.readFileSync(new URL('../archify/examples/payment-platform.tree.json',import.meta.url));
  fs.writeFileSync(path.join(f.dir,'page.finalize.json'),spec);
  const r=f.run('finalize');
  assert.notEqual(r.status,0);
  assert.deepEqual(fs.readFileSync(path.join(f.dir,'page.finalize.json')),spec,r.stdout+r.stderr);
  assert.equal(fs.existsSync(path.join(f.dir,'page.html')),false);
});
test('uninspectable redelivery does not write failure provenance', t => {
  const f=fixture(t,'values.json');
  fs.writeFileSync(path.join(f.dir,'draft.json'),'{ broken JSON');
  fs.writeFileSync(path.join(f.dir,'page.html'),'previous HTML');
  fs.writeFileSync(path.join(f.dir,'page.delivery.json'),'previous evidence');
  const r=f.run('deliver');
  assert.notEqual(r.status,0);
  assert.equal(fs.readFileSync(path.join(f.dir,'page.delivery.json'),'utf8'),'previous evidence');
  assert.equal(fs.readFileSync(path.join(f.dir,'page.html'),'utf8'),'previous HTML');
});
