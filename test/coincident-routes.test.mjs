import { test, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { exec, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const archifyBin = fileURLToPath(new URL('../archify/bin/archify.mjs', import.meta.url));
const __dirname = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-coincident-'));
after(() => fs.rmSync(__dirname, { recursive: true, force: true }));

test('architecture coincidence warnings do not change other diagram contracts', () => {
  const file = path.join(__dirname, 'workflow.html');
  fs.writeFileSync(file, '<html><svg viewBox="0 0 400 200" data-diagram-type="workflow" data-quality-profile="showcase">'
    + '<path data-edge-from="a" data-edge-to="b" data-edge-id="first" data-composition-points="0,100;400,100" d="M 0 100 L 400 100"/>'
    + '<path data-edge-from="b" data-edge-to="a" data-edge-id="second" data-composition-points="400,100;0,100" d="M 400 100 L 0 100"/>'
    + '</svg></html>');
  const receipt = JSON.parse(execFileSync(process.execPath, [path.resolve(path.dirname(archifyBin), '../scripts/check-render-output.mjs'), file], { encoding: 'utf8' }));
  assert.equal(receipt.composition.issues.some(issue => issue.code === 'composition/coincident-routes'), false);
});

test('anti-parallel connections with labelAt warn in showcase composition', async () => {
  const json = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html',
      title: 'Two directions between one pair',
      quality_profile: 'showcase',
      viewBox: [900, 420],
    },
    components: [
      { id: 'graph', type: 'backend', label: 'the graph', pos: [80, 170], size: [200, 62] },
      { id: 'engine', type: 'backend', label: 'the engine', pos: [430, 170], size: [200, 62] },
    ],
    connections: [
      { id: 'reads', from: 'graph', to: 'engine', label: 'lists', labelAt: [355, 150] },
      { id: 'declares', from: 'engine', to: 'graph', label: 'declares', labelAt: [355, 260] },
    ],
  };

  const tempInput = path.join(__dirname, 'temp-antiparallel-labelat.json');
  const tempOutput = path.join(__dirname, 'temp-antiparallel-labelat.html');

  try {
    fs.writeFileSync(tempInput, JSON.stringify(json, null, 2));

    const { stdout } = await execAsync(
      `node "${archifyBin}" deliver architecture "${tempInput}" "${tempOutput}" --quality showcase --json`
    );
    const result = JSON.parse(stdout);
    assert.equal(result.ok, true);
    assert.equal(result.validation.compositionStatus, 'pass');
    assert.equal(result.validation.errors, 0);
    assert.ok(result.validation.warnings >= 1);
  } finally {
    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
  }
});

test('clearly attributed coincident directions remain deliverable with a warning', async () => {
  const json = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html', title: 'Attributed bidirectional line', quality_profile: 'showcase', viewBox: [900, 420] },
    components: [
      { id: 'graph', type: 'backend', label: 'the graph', pos: [80, 170], size: [200, 62] },
      { id: 'engine', type: 'backend', label: 'the engine', pos: [430, 170], size: [200, 62] },
    ],
    connections: [
      { id: 'reads', from: 'graph', to: 'engine', label: 'graph -> engine: lists', labelAt: [355, 150] },
      { id: 'declares', from: 'engine', to: 'graph', label: 'engine -> graph: declares', labelAt: [355, 260] },
    ],
  };
  const input = path.join(__dirname, 'temp-attributed-antiparallel.json');
  const output = path.join(__dirname, 'temp-attributed-antiparallel.html');
  try {
    fs.writeFileSync(input, JSON.stringify(json, null, 2));
    const { stdout } = await execAsync(
      `node "${archifyBin}" deliver architecture "${input}" "${output}" --quality showcase --json`
    );
    const result = JSON.parse(stdout);
    assert.equal(result.ok, true);
    assert.equal(result.validation.errors, 0);
    assert.ok(result.validation.warnings >= 1);
  } finally {
    if (fs.existsSync(input)) fs.unlinkSync(input);
    if (fs.existsSync(output)) fs.unlinkSync(output);
  }
});

