import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { bipartiteArchitectureSpec } from './helpers/dense-fixture.mjs';

const root = process.env.ARCHIFY_TEST_SKILL_ROOT || fileURLToPath(new URL('../', import.meta.url));
const cli = path.join(root, 'bin/archify.mjs');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-buffer-'));
after(() => fs.rmSync(directory, { recursive: true, force: true }));
function run(args, env = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd: directory, encoding: 'utf8', maxBuffer: 96 * 1024 * 1024,
    env: { ...process.env, ARCHIFY_UPDATE_CHECK_DISABLED: '1', ...env },
  });
}
function source(name, spec) {
  const filename = path.join(directory, name + '.json');
  fs.writeFileSync(filename, JSON.stringify(spec));
  return filename;
}
const dense = source('dense', bipartiteArchitectureSpec(10));
const minimal = source('minimal', bipartiteArchitectureSpec(1));

test('checker buffer: dense public delivery preserves the complete large receipt', { timeout: 60000 }, () => {
  const output = path.join(directory, 'dense.html');
  const result = run(['deliver', 'architecture', dense, output, '--json']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(JSON.parse(result.stdout).ok, true);
  const checked = run(['check', output]);
  assert.equal(checked.status, 0, checked.stderr);
  assert.ok(Buffer.byteLength(checked.stdout) > 1024 * 1024, 'fixture must exceed the old capture limit');
  assert.equal(JSON.parse(checked.stdout).ok, true);
});

for (const command of ['validate', 'deliver', 'compare', 'migrate']) {
  test(`checker buffer: ${command} classifies exhaustion and preserves existing output`, () => {
    const output = path.join(directory, command + (command === 'migrate' ? '.json' : '.html'));
    const previous = 'previous output must survive';
    fs.writeFileSync(output, previous);
    let args;
    if (command === 'compare') args = [command, 'architecture', minimal, minimal, output, '--json'];
    else if (command === 'migrate') {
      const input = source('workflow', JSON.parse(fs.readFileSync(path.join(root, 'examples/agent-tool-call.workflow.json'))));
      args = [command, 'workflow', input, output, '--to-schema', '2', '--json'];
    } else args = [command, 'architecture', minimal, ...(command === 'deliver' ? [output] : []), '--json'];
    const result = run(args, { ARCHIFY_CHECK_MAX_BUFFER: '16' });
    assert.notEqual(result.status, 0, result.stdout);
    const receipt = JSON.parse(result.stdout);
    const diagnostic = receipt.diagnostics?.find(entry => entry.code === 'artifact/check-output-limit');
    assert.ok(diagnostic, result.stdout);
    assert.equal(diagnostic.evidence.systemCode, 'ENOBUFS');
    assert.equal(diagnostic.evidence.limitBytes, 16);
    assert.ok(diagnostic.supportedFixes.length);
    assert.equal(fs.readFileSync(output, 'utf8'), previous);
  });
}

test('checker buffer: real malformed artifact remains an artifact failure', () => {
  const file = path.join(directory, 'invalid.html');
  fs.writeFileSync(file, '<html>No SVG</html>');
  const result = run(['check', file]);
  assert.notEqual(result.status, 0);
  const receipt = JSON.parse(result.stdout);
  assert.equal(receipt.checks.find(check => check.name === 'single_svg').ok, false);
});

test('checker buffer: invalid limits retain the safe default', () => {
  for (const value of ['NaN', '0', '-1', '1.5', '9007199254740992']) {
    const result = run(['validate', 'architecture', minimal, '--json'], { ARCHIFY_CHECK_MAX_BUFFER: value });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }
});

test('checker buffer: a process error cannot become success when status is zero', () => {
  const preload = path.join(directory, 'zero-status.mjs');
  fs.writeFileSync(preload, `import childProcess from 'node:child_process';
    import { syncBuiltinESMExports } from 'node:module';
    const original = childProcess.spawnSync;
    childProcess.spawnSync = (file, args, options) => args?.some(arg => arg.endsWith('/check-render-output.mjs'))
      ? { status: 0, stdout: '{"ok":true}', stderr: '', error: Object.assign(new Error('fixture'), { code: 'ENOBUFS' }) }
      : original(file, args, options);
    syncBuiltinESMExports();`);
  const result = run(['validate', 'architecture', minimal, '--json'], { NODE_OPTIONS: '--import ' + pathToFileURL(preload).href });
  assert.notEqual(result.status, 0);
  assert.equal(JSON.parse(result.stdout).diagnostics[0].code, 'artifact/check-output-limit');
});
