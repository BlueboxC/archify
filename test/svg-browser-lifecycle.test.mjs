import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSvgBrowserHelpers } from './helpers/svg-browser.mjs';

function fixture(options = {}) {
  const { readError, setupError, cleanupError, sessionError, closeGate } = options;
  const hooks = [], stats = { active: 0, peak: 0, closes: 0 };
  const desktopBrowser = () => {
    stats.active++; stats.peak = Math.max(stats.peak, stats.active);
    let evaluations = 0;
    return {
      sessionPromise: Object.hasOwn(options, 'sessionError') ? Promise.reject(sessionError) : Promise.resolve('session'),
      cdp: {
        waitFor: () => Promise.resolve(),
        async send(method) {
          if (method === 'Runtime.evaluate') {
            evaluations++;
            if (evaluations === 1 && Object.hasOwn(options, 'setupError')) throw setupError;
            if (evaluations === 2 && Object.hasOwn(options, 'readError')) throw readError;
            return { result: { value: { observed: true } } };
          }
          return {};
        },
      },
      async close() {
        stats.closes++;
        if (closeGate) await closeGate;
        stats.active--;
        if (Object.hasOwn(options, 'cleanupError')) throw cleanupError;
      },
    };
  };
  return { helpers: createSvgBrowserHelpers('fake', desktopBrowser), stats,
    context: { after: hook => hooks.push(hook) }, hooks };
}

test('SVG host and geometry reads keep only one browser live', async () => {
  const f = fixture();
  for (const theme of ['dark', 'light']) {
    assert.deepEqual(await f.helpers.readHost(f.context, '/fixture/host.html', theme, 'observation'), { observed: true });
    assert.deepEqual(await f.helpers.measureSvg(f.context, '/fixture/image.svg', theme), { observed: true });
  }
  assert.ok(f.stats.peak <= 1, `independent reads retained ${f.stats.peak} browsers`);
  assert.equal(f.stats.active, 0);
  await Promise.all(f.hooks.map(hook => hook()));
  assert.equal(f.stats.closes, 4);
});

test('SVG host close is idempotent with the after fallback', async () => {
  const f = fixture(), host = await f.helpers.openHost(f.context, '/fixture/host.html', 'light');
  await Promise.all([host.close(), host.close(), ...f.hooks.map(hook => hook())]);
  assert.equal(f.stats.closes, 1);
  assert.equal(f.stats.active, 0);
});

for (const operation of ['readHost', 'measureSvg']) {
  test(`SVG ${operation} closes on a primary read failure`, async () => {
    const primary = new Error('read failed'), f = fixture({ readError: primary });
    await assert.rejects(f.helpers[operation](f.context, '/fixture/image.svg', 'light', 'observation'), error => error === primary);
    await Promise.all(f.hooks.map(hook => hook()));
    assert.equal(f.stats.closes, 1);
    assert.equal(f.stats.active, 0);
  });
}

test('SVG inspection retains both primary and cleanup errors', async () => {
  const primary = new Error('read failed'), cleanup = new Error('close failed');
  const f = fixture({ readError: primary, cleanupError: cleanup });
  await assert.rejects(f.helpers.measureSvg(f.context, '/fixture/image.svg', 'light'), error =>
    error instanceof AggregateError && error.errors[0] === primary && error.errors[1] === cleanup);
  await assert.rejects(f.hooks[0](), error => error === cleanup);
  assert.equal(f.stats.closes, 1);
});

test('SVG host setup failure still closes the browser', async () => {
  const primary = new Error('setup failed'), f = fixture({ setupError: primary });
  await assert.rejects(f.helpers.openHost(f.context, '/fixture/image.svg', 'light'), error => error === primary);
  await Promise.all(f.hooks.map(hook => hook()));
  assert.equal(f.stats.closes, 1);
  assert.equal(f.stats.active, 0);
});

test('SVG successful inspection exposes a cleanup failure', async () => {
  const cleanup = new Error('close failed'), f = fixture({ cleanupError: cleanup });
  await assert.rejects(f.helpers.readHost(f.context, '/fixture/image.svg', 'light', 'observation'), error => error === cleanup);
  assert.equal(f.stats.closes, 1);
});

for (const primary of [undefined, null, false, 0, '']) {
  test(`SVG inspection preserves a ${String(primary)} primary with cleanup failure`, async () => {
    const cleanup = new Error('close failed'), f = fixture({ readError: primary, cleanupError: cleanup });
    await assert.rejects(f.helpers.measureSvg(f.context, '/fixture/image.svg', 'light'), error =>
      error instanceof AggregateError && Object.is(error.errors[0], primary) && error.errors[1] === cleanup);
    assert.equal(f.stats.closes, 1);
  });
}

test('SVG rejected session still closes the browser', async () => {
  const primary = new Error('session failed'), f = fixture({ sessionError: primary });
  await assert.rejects(f.helpers.openHost(f.context, '/fixture/image.svg', 'light'), error => error === primary);
  await Promise.all(f.hooks.map(hook => hook()));
  assert.equal(f.stats.closes, 1);
  assert.equal(f.stats.active, 0);
});

test('SVG inspection waits for the browser close before returning', async () => {
  let release;
  const closeGate = new Promise(resolve => { release = resolve; }), f = fixture({ closeGate });
  let completed = false;
  const reading = f.helpers.readHost(f.context, '/fixture/host.html', 'light', 'observation').then(() => { completed = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(completed, false);
  assert.equal(f.stats.active, 1);
  release();
  await reading;
  assert.equal(f.stats.active, 0);
  await f.helpers.measureSvg(f.context, '/fixture/image.svg', 'dark');
  assert.equal(f.stats.peak, 1);
});
