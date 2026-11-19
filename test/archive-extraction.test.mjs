import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { extractSkillArchive } from './helpers/extract-skill-archive.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-extraction-contract-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { archive: path.join(root, 'fixture.zip'), destination: path.join(root, 'output') };
}
function extracted(destination, { directory = false } = {}) {
  const target = path.join(destination, 'archify', 'SKILL.md');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (directory) fs.mkdirSync(target);
  else fs.writeFileSync(target, '---\nname: archify\ndescription: fixture\n---\n');
}
test('zero-exit extraction without the packaged Skill refuses and retains child diagnostics', (t) => {
  const f = fixture(t);
  const run = () => ({ status: 0, signal: null, error: undefined,
    stdout: 'controlled extractor output', stderr: 'controlled extraction access failure' });
  assert.throws(() => extractSkillArchive(f.archive, f.destination, { platform: 'win32', run }),
    (error) => /regular packaged SKILL.md/.test(error.message)
      && /controlled extraction access failure/.test(error.message)
      && /controlled extractor output/.test(error.message));
});
test('a directory at the expected packaged Skill path is not an extracted file', (t) => {
  const f = fixture(t);
  const run = () => {
    extracted(f.destination, { directory: true });
    return { status: 0, signal: null, error: undefined, stdout: '', stderr: 'controlled incomplete extraction' };
  };
  assert.throws(() => extractSkillArchive(f.archive, f.destination, { platform: 'win32', run }),
    /regular packaged SKILL.md[\s\S]*controlled incomplete extraction/);
});
test('a materialized regular packaged Skill remains accepted despite child informational output', (t) => {
  const f = fixture(t);
  const run = () => {
    extracted(f.destination);
    return { status: 0, signal: null, error: undefined, stdout: 'information', stderr: 'nonfatal warning' };
  };
  extractSkillArchive(f.archive, f.destination, { platform: 'win32', run });
  assert.match(fs.readFileSync(path.join(f.destination, 'archify', 'SKILL.md'), 'utf8'), /name: archify/);
});
test('nonzero extraction is refused even if an output file exists', (t) => {
  const f = fixture(t);
  const run = () => {
    extracted(f.destination);
    return { status: 1, signal: null, error: undefined, stdout: '', stderr: 'controlled extractor failure' };
  };
  assert.throws(() => extractSkillArchive(f.archive, f.destination, { platform: 'win32', run }),
    /controlled extractor failure/);
});
test('an extractor launch error is preserved', (t) => {
  const f = fixture(t);
  const run = () => ({ status: null, signal: null, error: new Error('controlled launch failure'), stdout: '', stderr: '' });
  assert.throws(() => extractSkillArchive(f.archive, f.destination, { platform: 'win32', run }),
    /controlled launch failure/);
});