test('automatic anti-parallel routes preserve both labels with valid separation', async () => {
  const json = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html',
      title: 'Two directions, auto spread',
      quality_profile: 'showcase',
      viewBox: [900, 420],
    },
    components: [
      { id: 'graph', type: 'backend', label: 'the graph', pos: [80, 170], size: [200, 62] },
      { id: 'engine', type: 'backend', label: 'the engine', pos: [430, 170], size: [200, 62] },
    ],
    connections: [
      { id: 'reads', from: 'graph', to: 'engine', label: 'lists' },
      { id: 'declares', from: 'engine', to: 'graph', label: 'declares' },
    ],
  };

  const tempInput = path.join(__dirname, 'temp-antiparallel-auto.json');
  const tempOutput = path.join(__dirname, 'temp-antiparallel-auto.html');

  try {
    fs.writeFileSync(tempInput, JSON.stringify(json, null, 2));

    const { stdout } = await execAsync(
      `node "${archifyBin}" deliver architecture "${tempInput}" "${tempOutput}" --quality showcase --json`
    );
    assert.equal(JSON.parse(stdout).ok, true);
    const html = fs.readFileSync(tempOutput, 'utf8');
    const points = [...html.matchAll(/data-composition-points="([^"]+)"/g)].map(match => match[1]);
    assert.equal(points.length, 2);
    assert.notEqual(points[0], points[1]);
    assert.match(html, />lists</);
    assert.match(html, />declares</);
  } finally {
    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
  }
});

test('same-direction connections with labelAt warn if coincident', async () => {
  const json = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html',
      title: 'Two same-direction with labelAt',
      quality_profile: 'showcase',
      viewBox: [900, 420],
    },
    components: [
      { id: 'a', type: 'backend', label: 'A', pos: [80, 170], size: [200, 62] },
      { id: 'b', type: 'backend', label: 'B', pos: [430, 170], size: [200, 62] },
    ],
    connections: [
      { id: 'conn1', from: 'a', to: 'b', label: 'first', labelAt: [355, 190] },
      { id: 'conn2', from: 'a', to: 'b', label: 'second', labelAt: [355, 210] },
    ],
  };

  const tempInput = path.join(__dirname, 'temp-samedirection-labelat.json');
  const tempOutput = path.join(__dirname, 'temp-samedirection-labelat.html');

  try {
    fs.writeFileSync(tempInput, JSON.stringify(json, null, 2));

    await assert.rejects(
      execAsync(`node "${archifyBin}" deliver architecture "${tempInput}" "${tempOutput}" --quality showcase --json`),
      (error) => {
        const result = JSON.parse(error.stdout);
        assert.equal(result.ok, false);
        assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'composition/label-route-clearance'));
        assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'composition/coincident-routes' && diagnostic.severity === 'warning'));
        return true;
      },
    );
  } finally {
    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
  }
});

test('non-showcase quality does not enforce coincident route check', async () => {
  const json = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html',
      title: 'Standard quality',
      // No quality_profile = standard
      viewBox: [900, 420],
    },
    components: [
      { id: 'graph', type: 'backend', label: 'the graph', pos: [80, 170], size: [200, 62] },
      { id: 'engine', type: 'backend', label: 'the engine', pos: [430, 170], size: [200, 62] },
    ],
    connections: [
      { id: 'reads', from: 'graph', to: 'engine', label: 'lists', labelAt: [355, 150] },
      { id: 'declares', from: 'engine', to: 'graph', label: 'declares', labelAt: [355, 260] },
    ],
  };

  const tempInput = path.join(__dirname, 'temp-standard-quality.json');
  const tempOutput = path.join(__dirname, 'temp-standard-quality.html');

  try {
    fs.writeFileSync(tempInput, JSON.stringify(json, null, 2));

    const { stdout } = await execAsync(
      `node "${archifyBin}" deliver architecture "${tempInput}" "${tempOutput}" --json`
    );

    const result = JSON.parse(stdout);
    // Standard quality should pass (not enforcing coincident route check)
    assert.equal(result.ok, true, 'Standard quality should pass without coincident route check');
  } finally {
    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
  }
});

