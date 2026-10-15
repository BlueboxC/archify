import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../archify/references/', import.meta.url));
const slug = heading => heading.toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, '').replace(/\s/g, '-');

test('contract entry points route to bounded topics and retain resolvable compatibility headings', () => {
  for (const name of ['authoring-contract.md', 'delivery-contract.md']) {
    const index = fs.readFileSync(path.join(root, name), 'utf8');
    assert.ok(index.split('\n').length <= 150, `${name} must remain a short routing index`);
    const links = [...index.matchAll(/\]\(([^)#]+\.md)(?:#([^)]+))?\)/g)];
    const topics = new Set(links.map(match => match[1]));
    assert.ok(topics.size >= 3, 'detailed rules must remain reachable');
    for (const [, file, fragment] of links) {
      const source = fs.readFileSync(path.join(root, file), 'utf8');
      assert.ok(source.split('\n').length <= 250, `${file} should load as a bounded topic`);
      if (fragment) assert.ok([...source.matchAll(/^#{1,6} (.+)$/gm)].some(m => slug(m[1]) === fragment), `${file}#${fragment} must resolve`);
    }
  }
});
