import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('occupied wide-node centers retain distinct clear automatic ports', () => {
  // Exercise the actual nested selector with controlled existing routes; the public
  // CLI case below separately protects its integration and bounded termination.
  const source = fs.readFileSync(path.join(root, 'archify/renderers/workflow/workflow-compiler.mjs'), 'utf8');
  const start = source.indexOf('function automaticPortCandidates(');
  const end = source.indexOf('\nfunction automaticEndpointRepairs(', start);
  assert.ok(start >= 0 && end > start);
  const selector = source.slice(start, end);
  for (const [coordinate, width, neighbours = []] of [[0, 128], [1.5e17, 128], [-1.5e17, 128],
    [5e17, 104], [-5e17, 104], [2 ** 1000, 2 ** 951],
    [1e30, 1e16, [1e30 - 2 ** 47, 1e30 + 2 ** 47]]]) {
    const center = [coordinate, 0];
    const node = { id: 'wide', width, height: 80 };
    const edge = { from: 'wide', to: 'target' };
    const occupied = [coordinate, ...neighbours];
    const context = {
      independentAutomaticRoute: () => true, isReadableAutomaticRoute: () => true,
      layoutFeedback: {}, anchor: () => [...center],
      nodeRoutes: new Map([['wide', new Map(occupied.map((position, index) => [
        { from: 'wide', to: 'previous-' + index }, { points: [[position, 0], [position, 100]] },
      ]))]]),
      edge, node, center, counterpart: { cx: coordinate, cy: 100 },
    };
    const ports = vm.runInNewContext(`${selector}\nautomaticPortCandidates(edge, node, 'bottom', center, counterpart)`, context, { timeout: 1000 });
    assert.equal(ports.length, 2, `center ${coordinate} lost available ports`);
    assert.ok(ports.every(point => occupied.every(position => Math.abs(point[0] - position) >= 16)),
      `center ${coordinate} reused the occupied center: ${JSON.stringify(ports)}`);
    assert.notEqual(ports[0][0], ports[1][0]);
  }
});

test('public Workflow validation terminates when port spacing cannot change finite coordinates', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-port-progress-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const input = path.join(directory, 'input.json');
  const workflow = {
    schema_version: 2, diagram_type: 'workflow',
    meta: { title: 'Finite width', output: 'finite-width.html' },
    lanes: [{ id: 'lane', label: 'Lane' }],
    nodes: [
      { id: 'target', lane: 'lane', col: 1, type: 'backend', label: 'Target', yOffset: -35 },
      { id: 'source', lane: 'lane', col: 0, type: 'backend', label: 'Source', width: 1e30 },
    ],
    edges: [{ id: 'one', from: 'source', to: 'target' }, { id: 'two', from: 'source', to: 'target' }],
  };
  for (const width of [1e30, 1e26, 1e25, 1e18, 320]) {
    workflow.nodes[1].width = width;
    const authored = JSON.stringify(workflow);
    fs.writeFileSync(input, authored);
    const child = spawn(process.execPath, [path.join(root, 'archify/bin/archify.mjs'), 'validate', 'workflow', input, '--json'], {
      cwd: directory, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, TMPDIR: directory, TMP: directory, TEMP: directory, ARCHIFY_UPDATE_CHECK_DISABLED: '1' },
    });
    let stdout = '', stderr = '', timedOut = false, exited = false;
    const terminate = () => {
      if (exited || child.exitCode !== null || !child.pid) return;
      if (process.platform === 'win32') {
        const result = spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { encoding: 'utf8', timeout: 5000, windowsHide: true });
        if (result.error) throw result.error;
      } else {
        try { process.kill(-child.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
      }
    };
    const closed = new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('close', (code, signal) => { exited = true; resolve({ code, signal }); });
    });
    child.stdout.on('data', chunk => { stdout += chunk; if (stdout.length > 1024 * 1024) terminate(); });
    child.stderr.on('data', chunk => { stderr += chunk; if (stderr.length > 1024 * 1024) terminate(); });
    const timer = setTimeout(() => { timedOut = true; terminate(); }, process.platform === 'win32' ? 10000 : 5000);
    let result;
    try { result = await closed; } finally { clearTimeout(timer); terminate(); }
    assert.equal(timedOut, false, `width ${width} exceeded the bounded public CLI deadline`);
    assert.ok([0, 1].includes(result.code), stderr);
    const receipt = JSON.parse(stdout);
    assert.equal(typeof receipt.ok, 'boolean');
    if (width === 320) assert.equal(result.code, 0, stdout);
    else if (!receipt.ok) assert.ok(Array.isArray(receipt.diagnostics) && receipt.diagnostics.length);
    assert.equal(fs.readFileSync(input, 'utf8'), authored);
    assert.equal(fs.existsSync(path.join(directory, 'finite-width.html')), false);
  }
});