test('CLI --quality showcase override reports coincident routes even without source quality_profile', async () => {
  // Regression test for PR review: ensure CLI override works
  const json = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html',
      title: 'CLI override test',
      // Intentionally omit quality_profile
      viewBox: [900, 420],
    },
    components: [
      { id: 'graph', type: 'backend', label: 'the graph', pos: [80, 170], size: [200, 62] },
      { id: 'engine', type: 'backend', label: 'the engine', pos: [430, 170], size: [200, 62] },
    ],
    connections: [
      { id: 'reads', from: 'graph', to: 'engine', label: 'lists', labelAt: [355, 150] },
      { id: 'declares', from: 'engine', to: 'graph', label: 'declares', labelAt: [355, 260] },
    ],
  };

  const tempInput = path.join(__dirname, 'temp-cli-override.json');
  const tempOutput = path.join(__dirname, 'temp-cli-override.html');

  try {
    fs.writeFileSync(tempInput, JSON.stringify(json, null, 2));

    const { stdout } = await execAsync(
      `node "${archifyBin}" deliver architecture "${tempInput}" "${tempOutput}" --quality showcase --json`
    );
    const result = JSON.parse(stdout);
    assert.equal(result.ok, true);
    assert.equal(result.validation.compositionProfile, 'showcase');
    assert.ok(result.validation.warnings >= 1);
  } finally {
    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
  }
});

test('canonical route keys detect reversed geometry regardless of coordinate digit count', async () => {
  const json = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html',
      title: 'Numeric normalization test',
      quality_profile: 'showcase',
      viewBox: [900, 420],
    },
    components: [
      { id: 'a', type: 'backend', label: 'Node A', pos: [50, 170], size: [80, 62] },
      { id: 'b', type: 'backend', label: 'Node B', pos: [200, 170], size: [80, 62] },
    ],
    connections: [
      { id: 'fwd', from: 'a', to: 'b', label: 'forward', labelAt: [125, 180] },
      { id: 'rev', from: 'b', to: 'a', label: 'reverse', labelAt: [125, 220] },
    ],
  };

  const tempInput = path.join(__dirname, 'temp-numeric-edge-case.json');
  const tempOutput = path.join(__dirname, 'temp-numeric-edge-case.html');

  try {
    fs.writeFileSync(tempInput, JSON.stringify(json, null, 2));

    await assert.rejects(
      async () => {
        await execAsync(
          `node "${archifyBin}" deliver architecture "${tempInput}" "${tempOutput}" --quality showcase --json`
        );
      },
      (err) => {
        const result = JSON.parse(err.stdout);
        assert.equal(result.ok, false, 'Should detect coincident routes');
        const hasCoincidentDiagnostic = result.diagnostics?.some(
          (d) => d.code === 'composition/coincident-routes' && d.evidence?.antiParallel === true
        );
        assert.ok(hasCoincidentDiagnostic, 'Should detect anti-parallel coincident routes with numeric normalization');
        return true;
      },
      'Should detect coincidence regardless of coordinate digit count'
    );
  } finally {
    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
  }
});

for (const reverseOrder of [false, true]) {
  test(`redundant collinear via preserves coincidence and direction (reverse order: ${reverseOrder})`, async () => {
    const connections = [
      { id: 'reads', from: 'graph', to: 'engine', label: 'lists', labelAt: [355, 150] },
      { id: 'declares', from: 'engine', to: 'graph', label: 'declares', via: [[355, 201]], labelAt: [355, 260] },
    ];
    if (reverseOrder) connections.reverse();
    const input = path.join(__dirname, `collinear-${reverseOrder}.json`);
    fs.writeFileSync(input, JSON.stringify({
      schema_version: 1,
      diagram_type: 'architecture',
      meta: { output: 'diagram.html', title: 'Collinear coincidence', viewBox: [900, 420] },
      components: [
        { id: 'graph', type: 'backend', label: 'the graph', pos: [80, 170], size: [200, 62] },
        { id: 'engine', type: 'backend', label: 'the engine', pos: [430, 170], size: [200, 62] },
      ],
      connections,
    }));
    const { stdout } = await execAsync(
      `node "${archifyBin}" validate architecture "${input}" --quality showcase --json`
    );
    const receipt = JSON.parse(stdout);
    assert.equal(receipt.ok, true);
    const diagnostic = receipt.composition.issues.find((entry) => entry.code === 'composition/coincident-routes');
    assert.ok(diagnostic);
    assert.equal(diagnostic.severity, 'warning');
    assert.equal(diagnostic.antiParallel, true);
    assert.equal(diagnostic.relationship.id, connections[1].id);
    assert.equal(diagnostic.otherRelationship.id, connections[0].id);
    assert.equal(diagnostic.sharedPoints, '280,201;430,201');
  });
}

