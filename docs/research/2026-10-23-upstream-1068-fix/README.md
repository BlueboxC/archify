# #1068 containment candidate on exact upstream dev and PR #1066

The unchanged mobile CSS delta from [47d0ccf](https://github.com/BlueboxC/archify/commit/47d0ccf9222832973e6267d230cc5e0a68907e26) fixes the reproduced toolbar/menu overflow on both pinned upstream revisions. No additional runtime adaptation is needed for these cases. This is downstream qualification evidence in the existing [#1068 thread](https://github.com/tt-a1i/archify/issues/1068), not an upstream implementation approval, merge request or claim of acceptance.

## Source and patch

- Upstream dev: `b71d1b3e38f71d0f7fe91207b750cc307357c91a`.
- PR #1066: `01d90b5d66c7bf4cfb58f9d1973bfe46dffae533`.
- [containment.patch](containment.patch) applies cleanly to both copies. The only changed file is `archify/explainer/reader.css`; the delta only adds mobile toolbar wrapping and dropdown anchoring below the whole toolbar. No Version code or other fork runtime is imported.
- [patch receipt](evidence/patch-application.json) and source manifests bind all hashes. The 224/225 acquired upstream files remain byte-identical after the run. The candidate therefore works independently of #1066 and alongside its Version control.

## Paired browser matrix

Real Chrome/154.0.8037.93 on macOS, Node v26.0.0, light theme, CSS viewports 320/390×844 and 1440×900, scale 1. Same upstream `delivery.explainer.json`; only `meta.locale` and `meta.style` vary. Its Chinese document body stays constant to isolate English/Chinese reader UI. Storage is cleared before navigation and actual DOM locale/style checked in every case.

144 cases: 72 before + 72 after. Each side contains 48 original-version artifacts (two revisions × two locales × four styles × three widths), plus 24 separately named PR version-fixture cases. All 960 screenshot hashes and measurements are in [observations](evidence/observations.json); 20 representative screenshots and 10 representative HTML files are included. The harness recreates every case/capture.

Document widths, in clean / editorial / product / swiss order:

| Revision and viewport | Unmodified | Same source + CSS delta |
|---|---|---|
| dev, English 390 | 401 / 415 / 414 / 395 | 390 / 390 / 390 / 390 |
| dev, Chinese 320 | 355 / 355 / 355 / 355 | 320 / 320 / 320 / 320 |
| #1066, English 390 | 543 / 557 / 556 / 534 | 390 / 390 / 390 / 390 |
| #1066, Chinese 390 | 478 / 478 / 478 / 478 | 390 / 390 / 390 / 390 |

- 44 of 72 baseline cases overflow initially. All 72 patched cases have document width equal to viewport, visible/clickable toolbar controls and contained, hit-testable Style/Export items.
- 72 patched keyboard flows pass Tab/Enter opening, arrow-key style selection/restoration, Escape focus restoration and Export Tab dismissal. The 24 updated-label fixtures repeat the menu checks successfully.
- All 48 patched PR cases keep the opened Version dialog inside the viewport and restore focus on dismissal.
- All 72 patched print states hide tools/dialogs and retain panel count/text. A further 48 print states while the Version dialog is open also pass. These are print-media emulations, not physical-printer tests.
- All 160 paired desktop state measurements are identical before/after (controls, menus, dialog, scroll width and panel content). No screenshot-pixel equality is claimed.
- All 144 initial loads make zero calls through pre-navigation fetch/XHR/WebSocket/EventSource probes. This is four-API instrumentation, not a complete browser-network audit.

## Version fixture disclosure

The unmodified PR renderer emits `3.2.1-dev.1`. Its 24 explicit checks per side correctly return development status unavailable and make zero fetch calls. These artifacts are tested without changing their embedded version.

A separate set of 24 cases per side changes **only** `artifact.generatorVersion` from `3.2.1-dev.1` to `3.2.1`, then returns a controlled 3.2.2 manifest after an explicit keyboard action. Each makes exactly one mock fetch. The patched toolbar/menus remain contained before and after the new-version label. [Disclosure and original/fixture hashes](evidence/fixture-disclosure.json) include the mock; reversing the single version edit reproduces the original HTML byte-for-byte. This is UI-state testing, not a released 3.2.2, untouched development artifact or live update/install validation.

Credit to @outlier27-cell for the original controlled-response scenario in #1069 and coordination in the existing evidence/ownership thread. The fixture remains separate from both the original-version output and the unchanged CSS candidate. P1/P2 are outside this qualification.

## Reproduce

Copy this directory to a fresh disposable folder. Git, Python3, Node and Chrome/Chromium are required. Allow up to 2 GiB, check free space first and retire only the created folder when finished. No npm install is needed.

```sh
python3 acquire.py
python3 prepare.py
python3 render.py
node compare.mjs
python3 qualify.py
```

`acquire.py` fetches exact public commits and extracts only `archify/`. `prepare.py` creates two candidates and checks that only the CSS changed. `compare.mjs` uses the upstream browser helper, controls only the manifest response and clears storage per case. `qualify.py` fails on patched containment/hit-testing/keyboard/print failures, desktop geometry changes, altered original sources or an incomplete 144-case run. Original cases are expected to fail containment; a successful baseline capture alone is not a fix pass. See [qualification](evidence/qualification.json).

No installation or main update is part of this evidence commit. The existing fork installation already contains this exact correction. Previously generated user HTML is not rewritten. Native mobile browsers, every image/export format, physical printing and live updates have not been qualified here.
