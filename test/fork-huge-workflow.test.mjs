import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
test('workflow validation completes for a finite width below coordinate resolution', t => {
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'archify-huge-width-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const input=path.join(dir,'input.json');
 const spec={"schema_version": 2, "diagram_type": "workflow", "meta": {"title": "Huge width", "output": "huge-width.html"}, "lanes": [{"id": "l0", "label": "Lane 0"}], "nodes": [{"id": "n0", "lane": "l0", "col": 1, "type": "backend", "label": "Node 0", "yOffset": -35}, {"id": "n1", "lane": "l0", "col": 0, "type": "backend", "label": "Node 1", "width": 1e+30}], "edges": [{"id": "e0", "from": "n1", "to": "n0"}, {"id": "e1", "from": "n1", "to": "n0"}]};
 for(const width of [1e30,1e26,1e25,1e18,320]) {
  spec.nodes[1].width=width;fs.writeFileSync(input,JSON.stringify(spec));
  const result=spawnSync(process.execPath,[path.join(root,'archify/bin/archify.mjs'),'validate','workflow',input,'--json'],{encoding:'utf8',timeout:5000,maxBuffer:1048576});
  assert.ifError(result.error);
  assert.ok([0,1].includes(result.status),result.stderr);
  const receipt=JSON.parse(result.stdout);assert.equal(typeof receipt.ok,'boolean');
  assert.equal(fs.existsSync(path.join(dir,'huge-width.html')),false);
 }
});
