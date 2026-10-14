import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ChromeVisualBrowser, findChrome } from '../archify/bin/visual-check.mjs';

const root = fileURLToPath(new URL('../archify/', import.meta.url));
const chrome = Object.hasOwn(process.env, 'ARCHIFY_CHROME') ? findChrome() : null;
if (Object.hasOwn(process.env, 'ARCHIFY_CHROME') && !chrome) throw new Error('ARCHIFY_CHROME is not executable');

test('Viewer keyboard boundaries preserve IME, modifiers and ordinary navigation', {
  skip: chrome ? false : 'Set ARCHIFY_CHROME for real-browser keyboard checks.',
}, async t => {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-keyboard-'));
  t.after(() => fs.rmSync(scratch, { recursive: true, force: true }));
  const spec = JSON.parse(fs.readFileSync(path.join(root, 'examples/web-app.architecture.json')));
  spec.meta.views = [
    { id: 'app', label: 'Application', focus: ['api', 'web'] },
    { id: 'data', label: 'Data', focus: ['db'] },
  ];
  const input = path.join(scratch, 'input.json'), output = path.join(scratch, 'viewer.html');
  fs.writeFileSync(input, JSON.stringify(spec));
  execFileSync(process.execPath, [path.join(root, 'renderers/architecture/render-architecture.mjs'), input, output]);
  const browser = new ChromeVisualBrowser(chrome);
  t.after(() => browser.close());
  const session = await browser.sessionPromise;
  const send = (method, params = {}) => browser.cdp.send(method, params, session);
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  const run = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    assert.equal(result.exceptionDetails, undefined, result.exceptionDetails?.exception?.description);
    return result.result.value;
  };
  async function load(legacy = false) {
    await browser.inspect({ artifactPath: legacy ? fileURLToPath(new URL('../docs/cases/community/shanghai-citywalk.html', import.meta.url)) : output, width: 1440, height: 900, theme: 'light' });
    await run(`window.keyboardProbe = (target, key, flags = {}) => {
      target.focus?.({preventScroll:true});
      const before = document.activeElement;
      const event = new KeyboardEvent('keydown', {key, bubbles:true, cancelable:true, ...flags});
      target.dispatchEvent(event);
      return {prevented:event.defaultPrevented, focused:document.activeElement === before};
    }`);
  }
  const ime = [{ isComposing: true }, { keyCode: 229 }];
  const modifiers = ['ctrlKey', 'altKey', 'metaKey', 'shiftKey'];

  await t.test('global shortcuts ignore composition including the WebKit commit signal', async () => {
    for (const flags of ime) {
      await load();
      const results = await run(`['/', '?', 't', 's', 'e', 'f', 'm', 'l', 'r', '+', '-', '0', '[', ']', 'p', 'Escape'].map(key => {
        const event = new KeyboardEvent('keydown', {key,bubbles:true,cancelable:true,...${JSON.stringify(flags)}});
        document.dispatchEvent(event); return {key, prevented:event.defaultPrevented};
      })`);
      assert.deepEqual(results.filter(r => r.prevented), []);
      assert.equal(await run('Archify.finder.isOpen() || Archify.guide.isOpen() || Archify.exportMenu.isOpen()'), false);
    }
  });
  await t.test('Finder keeps composing Enter/Escape and modified text navigation native', async () => {
    await load();
    for (const flags of ime) {
      await run(`Archify.finder.open(); var input=document.getElementById('node-finder-input'); input.value='API'; input.dispatchEvent(new Event('input')); input.focus()`);
      for (const key of ['ArrowDown', 'Enter', 'Escape']) {
        assert.deepEqual(await run(`keyboardProbe(document.getElementById('node-finder-input'),${JSON.stringify(key)},${JSON.stringify(flags)})`), { prevented:false, focused:true });
        assert.equal(await run('Archify.finder.isOpen()'), true);
      }
    }
    for (const modifier of modifiers) {
      assert.deepEqual(await run(`keyboardProbe(document.getElementById('node-finder-input'),'ArrowDown',{${modifier}:true})`), { prevented:false, focused:true });
      await run('Archify.finder.open()');
      assert.equal(await run(`keyboardProbe(document.getElementById('node-finder-input'),'Enter',{${modifier}:true}).prevented`), true);
      assert.equal(await run('Archify.finder.isOpen()'), false, 'modified Enter keeps its existing selection behavior');
      await run('Archify.finder.open()');
    }
    assert.equal(await run(`keyboardProbe(document.getElementById('node-finder-input'),'ArrowDown').prevented`), true);
  });
  await t.test('menus leave modified navigation native but retain normal arrows and Shift+?', async () => {
    for (const name of ['preset', 'exportMenu']) {
      await load();
      const prefix = name === 'preset' ? 'preset' : 'export';
      for (const modifier of modifiers) {
        assert.equal(await run(`keyboardProbe(document.getElementById('btn-${prefix}'),'ArrowDown',{${modifier}:true}).prevented`), false);
        assert.equal(await run(`Archify.${name}.isOpen()`), false);
      }
      assert.equal(await run(`keyboardProbe(document.getElementById('btn-${prefix}'),'ArrowDown').prevented`), true);
      assert.equal(await run(`Archify.${name}.isOpen()`), true);
      for (const flags of [...ime, ...modifiers.map(m => ({[m]:true}))]) {
        for (const key of ['ArrowDown', 'Home', 'End']) {
          assert.deepEqual(await run(`keyboardProbe(document.querySelector('#${prefix}-menu button:not(:disabled)'),'${key}',${JSON.stringify(flags)})`), { prevented:false, focused:true });
        }
      }
    }
    await run('Archify.exportMenu.close()');
    assert.equal(await run(`keyboardProbe(document.body,'?',{shiftKey:true}).prevented`), true);
    assert.equal(await run('Archify.guide.isOpen()'), true);
  });
  await t.test('local panels keep composing dismissal and Guide navigation inert', async () => {
    for (const name of ['semanticLens', 'guide', 'radar']) {
      await load();
      await run(`Archify.${name}.open()`);
      assert.equal(await run(`Archify.${name}.isOpen()`), true);
      const panel = { semanticLens:'semantic-lens', guide:'diagram-guide', radar:'overview-map' }[name];
      for (const flags of ime) {
        assert.equal(await run(`keyboardProbe(document.getElementById('${panel}'),'Escape',${JSON.stringify(flags)}).prevented`), false);
        assert.equal(await run(`Archify.${name}.isOpen()`), true);
      }
      if (name === 'guide') {
        for (const flags of [...ime, ...modifiers.map(m => ({[m]:true}))]) {
          for (const key of ['ArrowDown','Home','End']) assert.deepEqual(await run(`keyboardProbe(document.querySelector('#diagram-guide [data-guide-action]'),'${key}',${JSON.stringify(flags)})`), {prevented:false,focused:true});
        }
      }
      assert.equal(await run(`keyboardProbe(document.getElementById('${panel}'),'Escape').prevented`), true);
      assert.equal(await run(`Archify.${name}.isOpen()`), false);
    }
  });
  await t.test('roving controls ignore modifiers and composition without changing focus', async () => {
    const surfaces = [
      { name:'Finder results', setup:'Archify.finder.open()', selector:'#node-finder-results button' },
      { name:'Passport', setup:"Archify.focus.set('api')", selector:'#relationship-lens-list [data-relationship-target]' },
      { name:'direct relationships', setup:'', selector:'[data-relationship-hit-key]' },
      { name:'legend', setup:'', selector:'[data-legend-kind][role="button"]' },
      { name:'Lens kinds', setup:'Archify.semanticLens.open()', selector:'#semantic-lens-kinds button:not(:disabled)' },
      { name:'chapters', legacy:true, setup:'', selector:'#guided-view-chapters [data-guided-view-id]' },
      { name:'Journey', setup:"Archify.routeProbe.begin({source:'api'});Archify.routeProbe.choose('db')", selector:'#route-probe-path [data-route-journey-index]' },
    ];
    for (const surface of surfaces) {
      await load(surface.legacy);
      if (surface.setup) await run(surface.setup);
      assert.ok(await run(`document.querySelectorAll(${JSON.stringify(surface.selector)}).length >= 2`), surface.name+' needs real controls');
      for (const flags of [...ime, ...modifiers.map(m => ({[m]:true}))]) {
        for (const key of ['ArrowDown','ArrowRight','Home','End']) {
          assert.deepEqual(await run(`keyboardProbe(document.querySelector(${JSON.stringify(surface.selector)}),${JSON.stringify(key)},${JSON.stringify(flags)})`), { prevented:false, focused:true }, surface.name+' '+key+' '+JSON.stringify(flags));
        }
      }
      const normal = await run(`keyboardProbe(document.querySelector(${JSON.stringify(surface.selector)}),'End')`);
      assert.equal(normal.prevented, true, surface.name+' ordinary End');
      assert.equal(normal.focused, false, surface.name+' ordinary End must move focus');
    }
  });
  await t.test('self-calls retain relationship selection and canonical SVG export', async () => {
    const sequence = {
      schema_version:1, diagram_type:'sequence',
      meta:{title:'Self-call export',output:'self.html',quality_profile:'showcase'},
      participants:[{id:'cache',type:'backend',label:'Cache'},{id:'worker',type:'backend',label:'Worker'}],
      messages:[{id:'evict',from:'cache',to:'cache',y:210,label:'evict(key)',note:'Preserve internal ownership'},
        {id:'notify',from:'cache',to:'worker',y:330,label:'notify(key)'},
        {id:'store',from:'worker',to:'worker',y:420,label:'store(key)'}],
    };
    const source=path.join(scratch,'self.json'), file=path.join(scratch,'self.html');
    fs.writeFileSync(source,JSON.stringify(sequence));
    execFileSync(process.execPath,[path.join(root,'renderers/sequence/render-sequence.mjs'),source,file]);
    await browser.inspect({artifactPath:file,width:1440,height:900,theme:'light'});
    await send('Browser.setDownloadBehavior',{behavior:'deny'});
    const result=await run(`(async()=>{
      const svg=document.querySelector('.diagram-container > svg');
      const paths=['evict','store'].map(id=>svg.querySelector('[data-edge-id="'+id+'"] path'));
      const routes=paths.map(p=>p.getAttribute('d'));
      const selected=Archify.focus.inspectRelationshipById('evict');
      const owner=Archify.focus.relationship();
      let exported;
      const original=URL.createObjectURL;
      URL.createObjectURL=blob=>{exported=blob;return original(blob);};
      try {await Archify.exportMenu.run('svg');}
      finally {URL.createObjectURL=original;}
      const text=await exported.text();
      const doc=new DOMParser().parseFromString(text,'image/svg+xml');
      return {selected,owner,sourceRoutes:routes,
        routes:['evict','store'].map(id=>doc.querySelector('[data-edge-id="'+id+'"] path').getAttribute('d')),
        note:text.includes('Preserve internal ownership'),
        parseError:!!doc.querySelector('parsererror'),
        liveUnchanged:paths.every((p,i)=>p.getAttribute('d')===routes[i])};
    })()`);
    assert.equal(result.selected,true);
    assert.equal(result.owner.id,'evict');
    assert.equal(result.owner.from,'cache');
    assert.equal(result.owner.to,'cache');
    assert.deepEqual(result.routes,result.sourceRoutes);
    assert.equal(result.note,true);
    assert.equal(result.parseError,false);
    assert.equal(result.liveUnchanged,true);
  });

});
