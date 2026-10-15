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
| [#497](https://github.com/tt-a1i/archify/issues/497) | [To3akaRin, PR498](https://github.com/tt-a1i/archify/pull/498), `8dd52b6dce38890ee43233ebcc0b23c906b0e9ab` | Separate incomplete migration planning from complete semantic validation; retain source and final contracts. |
| [#821](https://github.com/tt-a1i/archify/issues/821) | [robll-v1, PR838](https://github.com/tt-a1i/archify/pull/838), `18c8e0ba17734d3ff2f2bd700617f2d489b07d87` | Identify the obstructing group and offer verified placement repairs. Additional membership comparison prevents absorbing unrelated left-hand nodes. |
| [#570](https://github.com/tt-a1i/archify/issues/570) | [Laurie-Lin, PR571](https://github.com/tt-a1i/archify/pull/571), `38cc72a7f30a37195795d67c5bde2362c308b648` | Render orthogonal self-calls with bounded labels, notes and timeline; preserve 3.1 context notes and their backgrounds. |
| [#602](https://github.com/tt-a1i/archify/issues/602) | [To3akaRin, PR605](https://github.com/tt-a1i/archify/pull/605), `dd20477020a683ee54aec002c2c9b3224161c188` | Validate WebP RIFF/chunk/frame bounds while retaining ICO range validation, candidate fallback and complete-byte pins. |
| [#890](https://github.com/tt-a1i/archify/issues/890) | [gold-beyond, PR891](https://github.com/tt-a1i/archify/pull/891), `02d9b494704f950bb14c1242afe1887d8f058ee3` | Typed measured canvas diagnostics; adapt repair checks to self-calls and withhold incomplete or unsafe two-bound segment repairs. |
| [#902](https://github.com/tt-a1i/archify/issues/902) | [outlier27-cell, PR904](https://github.com/tt-a1i/archify/pull/904), `5b2826ecfb7fc8f8400cb9e377b32806a15703b9` | Preserve Finder composition and commit key 229. |
| [#912](https://github.com/tt-a1i/archify/issues/912) | [outlier27-cell, PR913](https://github.com/tt-a1i/archify/pull/913), `f7dba910e38bc48be2360d6fc979d0e68d8bb56c` | Keep global shortcuts inert during composition. |
| [#925](https://github.com/tt-a1i/archify/issues/925) | [outlier27-cell, PR928](https://github.com/tt-a1i/archify/pull/928), `9484c4eb46840f934ef47b8436a548bbd1655d11` | Protect local panels and capture-phase selection during composition. |
| [#907](https://github.com/tt-a1i/archify/issues/907) | [outlier27-cell, PR908](https://github.com/tt-a1i/archify/pull/908), `bbf72d5c668fc75241f4a3667607cd127309ce3c` | Keep modified toolbar navigation native; preserve printable Shift shortcuts. |
| [#909](https://github.com/tt-a1i/archify/issues/909) | [outlier27-cell, PR911](https://github.com/tt-a1i/archify/pull/911), `e4944b9b4d567c0ff63aed8ddb761b66276180aa` | Protect all roving surfaces, including legend, direct relationships, Guide and retained chapters; preserve modified Finder Enter. |
| [#926](https://github.com/tt-a1i/archify/issues/926) | Fork implementation from the reported reproduction | Keep wall-clock ticks aligned across daylight saving and non-hour offset changes; preserve elapsed event geometry. |
| [#920](https://github.com/tt-a1i/archify/issues/920) | Fork implementation from Luis85's report | Discover Edge after Chrome/Chromium on Windows, macOS and Linux; retain explicit override precedence. |
| [#921](https://github.com/tt-a1i/archify/issues/921) | Fork implementation from Luis85's report | Clarify evidence-only redirection; keep the adjacent guarded summary current while retaining historical full/browser receipts. |

| [#903](https://github.com/tt-a1i/archify/issues/903) | [tt-a1i, PR924](https://github.com/tt-a1i/archify/pull/924), `c15b27a056a00f1fc9051c2dcd1d62e462118781`; reviewed the alternative [PR923](https://github.com/tt-a1i/archify/pull/923) | Offer one jointly verified suffix translation, preserving message order and spacing. Retain current note, self-call, segment-label, legend and canvas guards; withhold unsafe plans. |
| [PR950](https://github.com/tt-a1i/archify/pull/950) ([#883](https://github.com/tt-a1i/archify/issues/883), [#847](https://github.com/tt-a1i/archify/issues/847), [#849](https://github.com/tt-a1i/archify/issues/849)) | [tt-a1i](https://github.com/tt-a1i), `7ba389c222716e92ea5736654133d0e0debd2dcf` | Select both SVG path suites for shared changes; expose all ten types in issue/showcase intake and Hermes registration without changing integration roots. |
| [#954](https://github.com/tt-a1i/archify/issues/954) | Fork implementation from the report | Split authoring/delivery into short indexes and bounded topics, preserve every existing rule and legacy heading link, and explain current CLI exit codes without changing them. |

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
and `npm run test:webm`. Focused regressions are in root `test/`, including migration semantics, workflow hard contracts, self-calls, WebP bounds, Sequence canvas diagnostics, keyboard boundaries, and the retained original checks:
boundary membership, coincident routes, checker buffer and Preview browser tests.
Additional checks cover calendar transitions, browser discovery and redirected
finalize evidence, including unsafe paths and concurrent claimants. Joint note repairs, selective CI, ten-type discovery and on-demand reference routing have independent regressions.
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
