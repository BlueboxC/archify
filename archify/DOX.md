# DOX.md — Archify Skill

## Purpose

Own the zero-dependency installed CLI, renderers, checker, Viewer, authoring contracts and regression tests.

## Ownership

This boundary owns `bin/`, `renderers/`, `scripts/`, `delta/`, `assets/`, `schemas/`, `references/`, bundled examples. `explainer/` owns structured explanatory documents and chart compilation. Root `test/` owns tests and root `viewer/` owns Viewer sources.

## Local Contracts

- Preserve authored topology and explicit routing. Coincident relationships may be intentional; use an actionable showcase warning instead of automatically rerouting them.
- Boundary membership is authored data. Older HTML without membership metadata remains readable and explicitly unjudged by that rule; never infer membership from labels.
- Layout JSON mode drains stdout without creating or replacing HTML. SVG root discovery and geometry readers share a single-pass tokenizer with attribute-aware tag endings and self-closing flags. Preserve comment/CDATA context, script/style text exclusion, ASCII tag delimiters and the full root after nested SVG elements; this is a scoped artifact scanner rather than a general HTML validator.
- Checker transport failure is not an artifact verdict. Preserve previous delivered output when verification cannot complete.
- Preview retains the last verified artifact independently of checking/failure status; same-revision state updates preserve the loaded document.
- Migration validates complete source/final semantic contracts; group repair spans preserve exact membership and each node's effective group identity under canonical ordering, including overlapping groups with equal labels. Self-calls retain ownership, notes and identity. Raster pins undergo container checks even with matching digests.
- ERD renderer-added trunk bridges avoid unrelated routes and prior bridges using rendered stroke widths; preserve authored routes, ports and cardinality.
- Timeline cards, accessible labels and fallback ticks preserve nonzero milliseconds. Waterfall labels retain time resolution and visible endpoints without changing span/tick geometry.
- Timeline ticks follow display-zone offset transitions without changing elapsed event geometry. Browser discovery keeps explicit overrides authoritative and prefers Chrome/Chromium before Edge.
- Redirected finalize evidence retains historical full/browser receipts; the adjacent guarded summary tracks the latest attempt, including failures. `--out-dir` does not relocate the HTML or delivery provenance.
- Delivery and finalize protect declared local Explainer chart and native-diagram inputs from artifact, provenance, journal, lock and receipt aliases before publication. Discover paths before resource preparation so invalid-data redelivery also preserves inputs; uninspectable drafts withhold failure-sidecar writes.
- Note-overlap repairs describe one jointly verified translation of the affected message suffix; reject plans that create canvas, note, segment, or legend failures. Preserve authored messages and ordering.
- Authoring and delivery references use short topic indexes; keep legacy heading links reachable and current exit-code semantics documented.
- Repository evidence preserves the exact Git top-level filesystem spelling; normalize remote origins separately before identity comparison and credential redaction.
- Keep fonts embedded and preserve THIRD_PARTY_NOTICES.md and asset licenses. No new runtime dependencies or automatic installation/update side effects.

- Timeline dates retain years across year boundaries; subsecond omitted intervals state milliseconds. Waterfall timing agreement accounts for binary64 magnitude, and the incomplete legend describes only open bars. Neutral relationship text uses readable theme-specific ink without recoloring connectors or semantic variants. Exports use the authored heading and NFC Unicode letters/numbers with attached marks to retain localized titles; detached marks are removed and names without a letter or number use the existing fallback.

- Print CSS clears hidden navigation clearance independently of JavaScript; screen/mobile dock behavior stays measured.

- Tree label/sublabel, Timeline title and Sequence note wrapping keep closing CJK punctuation, iteration marks and ellipses with the preceding piece, and opening brackets with the following piece. Keep width measurement, fonts and non-CJK wrapping; this is a scoped punctuation rule, not complete Unicode line breaking.

- Automatic workflow port probing stops when the configured spacing cannot produce a distinct floating-point coordinate; preserve finite authored dimensions and ordinary routing.
- Failed schema-v2 relative drop forks may retry opposite source-port order at up to four stably selected forks per compile invocation. Accept only a fully validated compile; keep successful scenes, authored topology/sides and absolute geometry. Outer layout feedback retains its independent bounds.
- Indeterminate sidecar namespaces produce structured provenance/evidence failures without an alternative write path or treating unknown provenance as verified.

- Windows native realpath EPERM may fall back to Node JS realpath only for an existing non-link directory ancestor. Require matching stable filesystem identity after resolution; leaves, roots, other errors and unresolved identities remain strict. Preserve destination/containment checks; injected tests do not establish native Windows sandbox acceptance.
- Owned temporary-directory ancestor comparisons keep sameEntry first. On Windows EPERM only, a fallback comparison requires non-link directory identities with nonzero inode and stable dev/inode/birthtime before and after inspection. Preserve the full bound ancestor chain and replacement refusal during creation and cleanup.

- Crossing inspection allows 50,000 eligible relationship pairs and 3,000,000 segment-pair checks by default. Exhaustion fails explicitly as incomplete in every quality profile; never report partial inspection as a pass. Public check/deliver/finalize diagnostics retain the matching per-invocation recovery knob. Positive safe-integer environment overrides can qualify a known-large artifact; these bounds do not limit all checker work or guarantee a wall-clock deadline.

## Work Guidance

- Reuse the shared geometry, diagnostic and tracked-package interfaces. Keep upstream-derived tests and attribution with adaptations.
- Test through CLI or emitted artifacts, including compatibility and failure paths; a version string does not establish installed source equivalence.

## Verification

- Root `npm run test:full`; focused boundary-membership, coincident-routes, checker-buffer and preview regressions.
- Regenerate affected examples/gallery and compare source, staged package and installed bytes.

## Child DOX Index

- [explainer/DOX.md](explainer/DOX.md) — structured document rendering and data-chart fidelity.

- [references/DOX.md](references/DOX.md) — on-demand guidance, routing indexes and compatibility links. Runtime contracts remain owned here.
