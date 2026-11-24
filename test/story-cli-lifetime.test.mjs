import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

// Dependency-free scheduling regression for the maintained Story test. It executes source statements,
// not a reimplementation of the Story test's ordering or CLI assertions.
// The final t.test callback is intercepted: its DOM assertions are NOT run here.
const overridePath = process.env.ARCHIFY_STORY_LIFETIME_SOURCE;
const overrideHash = process.env.ARCHIFY_STORY_LIFETIME_SHA256;
assert.equal(Boolean(overridePath), Boolean(overrideHash), 'source override requires its SHA256');
const sourcePath = overridePath || fileURLToPath(new URL('./story-choreography-browser.test.mjs', import.meta.url));
assert.ok(path.isAbsolute(sourcePath));
const source = fs.readFileSync(sourcePath, 'utf8');
if (overridePath) {
  assert.match(overrideHash, /^[a-f0-9]{64}$/);
  assert.equal(createHash('sha256').update(source).digest('hex'), overrideHash);
}
const uiName = 'Stage uses native Viewer toolbar paint and both menus fit at 320px and 768px';
const setupStart = source.indexOf('  const browser = desktopBrowser(chrome);');
const setupEndText = '  const session = await browser.sessionPromise;';
const setupEnd = source.indexOf(setupEndText, setupStart) + setupEndText.length;
assert.ok(setupStart >= 0 && setupEnd > setupStart);
const setup = source.slice(setupStart, setupEnd);
const cliStart = source.indexOf('  // 4. End-to-end CLI `archify story video`');
const uiStart = source.indexOf(`  await t.test('${uiName}'`);
const end = source.indexOf("\n});\n\ntest('choreography preserves revisits", uiStart);
assert.ok(cliStart >= 0 && uiStart >= 0 && end > Math.max(cliStart, uiStart));
const tail = source.slice(Math.min(cliStart, uiStart), end);
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const executeActual = new AsyncFunction(
  'desktopBrowser', 'chrome', 't', 'path', 'dir', 'spec', 'run', 'fs', 'assert', 'stageCheck',
  `${setup}\n${tail}`,
);

async function exercise(options = {}) {
  const events = [], argv = [], after = [];
  const state = { active: 0, peak: 0, closeCalls: 0, closeStarts: 0, physicalCloses: 0 };
  const uiError = new Error('fixture UI failure');
  const sessionError = new Error('fixture session failure');
  const closeError = new Error('fixture close failure');
  let closePromise;
  const browser = {
    // Match the production contract: one shared close promise, including failure.
    close() {
      state.closeCalls++;
      if (!closePromise) {
        state.closeStarts++;
        events.push('close-start');
        closePromise = (async () => {
          await Promise.resolve();
          if (options.closeFails) throw closeError;
          state.active--;
          state.physicalCloses++;
          events.push('close-finished');
        })();
      }
      return closePromise;
    },
    get sessionPromise() {
      return options.sessionFails ? Promise.reject(sessionError) : Promise.resolve('session');
    },
  };
  const desktopBrowser = () => {
    events.push('ui-open');
    state.active++;
    state.peak = Math.max(state.peak, state.active);
    return browser;
  };
  const t = {
    after(callback) { after.push(callback); },
    async test(name, callback) {
      assert.equal(name, uiName);
      assert.equal(typeof callback, 'function');
      assert.equal(state.active, 1, 'last UI subtest still owns its browser');
      events.push('last-ui');
      if (options.uiFails) throw uiError;
    },
  };
  const run = (args, cwd) => {
    argv.push([...args]);
    assert.equal(cwd, '/fixture');
    assert.deepEqual(args.slice(0, 2), ['story', 'video']);
    events.push('cli-open');
    state.active++;
    state.peak = Math.max(state.peak, state.active);
    try {
      assert.ok(state.active <= 1, `independent Chrome overlap: ${state.active}`);
      if (options.cliFails) return { status: 1, stdout: 'fixture CLI failure', stderr: '' };
      return { status: 0, stdout: JSON.stringify({ format: 'mp4', fps: 30 }), stderr: '' };
    } finally {
      state.active--;
      events.push('cli-closed');
    }
  };
  const fakeFs = {
    readFileSync(file) {
      if (file.endsWith('.webm')) return Buffer.from([0x1a, 0x45, 0xdf, 0xa3]);
      assert.ok(file.endsWith('.mp4'));
      return Buffer.from('\0\0\0\0ftypmp42');
    },
  };
  let primaryError, hasPrimaryError = false, cleanupError;
  try {
    await executeActual(desktopBrowser, 'fixture-chrome', t, path, '/fixture', '/fixture/spec.json',
      run, fakeFs, assert, { supportsH264: options.h264 === true });
  } catch (error) {
    hasPrimaryError = true;
    primaryError = error;
  }
  for (const callback of after) {
    try { await callback(); } catch (error) { cleanupError = error; }
  }
  return { ...state, argv, events, primaryError, hasPrimaryError, cleanupError,
    uiError, sessionError, closeError };
}

