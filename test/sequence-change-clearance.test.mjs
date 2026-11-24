import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
test('Sequence change prefixes retain additional opaque label clearance after self-call integration', t => {
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'archify-sequence-change-clearance-'));
  t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const render=change=>{
    const input=path.join(directory,'input.json'),out=path.join(directory,'output.html');
    fs.writeFileSync(input,JSON.stringify({schema_version:1,diagram_type:'sequence',meta:{title:'Change label',output:'output.html',quality_profile:'standard'},participants:[{id:'a',label:'Caller',type:'frontend'},{id:'b',label:'API',type:'backend'}],messages:[{id:'request',from:'a',to:'b',y:170,label:'Request',...(change?{change}:{})}]}));
    const result=spawnSync(process.execPath,['archify/bin/archify.mjs','render','sequence',input,out],{encoding:'utf8'});
    assert.equal(result.status,0,result.stderr+result.stdout);
    const html=fs.readFileSync(out,'utf8');
    const match=html.match(/<rect\b[^>]*width="([\d.]+)"[^>]*class="c-mask"\/>\s*<text\b[^>]*>(?:<tspan\b[^>]*>[^<]*<\/tspan>)?Request<\/text>/u);
    assert.ok(match,'the authored request has an opaque label mask');
    if(change)assert.match(html,new RegExp('t-change-badge-'+change));
    return Number(match[1]);
  };
  const plain=render();
  for(const state of ['added','modified','removed'])assert.ok(render(state)>plain,'a visible change prefix retains room beyond the unchanged authored label: '+state);
});
