import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { desktopBrowser as defaultDesktopBrowser } from './desktop-browser.mjs';

// The factory permits process-free lifecycle tests of these exact helpers.
export function createSvgBrowserHelpers(chrome, desktopBrowser = defaultDesktopBrowser) {
  async function closeAfterRead(close, hasPrimaryError, primaryError) {
    try { await close(); }
    catch (cleanupError) {
      if (hasPrimaryError) throw new AggregateError([primaryError, cleanupError], 'SVG inspection and browser cleanup failed');
      throw cleanupError;
    }
  }

  async function openHost(t, hostFile, colorScheme) {
    const browser = desktopBrowser(chrome);
    let closePromise;
    const close = () => closePromise ??= Promise.resolve().then(() => browser.close());
    t.after(close);
    try {
      const session = await browser.sessionPromise;
      const send = (method, params = {}) => browser.cdp.send(method, params, session);
      async function run(expression) {
        const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        assert.equal(result.exceptionDetails, undefined, result.exceptionDetails?.exception?.description);
        return result.result?.value;
      }
      await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.pageErrors=[];addEventListener('error',e=>pageErrors.push(e.message));` });
      await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 2400, deviceScaleFactor: 1, mobile: false });
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: colorScheme }] });
      const loaded = browser.cdp.waitFor('Page.loadEventFired', session);
      await send('Page.navigate', { url: pathToFileURL(hostFile).href });
      await loaded;
      await run(`Promise.all([...(document.images || [])].map((img) => img.complete ? Promise.resolve() : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; })))`);
      return { run, send, close };
    } catch (error) {
      await closeAfterRead(close, true, error);
      throw error;
    }
  }

  async function readHost(t, hostFile, colorScheme, expression) {
    const { run, close } = await openHost(t, hostFile, colorScheme);
    let primaryError, hasPrimaryError = false;
    try { return await run(expression); }
    catch (error) { hasPrimaryError = true; primaryError = error; throw error; }
    finally { await closeAfterRead(close, hasPrimaryError, primaryError); }
  }

  // Opens the baked SVG as the document itself so its geometry can be measured;
  // the file carries no scripts, so only the test's own CDP evaluation runs.
  async function measureSvg(t, svgFile, colorScheme) {
    const { run, close } = await openHost(t, svgFile, colorScheme);
    let primaryError, hasPrimaryError = false;
    try { return await run(`(() => {
    const root = document.documentElement;
    const rootBox = root.getBoundingClientRect();
    const box = (el) => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
    const inside = (r) => r.left >= rootBox.left - 0.5 && r.top >= rootBox.top - 0.5 && r.right <= rootBox.right + 0.5 && r.bottom <= rootBox.bottom + 0.5;
    const visible = (el) => {
      for (let cur = el; cur && cur.nodeType === 1; cur = cur.parentElement) {
        if (getComputedStyle(cur).display === 'none') return false;
      }
      return true;
    };
    const texts = [...document.querySelectorAll('text')].filter((el) => el.textContent.trim() && !el.closest('defs') && visible(el))
      .map((el) => ({ text: el.textContent.trim(), ...box(el), inside: inside(el.getBoundingClientRect()), decoration: getComputedStyle(el).textDecorationLine }));
    const badges = [...document.querySelectorAll('[data-change-badge]')].map((el) => {
      const mask = el.querySelector('rect.c-mask');
      const rect = el.querySelector('rect:not(.c-mask)') || el.querySelector('rect');
      const glyph = el.querySelector('text');
      const r = box(rect), g = box(glyph);
      return { change: el.getAttribute('data-change-badge'), hasMask: Boolean(mask), rect: r, glyph: g, inside: inside(rect.getBoundingClientRect()),
        glyphInside: g.left >= r.left - 0.5 && g.right <= r.right + 0.5 && g.top >= r.top - 0.5 && g.bottom <= r.bottom + 0.5 };
    });
    const edgePrefixes = [...document.querySelectorAll('tspan[class*="t-change-badge-"]')].map((el) => {
      const r = box(el);
      return { text: el.textContent.trim(), ...r, inside: inside(el.getBoundingClientRect()) };
    });
    const nodeLabels = [...document.querySelectorAll('text[data-node-label]')].map((el) => ({
      text: el.textContent.trim(), ...box(el),
    }));
    const removed = [...document.querySelectorAll('[data-change="removed"]')].map((el) => {
      const shapes = [...el.querySelectorAll('rect, path, circle, polygon')].concat(el.matches('rect, path') ? [el] : []);
      return { dashed: shapes.some((shape) => getComputedStyle(shape).strokeDasharray !== 'none'),
        struck: [...el.querySelectorAll('text')].some((text) => getComputedStyle(text).textDecorationLine.includes('line-through')),
        opacity: Number(getComputedStyle(el).opacity) };
    });
    return { root: { width: rootBox.width, height: rootBox.height }, texts, badges, edgePrefixes, nodeLabels, removed, errors: pageErrors };
  })()`); }
    catch (error) { hasPrimaryError = true; primaryError = error; throw error; }
    finally { await closeAfterRead(close, hasPrimaryError, primaryError); }
  }

  return { openHost, readHost, measureSvg };
}