test('explicit via geometry separates an anti-parallel pair and keeps both labels', async () => {
  // Success regression: the documented repair routes one edge around the pair
  // instead of removing labelAt, so both labels survive and showcase passes.
  const json = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html',
      title: 'Repaired anti-parallel pair',
      quality_profile: 'showcase',
      viewBox: [900, 420],
    },
    components: [
      { id: 'graph', type: 'backend', label: 'the graph', pos: [80, 170], size: [200, 62] },
      { id: 'engine', type: 'backend', label: 'the engine', pos: [430, 170], size: [200, 62] },
    ],
    connections: [
      {
        id: 'reads',
        from: 'graph',
        to: 'engine',
        label: 'lists',
        fromSide: 'top',
        toSide: 'top',
        via: [[180, 100], [530, 100]],
        labelAt: [355, 80],
      },
      { id: 'declares', from: 'engine', to: 'graph', label: 'declares', labelAt: [355, 260] },
    ],
  };

  const tempInput = path.join(__dirname, 'temp-antiparallel-repaired.json');
  const tempOutput = path.join(__dirname, 'temp-antiparallel-repaired.html');

  try {
    fs.writeFileSync(tempInput, JSON.stringify(json, null, 2));

    const { stdout } = await execAsync(
      `node "${archifyBin}" deliver architecture "${tempInput}" "${tempOutput}" --quality showcase --json`
    );

    const result = JSON.parse(stdout);
    assert.equal(result.ok, true, 'Explicit via geometry should pass showcase');

    const hasCoincidentDiagnostic = result.diagnostics?.some(
      (d) => d.code === 'composition/coincident-routes'
    );
    assert.ok(!hasCoincidentDiagnostic, 'Separated routes are not coincident');
  } finally {
    if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
  }
});

test('partial labelAt removal retains warnings; fully automatic labels can separate routes', async () => {
  const base = {
    schema_version: 1,
    diagram_type: 'architecture',
    meta: { output: 'diagram.html',
      title: 'labelAt removal does not repair',
      quality_profile: 'showcase',
      viewBox: [900, 420],
    },
    components: [
      { id: 'graph', type: 'backend', label: 'the graph', pos: [80, 170], size: [200, 62] },
      { id: 'engine', type: 'backend', label: 'the engine', pos: [430, 170], size: [200, 62] },
    ],
    connections: [
      { id: 'reads', from: 'graph', to: 'engine', label: 'lists', labelAt: [355, 150] },
      { id: 'declares', from: 'engine', to: 'graph', label: 'declares', labelAt: [355, 260] },
    ],
  };

  const cases = [
    { name: 'first', drop: ['reads'], expected: 'composition/coincident-routes' },
    { name: 'second', drop: ['declares'], expected: 'composition/coincident-routes' },
    { name: 'both', drop: ['reads', 'declares'], expected: null },
  ];

  for (const { name, drop, expected } of cases) {
    const json = JSON.parse(JSON.stringify(base));
    for (const conn of json.connections) {
      if (drop.includes(conn.id)) delete conn.labelAt;
    }

    const tempInput = path.join(__dirname, `temp-labelat-removal-${name}.json`);
    const tempOutput = path.join(__dirname, `temp-labelat-removal-${name}.html`);

    try {
      fs.writeFileSync(tempInput, JSON.stringify(json, null, 2));

      if (expected === 'composition/coincident-routes') {
        const { stdout } = await execAsync(
          `node "${archifyBin}" validate architecture "${tempInput}" --quality showcase --json`
        );
        const result = JSON.parse(stdout);
        assert.equal(result.ok, true);
        assert.ok(result.composition.issues.some((issue) => issue.code === expected && issue.severity === 'warning'));
      } else {
        const { stdout } = await execAsync(
          `node "${archifyBin}" deliver architecture "${tempInput}" "${tempOutput}" --quality showcase --json`
        );
        const result = JSON.parse(stdout);
        assert.equal(result.ok, true);
        assert.equal(result.validation.errors, 0);
        assert.equal((result.validation.compositionIssues || []).some(issue => issue.code === 'composition/coincident-routes'), false);
        const html = fs.readFileSync(tempOutput, 'utf8');
        assert.match(html, />lists</);
        assert.match(html, />declares</);
      }
    } finally {
      if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
      if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
    }
  }
});
