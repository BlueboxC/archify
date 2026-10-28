import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositorySourceHref } from '../archify/renderers/shared/repository-location.mjs';
import { verifyRepositoryEvidence } from '../archify/renderers/shared/repository-evidence.mjs';
import { fixture, git } from './helpers/repository-evidence-fixture.mjs';

function render(t, diagram) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'report-regression-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const input=path.join(dir,'input.json'), output=path.join(dir,'output.html');
  fs.writeFileSync(input,JSON.stringify(diagram));
  const run=spawnSync(process.execPath,['archify/bin/archify.mjs','render',diagram.diagram_type,input,output],{encoding:'utf8'});
  assert.equal(run.status,0,run.stderr+run.stdout);
  return fs.readFileSync(output,'utf8').match(/<svg\b[\s\S]*?<\/svg>/u)[0];
}

test('Class preserves comma and whitespace inside quoted method parameters',t=>{
  for(const parameters of ['value: Literal["a,b"]','a: X,b: Y','a: X,  b: Y','value: Literal["a,\tb"]']) {
    const svg=render(t,{schema_version:1,diagram_type:'class',meta:{title:'Literal fidelity'},types:[{id:'parser',label:'Parser',kind:'class',methods:[{name:'parse',parameters,returns:'Result'}],row:0,col:0}]});
    const text=svg.replace(/<[^>]+>/g,'').replaceAll('&quot;','"');
    assert.ok(text.includes(`parse(${parameters})`),parameters);
  }
});

test('repository evidence rejects annotated tag objects without changing commit identities',t=>{
  const data=fixture();t.after(()=>fs.rmSync(data.root,{recursive:true,force:true}));
  assert.equal(verifyRepositoryEvidence('architecture',data.diagram,data.root).verified,true);
  git(data.root,'-c','tag.gpgSign=false','tag','-a','v1','-m','fixture');
  data.diagram.meta.repository.revision=git(data.root,'rev-parse','refs/tags/v1');
  assert.throws(()=>verifyRepositoryEvidence('architecture',data.diagram,data.root),/commit/i);
});

test('GitHub Markdown line citations use plain source and preserve other links',()=>{
  const url='https://github.com/example/repo',rev='a'.repeat(40);
  for(const name of ['README.md','guide.MARKDOWN']) assert.equal(repositorySourceHref('github',url,rev,{path:name,line:1,endLine:3}),`${url}/blob/${rev}/${name}?plain=1#L1-L3`);
  assert.equal(repositorySourceHref('github',url,rev,{path:'README.md'}),`${url}/blob/${rev}/README.md`);
  assert.equal(repositorySourceHref('github',url,rev,{path:'a.js',line:2}),`${url}/blob/${rev}/a.js#L2`);
  assert.equal(repositorySourceHref('gitee',url,rev,{path:'README.md',line:2}),`${url}/blob/${rev}/README.md#L2`);
});

test('Timeline title wraps preserve complete emoji grapheme clusters',t=>{
  const segmenter=new Intl.Segmenter(undefined,{granularity:'grapheme'});
  for(const cluster of ['👨‍👩‍👧‍👦','🇪🇸','👍🏽','e\u0301']) {
    const title=cluster.repeat(15);
    const svg=render(t,{schema_version:1,diagram_type:'timeline',meta:{title:'Graphemes',timezone:'UTC',evidence:'illustrative'},events:[{id:'a',at:'2026-10-01T10:00:00Z',title}]});
    const label=[...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gu)].find(([,a])=>a.includes('data-node-label='));
    assert.ok(label);
    const lines=[...label[2].matchAll(/<tspan\b[^>]*>([^<]*)<\/tspan>/gu)].map(([,s])=>s);
    assert.equal(lines.join(''),title);
    for(const line of lines) assert.ok([...segmenter.segment(line)].every(({segment})=>segment===cluster),JSON.stringify(line));
  }
});
