# Archify — BlueboxC fork

This fork integrates official Archify 3.1.0 (`v3.1.0`, commit
`1c2b42d660e4a7571813fb43839c79e3e9ca7720`) with our reviewed corrections.
It supports ten diagram types and the release's Viewer, workflow migration,
Preview and verified `finalize` delivery. Existing generated user artifacts are
not rewritten by upgrading the Skill.

## Preserved customizations

- Offline licensed JetBrains Mono: 3.1's six embedded WOFF2 subsets replace the
  old runtime TTF embedding while retaining the original licensed assets.
- Immutable Action references, read-only workflow defaults, no retained checkout
  credentials except the existing star-history publishing job, and fast-uri >=3.1.8 in both development dependency graphs.
- Independent artifact membership checks, version-scoped compare geometry,
  advisory coincident routes, complete checker output and retained Preview output.
- Concise DOX ownership contracts and source/package/installation reconciliation.

## Adapted corrections

| Report | Source contribution | Fork behavior |
| --- | --- | --- |
| [#395](https://github.com/tt-a1i/archify/issues/395) | [applesnort, PR501](https://github.com/tt-a1i/archify/pull/501), `5d8d9ad7a6083a53e19246722337ea03674fd6dd` | Authored boundary membership reaches the artifact checker. Showcase rejects fully enclosed non-members; partial overlap and standard-quality containment warn. Compare frames/nodes are scoped by rendered version. Older HTML without membership is explicitly unjudged. |
| [#248](https://github.com/tt-a1i/archify/issues/248) | [robll-v1, PR260](https://github.com/tt-a1i/archify/pull/260), `b8b752ef7e34b10ba52c57266c053639bf59e0dc` | Coincident architecture routes produce an actionable showcase warning without rewriting explicit routing or accepting unrelated hard failures. Other diagram types keep their existing contract. |
| [#590](https://github.com/tt-a1i/archify/issues/590) | [gold-beyond, PR538](https://github.com/tt-a1i/archify/pull/538), `08d057862abe5e65c72a6551d199320629ec8e82` | Piped children use a 64 MiB default. Captured checker calls accept `ARCHIFY_CHECK_MAX_BUFFER`; exhausted capture reports `artifact/check-output-limit` and preserves previous output. The direct checker streams. Natural checker shutdown also flushes complete JSON before exit. |
| [#927](https://github.com/tt-a1i/archify/issues/927) | [To3akaRin, PR930](https://github.com/tt-a1i/archify/pull/930), `83632403931d995c5d1507b31bc44d96a7e4c469` | New Preview clients restore the retained verified revision during checking/failure; status, diagnostics and same-revision focus remain intact. |

The upstream implementations and tests are adapted under MIT. Their inclusion
here does not imply that upstream has reviewed or merged our adaptations.
Archify 3.1 already rejects fully enclosed non-members during showcase rendering;
the independent artifact check additionally covers HTML and compare overlays.
`finalize` retains detailed coincident-route and straddling-boundary warnings for
manual review, while other showcase warnings and all hard errors remain blocking.
It still verifies artifact identities, delivery provenance and the browser gate.

## Verification and installation

Install development dependencies with `npm ci` at the root and in `archify/`.
Run root `npm run test:full`, `ARCHIFY_CHROME=/path/to/chrome npm run test:browser`
and `npm run test:webm`. The four focused regressions are in root `test/`:
boundary membership, coincident routes, checker buffer and Preview browser tests.
Skips are not passes. Browser tests use real Chrome; manual visual review remains
separate from automated containment and interaction evidence.

Build the canonical tracked-only ZIP with `scripts/build-zip.sh` under official
Node 22 and its bundled zlib. Repository tests are not installed with the Skill.
Qualify the extracted package independently. Update existing installations only
after a private backup and source/hash reconciliation; preserve local additions
and stop for conflicting edits. Machine receipts and rollback stay private.

Automatic GitHub Pages deployment runs only in the original repository. Fork
CI still builds and tests the website without requiring hosting setup.

The stable update manifest describes the published upstream release, not this
fork's customized ZIP. No fork release or automatic installation is implied.
