import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../viewer/node-finder.js', import.meta.url), 'utf8');
function handler(target, { empty = false, focused = target === 'results' ? 'first' : 'input' } = {}) {
  const start = source.indexOf(`${target}.addEventListener('keydown', function (event) {`);
  const end = source.indexOf('\n      });', start);
  assert.ok(start >= 0 && end > start, `actual ${target} key handler exists`);
  const state = { focus: focused, selected: [] };
  const input = new EventTarget(), results = new EventTarget();
  const buttons = ['first', 'last'].map(id => ({ focus() { state.focus = id; } }));
  vm.runInNewContext(source.slice(start, end + '\n      });'.length), {
    input, results, document: { get activeElement() { return buttons.find((_, i) => state.focus === ['first', 'last'][i]); } },
    resultButtons: () => empty ? [] : buttons,
    visibleItems: empty ? [] : [{ id: 'api' }], select: id => state.selected.push(id),
  }, { timeout: 1000 });
  return (key, flags = {}) => {
    const event = new Event('keydown', { cancelable: true });
    Object.assign(event, { key, ...flags });
    (target === 'input' ? input : results).dispatchEvent(event);
    return { prevented: event.defaultPrevented, focus: state.focus, selected: [...state.selected] };
  };
}
const modifiers = ['ctrlKey', 'altKey', 'metaKey', 'shiftKey'];
const navigation = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
for (const modifier of modifiers) {
  test(`Finder ${modifier} Enter retains selection`, () => {
    assert.deepEqual(handler('input')('Enter', { [modifier]: true }), { prevented: true, focus: 'input', selected: ['api'] });
  });
  test(`Finder ${modifier} navigation stays native`, () => {
    for (const key of navigation) for (const target of ['input', 'results']) {
      assert.deepEqual(handler(target)(key, { [modifier]: true }), { prevented: false, focus: target === 'results' ? 'first' : 'input', selected: [] });
    }
  });
}
for (const [name, flags] of [['composition', { isComposing: true }], ['WebKit commit', { keyCode: 229 }]]) {
  test(`Finder ${name} leaves all selection and navigation native`, () => {
    for (const key of [...navigation, 'Enter', 'Escape']) for (const target of ['input', 'results']) for (const modifier of [null, ...modifiers]) {
      assert.deepEqual(handler(target)(key, { ...flags, ...(modifier ? { [modifier]: true } : {}) }), { prevented: false, focus: target === 'results' ? 'first' : 'input', selected: [] });
    }
  });
}
test('Finder ordinary Enter and ArrowDown retain their distinct actions', () => {
  assert.deepEqual(handler('input')('Enter'), { prevented: true, focus: 'input', selected: ['api'] });
  assert.deepEqual(handler('input')('ArrowDown'), { prevented: true, focus: 'first', selected: [] });
});
test('Finder empty results do not consume selection or ArrowDown', () => {
  for (const key of ['Enter', 'ArrowDown']) assert.deepEqual(handler('input', { empty: true })(key), { prevented: false, focus: 'input', selected: [] });
});

test('Finder ordinary result navigation retains focus movement', () => {
  for (const key of ['ArrowDown', 'ArrowUp', 'End']) assert.deepEqual(handler('results', { focused: 'first' })(key), { prevented: true, focus: 'last', selected: [] });
  assert.deepEqual(handler('results', { focused: 'last' })('Home'), { prevented: true, focus: 'first', selected: [] });
});
