import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ChromeVisualBrowser, findChrome } from '../archify/bin/visual-check.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = path.join(root, 'archify');
const chrome = process.env.ARCHIFY_CHROME ? findChrome() : null;

test('Export downloads retain authored and fallback suffix-like titles across locales', {
  skip: chrome ? false : 'Set ARCHIFY_CHROME for actual download checks.',
}, async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-title-download-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const downloads = path.join(directory, 'downloads');
  fs.mkdirSync(downloads);
  const browser = new ChromeVisualBrowser(chrome);
  t.after(() => browser.close());
  const session = await browser.sessionPromise;
  const send = (method, params = {}) => browser.cdp.send(method, params, session);
  await browser.cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads });
  const run = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    assert.equal(result.exceptionDetails, undefined, result.exceptionDetails?.exception?.description);
    return result.result?.value;
  };
  async function download(expression, expected) {
    for (const name of fs.readdirSync(downloads)) fs.unlinkSync(path.join(downloads, name));
    await run(expression);
    const file = path.join(downloads, expected);
    const end = Date.now() + 8000;
    while (!fs.existsSync(file) && Date.now() < end) await new Promise(resolve => setTimeout(resolve, 40));
    assert.ok(fs.existsSync(file), `Expected ${expected}; got ${fs.readdirSync(downloads).join(', ')}`);
    assert.ok(fs.statSync(file).size > 0, expected);
    assert.deepEqual(fs.readdirSync(downloads), [expected]);
  }
  const base = JSON.parse(fs.readFileSync(path.join(skill, 'examples/web-app.architecture.json'), 'utf8'));
  for (const [locale, title, expected] of [
    ['en', 'Checkout Diagram', 'checkout-diagram'],
    ['es', 'Pagos Diagrama', 'pagos-diagrama'],
    ['ko', '결제 다이어그램', '결제-다이어그램'],
    ['ar', 'النظام مخطط', 'النظام-مخطط'],
    ['zh-CN', '支付 系统图', '支付-系统图'],
  ]) {
    const input = path.join(directory, 'input.json');
    const artifact = path.join(directory, 'page.html');
    fs.writeFileSync(input, JSON.stringify({ ...base, meta: { ...base.meta, locale, title } }));
    execFileSync(process.execPath, [path.join(skill, 'renderers/architecture/render-architecture.mjs'), input, artifact]);
    const loaded = browser.cdp.waitFor('Page.loadEventFired', session);
    await send('Page.navigate', { url: pathToFileURL(artifact).href });
    await loaded;
    await run('document.fonts.ready');
    assert.equal(await run(`document.querySelector('.header h1').textContent.trim()`), title);
    await download(`Archify.exportMenu.run('svg-light')`, expected + '-light.svg');
    await run(`document.querySelector('.header h1').remove(); document.title=${JSON.stringify(title)}`);
    await download(`Archify.exportMenu.run('svg-dark')`, expected + '-dark.svg');
  }
  await run(`document.title='Café Diagram'`);
  await download(`Archify.exportMenu.run('png')`, 'café-diagram.png');
  await run(`Archify.routeProbe.begin({source:'users',focusNode:false}); Archify.routeProbe.choose('db',{updateUrl:false})`);
  await download(`Archify.exportMenu.downloadRouteShareCard()`, 'café-diagram-route-share-card.png');
  await run(`document.title=''`);
  await download(`Archify.exportMenu.run('svg-light')`, 'diagram-light.svg');
});
