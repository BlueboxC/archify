# Archify — BlueboxC fork

This fork integrates official Archify 3.2.0 (`v3.2.0`, commit
`208acba8d412335185b2056fedf54b3405df43fb`) with our reviewed corrections.
It supports ten diagram types, Explainer documents and the release's Viewer, workflow migration,
Preview and verified `finalize` delivery. Existing generated user artifacts are
not rewritten by upgrading the Skill.

## Input-preserving Explainer evidence

For [#1060](https://github.com/tt-a1i/archify/issues/1060), reported by To3akaRin, discover declared chart-data and external native-diagram paths before preparing resource contents. Delivery, failed redelivery and finalize refuse physical-path aliases between those inputs and their artifacts or evidence sidecars. Preserve previous data, HTML and evidence on rejection; ordinary repeated delivery remains supported. No renderer, Viewer or dependency changes are needed.

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
| [#1024 / PR1039](https://github.com/tt-a1i/archify/pull/1039) | sx4im, `978f77407ded2bd2a4741c1d9eb95e557f368e1e` | Drop detached Unicode marks and fall back when a sanitized name has no letter or number. Preserve our authored-heading selection and NFC normalization. Historical user HTML is unchanged. |
| [#1041](https://github.com/tt-a1i/archify/issues/1041) | [sx4im, PR1051](https://github.com/tt-a1i/archify/pull/1051), `08fd04bbf8a4a50836796aed99a569ce78a8b6c4` | Compacted ordinary page flow pins the tall SVG top. Reset, print, presentation and embed restore the original inline alignment and its priority. Preserve unscaled geometry and existing camera/Dock fixes. |
| [#1040](https://github.com/tt-a1i/archify/issues/1040) | Fork correction following HengYangDS's report and Figure-index follow-up | Passport/Finder small-text ink uses readable theme text with semantic tint; Figure-index secondary text retains contrast even on selected rows. Borders and diagram strokes remain unchanged. Real-browser checks composite HTML backgrounds across light/dark and four presets. |
| [#1020](https://github.com/tt-a1i/archify/issues/1020) | [sx4im, PR1033](https://github.com/tt-a1i/archify/pull/1033), `23e99452abb39a31acd03d835736319e76ef4c63` | Drain large layout JSON through stalled pipes in Tree, Timeline, Waterfall, Class and ERD; layout-only mode never writes HTML. |
| [#1025](https://github.com/tt-a1i/archify/issues/1025) | [sx4im, updated PR1031](https://github.com/tt-a1i/archify/pull/1031), `6028e18390d945c406c5f8da659c003171a8bb25` | Check the complete root SVG with one shared linear tokenizer for root and geometry readers. Preserve attribute-state/self-closing semantics, HTML comment endings, CDATA/declaration context and raw script/style exclusion. Retain multiple-root rejection, independent HTML-parser controls, boundary membership and coincident-route checks. |
| [#1027](https://github.com/tt-a1i/archify/pull/1027) | jahfaliabdulrahman-dev, `a139f6e0ea06a753971474c84ad1c00ccd436e51` | A capped mobile semantic Lens shrinks and scrolls the kinds list, keeping Clear/Copy visible and hit-testable at 24px root font. Preserve desktop layout, Dock/camera fixes and reader-text colors. |
| [#1000](https://github.com/tt-a1i/archify/issues/1000) | [leonkoellerwirth-arch, PR1001](https://github.com/tt-a1i/archify/pull/1001), `4ca84e4af9ef16810b0823fe6e3320b58cb733a5` | Camera clipping and panning follow the full container content box, preserving Dock padding, overview, reset and explicit geometry. |
| [#1008](https://github.com/tt-a1i/archify/issues/1008) | [To3akaRin, PR1011](https://github.com/tt-a1i/archify/pull/1011), `30124f6c1e665f8e1c0c6dca444fc998e6565ee0` | Preserve literal chart labels, parse multiline quoted CSV records and refuse malformed or unrepresentable data without replacing prior delivery. |
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

| [#903](https://github.com/tt-a1i/archify/issues/903) | [outlier27-cell, PR924](https://github.com/tt-a1i/archify/pull/924), `c15b27a056a00f1fc9051c2dcd1d62e462118781`; reviewed gold-beyond's alternative [PR923](https://github.com/tt-a1i/archify/pull/923) | Offer one jointly verified suffix translation, preserving message order and spacing. Retain current note, self-call, segment-label, legend and canvas guards; withhold unsafe plans. |
| [PR950](https://github.com/tt-a1i/archify/pull/950) ([#883](https://github.com/tt-a1i/archify/issues/883), [#847](https://github.com/tt-a1i/archify/issues/847), [#849](https://github.com/tt-a1i/archify/issues/849)) | [tt-a1i](https://github.com/tt-a1i), `7ba389c222716e92ea5736654133d0e0debd2dcf` | Select both SVG path suites for shared changes; expose all ten types in issue/showcase intake and Hermes registration without changing integration roots. |
| [#954](https://github.com/tt-a1i/archify/issues/954) | Fork implementation from the report | Split authoring/delivery into short indexes and bounded topics, preserve every existing rule and legacy heading link, and explain current CLI exit codes without changing them. |

| [#896](https://github.com/tt-a1i/archify/issues/896) | [To3akaRin, PR897](https://github.com/tt-a1i/archify/pull/897), `3030e8c2a53880ac10147bdecf58bff5072e2bc3` | Refuse renderer-added ERD trunk bridges that cross, touch or overlap unrelated routes or earlier bridges. Clearance includes both rendered stroke widths; preserve authored ports, geometry and cardinality. |
| [PR823](https://github.com/tt-a1i/archify/pull/823) | [rudycelekli](https://github.com/rudycelekli), `4470dbc60755fcdaf7e663ca069e4a5aa2dd60f9` | Preserve trailing whitespace in the Git top-level path; normalize origins independently before identity comparison and credential redaction. Keep root, revision, blob, path and line verification strict. |
| [PR870](https://github.com/tt-a1i/archify/pull/870) | [cyanseek](https://github.com/cyanseek), `00a75b375961f2c4288d59312d3b301355a11b73` | Preserve nonzero milliseconds in Timeline cards, accessible labels and fallback axis ticks; whole-second output and elapsed geometry stay unchanged. |
| [PR871](https://github.com/tt-a1i/archify/pull/871) | [cyanseek](https://github.com/cyanseek), `1ef3f8783b47ea5edf5ce4d80d588ac3b6fc9be4` | Keep distinct Waterfall tick/span times at nonzero origins, retain both endpoint labels within the canvas and avoid intermediate-label overlap. Very large finite values retain finite labels. |

The upstream implementations and tests are adapted under MIT. Their inclusion
here does not imply that upstream has reviewed or merged our adaptations.
Archify 3.1 already rejects fully enclosed non-members during showcase rendering;
the independent artifact check additionally covers HTML and compare overlays.
`finalize` retains detailed coincident-route and straddling-boundary warnings for
manual review, while other showcase warnings and all hard errors remain blocking.
It still verifies artifact identities, delivery provenance and the browser gate.

## README preview refresh

Following [MannXo's PR951](https://github.com/tt-a1i/archify/pull/951) at
`051b275b24be7b8b36a8a5edc80914adf6230dd0` for
[#947](https://github.com/tt-a1i/archify/issues/947), the four existing Workflow,
Sequence, Dataflow and Lifecycle previews are exported from this fork's current
golden examples through the Viewer PNG menu. They retain embedded fonts,
light theme, each example's preset and complete diagram, then use Lanczos
downsampling to 2400 px RGB. Filenames and localized README links stay intact.
The proof-set test additionally checks their PNG format, width and RGB encoding.
The five promoted-mode previews follow upstream PR945
(`86540fda68f1a9ff25270b76ba0661fbb21917bf`) and PR946
(`92606fb7e47425ca48db2e5b3193d2e75cb9cb48`), credited to tt-a1i.
The fork adds five localized copyable starters and verified links to its existing
canonical JSON and downloadable HTML. English, Chinese, Japanese and Korean
inventories describe ten modes; the nine previews share the same export profile.
Timeline/Waterfall samples remain explicitly illustrative, and the other sample
models are not presented as inspected production facts. The fork does not invent
hosted proof IDs or publish new gallery recipes. These preview changes preserve authored examples; runtime updates are qualified separately below.

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

## Overlapping workflow group repairs

The #821 follow-up preserves both the edited group's exact membership and each
node's effective group identity. It reuses canonical group ordering and node
lookup; equal labels do not make two group IDs interchangeable. A repair that
only compiles remains insufficient. Regression cases cover owner changes,
masked outside-node absorption and equal labels, alongside existing legitimate
repairs. This extends robll-v1's #838 and its overlapping-group review; it retains
the membership guard contributed by this fork.

The earlier c5e1059 commit bundled ten fixes, including shared Viewer keyboard
changes that required HTML refreshes. This isolated compiler follow-up rebuilds
only the Skill archive; canonical example HTML and Viewer sources stay unchanged.

## Timing and Viewer corrections

Adapt [#1032](https://github.com/tt-a1i/archify/pull/1032),
[#1028](https://github.com/tt-a1i/archify/pull/1028),
[#1030](https://github.com/tt-a1i/archify/pull/1030),
[#1029](https://github.com/tt-a1i/archify/pull/1029) and
[#1027](https://github.com/tt-a1i/archify/pull/1027): retain timeline years,
represent subsecond breaks, scale floating-point agreement to operand size,
show the incomplete key only for open spans, and keep mobile controls and
presentation overflow reachable. Neutral labels have separate readable ink
across light/print presets ([#1017](https://github.com/tt-a1i/archify/issues/1017));
connector strokes and semantic colors stay unchanged. Unicode export names
use the authored heading, avoiding translated page suffixes and preserving
NFC letters and accents ([#1024](https://github.com/tt-a1i/archify/issues/1024)).
Existing offline fonts, camera bounds and Explainer styling are retained.

## Cyclic Explainer placement

Adapt the cyclic-layout portion of [PR #997](https://github.com/tt-a1i/archify/pull/997) by @goatliamia, tracked in [#1050](https://github.com/tt-a1i/archify/issues/1050). Shorthand retry flows can try one alternate placement through the existing native renderer and checker. Preserve every authored node and relationship, stable source bytes and explicit or edited geometry. Preview lanes follow the selected rendering. Optional paragraph-reference features and the unrelated shared-router extraction are not part of this adaptation. Existing Viewer, Unicode, source-evidence and chart-data corrections remain in place.

## Narrow print clearance (#1027 follow-up)

Adapt CodeRabbit's inline observation on PR #1027 at `4342092890`: clear `--archify-dock-h` in the authored print rule. With scripts disabled, a 360px document retained 100px of hidden-navigation padding; ordinary scripted printing already clears it through the size observer. Keep CSS printing independent of that observer and preserve mobile screen clearance. Real Chrome controls cover 360/1440px, scripts on/off and return to screen; this does not certify hardware-printer pagination. Existing user HTML is not rewritten.

## CJK punctuation at wrap boundaries

Independently address b84330808’s synthetic CLI report [#1067](https://github.com/tt-a1i/archify/issues/1067) with one shared wrap-piece grouping rule. Tree labels/sublabels, Timeline titles and Sequence notes keep closing punctuation, iteration marks and ellipses with their preceding text, and opening brackets with the next piece. Fold the previous Sequence-only closing-punctuation case into the helper. Width estimation, fonts, schemas and English/Korean wrapping remain unchanged; this is not a complete UAX #14/JIS implementation.
