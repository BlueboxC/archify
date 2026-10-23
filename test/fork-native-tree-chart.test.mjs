import test from 'node:test';
import assert from 'node:assert/strict';
import {compileExplainerChart} from '../archify/explainer/charts.mjs';
test('treeView-beta charts point to native tree authoring',()=>{
 for(const fence of ['treeView-beta\n  a\n    b','mindmap\n  a']){
  const result=compileExplainerChart(fence);
  assert.match(result.error,/native tree shorthand/u);
  assert.equal(result.example,'@tree id=...');
 }
 const pie=compileExplainerChart('pie title Share\n  "A" : 60\n  "B" : 40');assert.ok(pie.svg);
});