test('actual WebM CLI starts after last UI and completed browser close', async () => {
  const r = await exercise();
  assert.equal(r.hasPrimaryError, false, r.primaryError?.stack);
  assert.equal(r.cleanupError, undefined);
  assert.equal(r.peak, 1);
  assert.deepEqual(r.events, ['ui-open', 'last-ui', 'close-start', 'close-finished', 'cli-open', 'cli-closed']);
  assert.deepEqual(r.argv, [['story', 'video', '/fixture/spec.json', '/fixture/cli-export.webm',
    '--format', 'webm', '--fps', '10', '--start', '4.5', '--seconds', '0.4', '--json']]);
});

test('actual H264 branch retains MP4 args and sequential closed CLI sessions', async () => {
  const r = await exercise({ h264: true });
  assert.equal(r.hasPrimaryError, false, r.primaryError?.stack);
  assert.equal(r.peak, 1);
  assert.equal(r.argv.length, 2);
  assert.deepEqual(r.argv[1], ['story', 'video', '/fixture/spec.json', '/fixture/cli-export.mp4',
    '--fps', '30', '--start', '4.5', '--seconds', '0.4', '--json']);
  assert.equal(r.physicalCloses, 1);
});

test('after-hook repeats idempotent close without closing another instance', async () => {
  const r = await exercise();
  assert.equal(r.hasPrimaryError, false, r.primaryError?.stack);
  assert.equal(r.closeCalls, 2);
  assert.equal(r.closeStarts, 1);
  assert.equal(r.physicalCloses, 1);
  assert.equal(r.active, 0);
});

test('actual CLI status assertion preserves its failure after successful close', async () => {
  const r = await exercise({ cliFails: true });
  assert.equal(r.hasPrimaryError, true);
  assert.equal(r.primaryError.code, 'ERR_ASSERTION');
  assert.match(r.primaryError.message, /fixture CLI failure/);
  assert.equal(r.cleanupError, undefined);
  assert.equal(r.argv.length, 1);
  assert.equal(r.closeStarts, 1);
  assert.equal(r.physicalCloses, 1);
});

test('last UI rejection keeps the primary error and fallback closes without CLI', async () => {
  const r = await exercise({ uiFails: true });
  assert.equal(r.primaryError, r.uiError);
  assert.equal(r.cleanupError, undefined);
  assert.equal(r.argv.length, 0);
  assert.equal(r.physicalCloses, 1);
});

test('session rejection keeps its error and registered after-hook closes', async () => {
  const r = await exercise({ sessionFails: true });
  assert.equal(r.primaryError, r.sessionError);
  assert.equal(r.cleanupError, undefined);
  assert.equal(r.argv.length, 0);
  assert.equal(r.physicalCloses, 1);
});

test('rejected close prevents CLI and preserves primary plus fallback rejection', async () => {
  const r = await exercise({ closeFails: true });
  assert.equal(r.primaryError, r.closeError);
  assert.equal(r.cleanupError, r.closeError);
  assert.equal(r.argv.length, 0);
  assert.equal(r.closeCalls, 2);
  assert.equal(r.closeStarts, 1);
  assert.equal(r.physicalCloses, 0);
});
