# Archify #1068: matched upstream Explainer measurements

English toolbar overflow also reproduces on exact upstream dev, without Version. Adding #1066 worsens containment in both locales. This is new upstream evidence, separate from the previously tested customized fork correction.

## Immutable scope

- Original: `tt-a1i/archify` dev `b71d1b3e38f71d0f7fe91207b750cc307357c91a`.
- Integration proposal: #1066 head `01d90b5d66c7bf4cfb58f9d1973bfe46dffae533`.
- Same `archify/examples/delivery.explainer.json` bytes in both source trees; only `meta.locale` and `meta.style` vary in the eight retained inputs. Body prose stays Chinese in the English-UI input to isolate toolbar localization, not translation quality.
- Real Chrome/154.0.8037.93, macOS, Node v26.0.0, light theme, device scale 1; viewports 320×844, 390×844 and 1440×900. These are CSS viewport/headless Chromium checks, not native iPhone/iPad or physical-printer qualification.
- 48 untouched cases: 2 revisions × 2 locales × 4 styles × 3 widths. Another 24 cases exercise a separately labelled stable-version UI fixture on #1066. No customized fork runtime/CSS was used to generate either source baseline.

## Measured document widths at a 390 px viewport

| UI locale | Style | dev original | #1066 original | #1066 fixture initial | fixture update available |
| --- | --- | ---: | ---: | ---: | ---: |
| en | clean | 401 | 543 | 507 | 537 |
| en | editorial | 415 | 557 | 522 | 552 |
| en | product | 414 | 556 | 520 | 550 |
| en | swiss | 395 | 534 | 499 | 527 |
| zh-CN | clean | 390 | 478 | 443 | 457 |
| zh-CN | editorial | 390 | 478 | 443 | 457 |
| zh-CN | product | 390 | 478 | 443 | 457 |
| zh-CN | swiss | 390 | 478 | 443 | 456 |

At 320 px all untouched toolbar combinations overflow: dev English is 401/415/414/395 px, dev Chinese is 355 px; #1066 English is 543/557/556/534 px and Chinese 478 px. At 1440 px all 72 cases retain document width 1440 and keep controls/menus contained.

The English Export menu exceeds the viewport at 390 px on both exact revisions in every style. Chinese Export fits at 390 px but exceeds 320 px. Style menu rectangles remain contained at the measured widths. Raw rectangles, control labels, focus, document width and screenshot hashes are retained for every captured state.

## Keyboard, print and explicit checks

- 72/72 initial loads make zero calls through the four instrumented JavaScript APIs: fetch, XHR, WebSocket and EventSource. The pre-navigation probes do not cover every browser network channel.
- 72/72 keyboard cases reach/open Style and Export using Tab/Enter, select and restore a Style with arrow keys/Enter, restore focus with Escape, and dismiss Export with Tab. This is menu-navigation coverage; it does not claim validation of every exported image format.
- 72/72 print emulations hide reader controls/dialogs and retain the panel count and panel text hash. No physical printer was used.
- The untouched #1066 outputs identify themselves as `3.2.1-dev.1`. Their 24 explicit checks make zero fetch calls and report development-artifact update status unavailable, as expected.
- The 24 stable fixtures each make exactly one controlled fetch after the explicit keyboard action, with credentials omitted, no-store and redirect error; they show `New version 3.2.2` / `新版本 3.2.2`. This is not a live manifest, released 3.2.2, installation or update validation.

## Version-fixture disclosure and attribution

[outlier27-cell's #1069 capture harness](https://github.com/outlier27-cell/archify/blob/791a05e246d6d11b2d101e873d98a71fb61df909/docs/research/2026-10-23-artifact-reader-baseline/capture-baseline.mjs) changes `generatorVersion` before its controlled response. That earlier Chinese/clean result is valid only for its stated fixture/browser/state; it must not be described as an untouched development artifact.

Here, the original generated HTML stays unchanged. `compare.mjs` creates additional `pr1066-fixture-*.html` files, changing exactly `artifact.generatorVersion` from `3.2.1-dev.1` to `3.2.1`. It verifies that reversing that one change exactly reproduces the original HTML bytes. Original/fixture hashes and the synthetic 3.2.2 response are in [fixture-disclosure.json](fixture-disclosure.json). The source's retained content identity is not recalculated or claimed as new fixture provenance. We credit outlier27-cell for the existing issue/evidence coordination and controlled-version scenario, and the upstream ChromeVisualBrowser helper reused from exact dev.

## Evidence and reproduction

- [dev measurements](measurements-dev-untouched.json), [#1066 original measurements](measurements-pr1066-untouched.json), [separate fixture measurements](measurements-pr1066-stable-fixture.json).
- Eight [inputs](inputs/), 16 original and eight fixture [HTML artifacts](artifacts/), [CLI render receipts](render-receipts.json), immutable source-file manifests, and twelve representative [screenshots](screenshots/) are included here.
- All 432 original PNG captures and their hashes are retained with the local qualification. Every capture name/hash is recorded in the public measurement receipts; only twelve representative captures are checked in to avoid a 50 MB screenshot commit. The harness regenerates the complete capture matrix.
- Four representative narrow screenshots were visually inspected: dev English/Chinese initial, dev English Export, and #1066 Chinese original initial. Geometric/keyboard/print checks cover the full matrix; this is not a claim of human perceptual approval of every capture.
- A discarded first pass exposed shared file-origin localStorage overriding later requested styles. It is excluded from these results. The final pre-navigation script clears storage and every initial state asserts exact DOM locale/style; its diagnostic is retained locally.

From this directory, copy only the four harness inputs into a fresh scratch directory (Git, Python 3, Node and real Chrome required):

```sh
audit_dir=$(mktemp -d)
cp acquire.py render.py compare.mjs incoming.json "$audit_dir/"
python3 "$audit_dir/acquire.py"
python3 "$audit_dir/render.py"
node "$audit_dir/compare.mjs"
```

Source files are hashed before/after the comparison. No npm install, product-source edits, package rebuild, user-installation change, upstream PR, P1/P2 implementation or merge is part of this evidence record. A zero capture-command exit means measurements completed; the red containment results remain explicit.

This supports a small standalone Explainer containment fix on dev and additional Version-integration coverage. The previous fork candidate is [47d0ccf92228](https://github.com/BlueboxC/archify/commit/47d0ccf9222832973e6267d230cc5e0a68907e26), not a claim that it has been integrated or approved upstream. Continue coordination in #1068 and avoid duplicating the implementation.
