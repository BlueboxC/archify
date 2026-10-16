import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { analyzeSvgPath } from '../archify/renderers/shared/svg-path-analysis.mjs';
import { roundedPath, routePointsValue, segmentIntersectsRect } from '../archify/renderers/shared/geometry.mjs';

// Exercise the post-routing boundary without a CLI-only export or production
// refactor. These controlled fragments are not a complete public ERD fixture.
const source = fs.readFileSync(new URL('../archify/renderers/erd/render-erd.mjs', import.meta.url), 'utf8');
const constants = ['ERD_PORT_SPACING', 'TRUNK_BRIDGE', 'DEFAULT_RELATIONSHIP_STROKE_WIDTH']
  .map(name => {
    const line = source.match(new RegExp(`^const ${name} = [^\\n]+`, 'm'));
    assert.ok(line, `locate ${name}`);
    return line[0];
  }).join('\n');
const start = source.indexOf('function bundledTrunkPaths() {');
const end = source.indexOf('\nfunction defaultErLabelPoint(', start);
assert.ok(start >= 0 && end > start, 'locate the renderer-owned trunk assembler');

function renderTrunks({ horizontalFirst = false, separated = false, dashed = false } = {}) {
  const groups = [
    { axis: 0, coordinate: 0, style: 'default' },
    { axis: 1, coordinate: separated ? 60 : 0, style: dashed ? 'dashed' : 'default' },
  ];
  if (horizontalFirst) groups.reverse();
  const relationships = groups.flatMap(group => [[-50, -12], [12, 50]]
    .map(([low, high]) => ({ group, low, high })));
  const points = relationship => relationship.group.axis === 0
    ? [[relationship.group.coordinate, relationship.low], [relationship.group.coordinate, relationship.high]]
    : [[relationship.low, relationship.group.coordinate], [relationship.high, relationship.group.coordinate]];
  const html = vm.runInNewContext(`${constants}\n${source.slice(start, end)}\nbundledTrunkPaths()`, {
    relationships,
    relationshipTrunkRuns: relationship => [{ low: relationship.low, high: relationship.high }],
    trunkAssignments: new Map(relationships.map(relationship => [relationship, { group: relationship.group }])),
    markerStyleOf: relationship => relationship.group.style,
    renderableRelationship: () => true,
    pathFor: relationship => ({ points: points(relationship) }),
    relationshipStrokeWidth: () => 1.5,
    entities: new Map(),
    arrowClassMap: { default: ['a-default'], dashed: ['a-dashed'] },
    roundedPath, routePointsValue, segmentIntersectsRect,
  });
  const trunks = [...html.matchAll(/<path\b[^>]*\bd="([^"]+)"[^>]*>/g)].map(match => {
    const parsed = analyzeSvgPath(match[1]);
    assert.equal(parsed.ok, true);
    return { path: match[0], segments: parsed.subpaths.flatMap(part => part.segments) };
  });
  assert.ok(trunks.length > 0, 'the assembler must draw the retained runs');
  return trunks;
}

function perpendicularIntersection(a, b) {
  const vertical = Math.abs(a.start[0] - a.end[0]) < 0.0001;
  if (vertical === (Math.abs(b.start[0] - b.end[0]) < 0.0001)) return false;
  const v = vertical ? a : b, h = vertical ? b : a;
  return v.start[0] >= Math.min(h.start[0], h.end[0])
    && v.start[0] <= Math.max(h.start[0], h.end[0])
    && h.start[1] >= Math.min(v.start[1], v.end[1])
    && h.start[1] <= Math.max(v.start[1], v.end[1]);
}

for (const horizontalFirst of [false, true]) {
  for (const dashed of [false, true]) {
    test(`ERD trunk assembler keeps crossing added bridges separate (${horizontalFirst ? 'horizontal' : 'vertical'} first, ${dashed ? 'mixed' : 'same'} style)`, () => {
      const trunks = renderTrunks({ horizontalFirst, dashed });
      const segments = trunks.flatMap(trunk => trunk.segments);
      assert.equal(trunks.length, 3, 'one accepted bridge and two separate later runs survive');
      for (let i = 0; i < segments.length; i += 1) {
        for (let j = i + 1; j < segments.length; j += 1) {
          assert.equal(perpendicularIntersection(segments[i], segments[j]), false,
            'renderer-added ink must not create a junction between unrelated families');
        }
      }
      assert.ok(trunks.some(trunk => /a-default/.test(trunk.path)));
      if (dashed) assert.ok(trunks.some(trunk => /a-dashed/.test(trunk.path)), 'retain the later family style');
    });
  }

  test(`ERD trunk assembler preserves both clear bridges (${horizontalFirst ? 'horizontal' : 'vertical'} first)`, () => {
    const trunks = renderTrunks({ horizontalFirst, separated: true });
    assert.equal(trunks.length, 2, 'unrelated clear families retain both continuous buses');
    assert.ok(trunks.every(trunk => trunk.segments.length === 1
      && Math.hypot(trunk.segments[0].end[0] - trunk.segments[0].start[0],
        trunk.segments[0].end[1] - trunk.segments[0].start[1]) === 100));
  });
}
