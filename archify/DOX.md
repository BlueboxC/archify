# DOX.md — Archify Skill

## Purpose

Own the zero-dependency installed CLI, renderers, checker, Viewer, authoring contracts and regression tests.

## Ownership

This boundary owns `bin/`, `renderers/`, `scripts/`, `delta/`, `assets/`, `schemas/`, `references/`, bundled examples. `explainer/` owns structured explanatory documents and chart compilation. Root `test/` owns tests and root `viewer/` owns Viewer sources.

## Local Contracts

- Preserve authored topology and explicit routing. Coincident relationships may be intentional; use an actionable showcase warning instead of automatically rerouting them.
- Boundary membership is authored data. Older HTML without membership metadata remains readable and explicitly unjudged by that rule; never infer membership from labels.
- Layout JSON mode drains stdout without creating or replacing HTML. SVG checks cover the full root after nested SVG elements, ignoring comment/CDATA and script/style text when locating roots.
- Checker transport failure is not an artifact verdict. Preserve previous delivered output when verification cannot complete.
- Preview retains the last verified artifact independently of checking/failure status; same-revision state updates preserve the loaded document.
- Migration validates complete source/final semantic contracts; group repair spans preserve exact membership and each node's effective group identity under canonical ordering, including overlapping groups with equal labels. Self-calls retain ownership, notes and identity. Raster pins undergo container checks even with matching digests.
- ERD renderer-added trunk bridges avoid unrelated routes and prior bridges using rendered stroke widths; preserve authored routes, ports and cardinality.
- Timeline cards, accessible labels and fallback ticks preserve nonzero milliseconds. Waterfall labels retain time resolution and visible endpoints without changing span/tick geometry.
- Timeline ticks follow display-zone offset transitions without changing elapsed event geometry. Browser discovery keeps explicit overrides authoritative and prefers Chrome/Chromium before Edge.
- Redirected finalize evidence retains historical full/browser receipts; the adjacent guarded summary tracks the latest attempt, including failures. `--out-dir` does not relocate the HTML or delivery provenance.
- Note-overlap repairs describe one jointly verified translation of the affected message suffix; reject plans that create canvas, note, segment, or legend failures. Preserve authored messages and ordering.
- Authoring and delivery references use short topic indexes; keep legacy heading links reachable and current exit-code semantics documented.
- Repository evidence preserves the exact Git top-level filesystem spelling; normalize remote origins separately before identity comparison and credential redaction.
- Keep fonts embedded and preserve THIRD_PARTY_NOTICES.md and asset licenses. No new runtime dependencies or automatic installation/update side effects.

- Timeline dates retain years across year boundaries; subsecond omitted intervals state milliseconds. Waterfall timing agreement accounts for binary64 magnitude, and the incomplete legend describes only open bars. Neutral relationship text uses readable theme-specific ink without recoloring connectors or semantic variants. Exports use the authored heading and NFC Unicode letters/numbers with attached marks to retain localized titles; detached marks are removed and names without a letter or number use the existing fallback.

## Work Guidance

- Reuse the shared geometry, diagnostic and tracked-package interfaces. Keep upstream-derived tests and attribution with adaptations.
- Test through CLI or emitted artifacts, including compatibility and failure paths; a version string does not establish installed source equivalence.

## Verification

- Root `npm run test:full`; focused boundary-membership, coincident-routes, checker-buffer and preview regressions.
- Regenerate affected examples/gallery and compare source, staged package and installed bytes.

## Child DOX Index

- [explainer/DOX.md](explainer/DOX.md) — structured document rendering and data-chart fidelity.

- [references/DOX.md](references/DOX.md) — on-demand guidance, routing indexes and compatibility links. Runtime contracts remain owned here.
