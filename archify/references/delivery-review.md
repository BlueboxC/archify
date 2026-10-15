# Browser evidence, review and handoff

## Automated browser evidence

`finalize` runs the required browser gate against the exact trusted HTML without
rerendering or modifying it. For focused diagnosis, the equivalent standalone
command is:

```bash
node bin/archify.mjs browser-check <output.html> --json --require-provenance
```

The zero-dependency command uses Chrome/Chromium through the DevTools pipe. It
measures light-theme containment at 1440×900, 1600×1000, 1920×1080, and
2048×1320, and verifies the requested light theme at all four viewports, the dark
theme at both endpoints, and READ/Still runtime states. A requested theme that
resolves to a different theme fails with measured evidence. It creates one
`<output-stem>.browser-check.json` receipt and no screenshots or contact sheet.
Pass `--out-dir <dir>` to place the receipt in a separate evidence directory.
The receipt binds the artifact SHA-256 and byte count, identifies
`evidenceKind: "automated-browser"`, and reports
`visualReview: "not-requested"`.

Horizontal overflow always fails. Normal document-level vertical scrolling is
accepted only with a renderer-declared contract and measured readable text.
Automatic canvases declare `data-reader-fit="intrinsic-height"` (height fitting)
or `data-reader-fit="width-first"` (Sequence and Waterfall reading width); their adaptive
Reader must reach its readable width and expose `data-reader-overflow="authored"`.
Architecture with an explicit `meta.viewBox` instead declares
`data-diagram-type="architecture"` and `data-reader-fit="authored-height"`:
its SVG coordinates, aspect ratio and existing Reader width behavior stay
unchanged. Its full SVG must remain inside the diagram panel without internal
scrolling or clipping, and the document must permit vertical scrolling.
The receipt records `verticalScrollAccepted: true` and
`overflowDisposition: "readable-vertical-scroll"`. Missing or unknown declarations,
explicit viewBoxes in other modes, unreadable text, horizontal overflow,
clipping and Viewer chrome collisions remain failures. Do not add an internal
diagram scroller or hide overflow.

`browser_evidence` in the handoff records only the outcome of this automated
command:

- `passed` maps from exit 0 and receipt `status: "pass"` after every required measurement completes and passes.
- `failed` maps from exit 1 and receipt `status: "fail"` when the inspection finds a defect, the command fails, or a runtime error leaves the evidence incomplete.
- `skipped` maps only from exit 2 and receipt `status: "skipped"` when Chrome/Chromium is unavailable and the inspection does not run.

Runtime failures leave incomplete evidence and must not be normalized to
`skipped`. They do not invalidate an already successful deterministic delivery.
Retry an environmental failure in a browser-capable execution context when
practical. Keep the packaged transport unchanged unless the failure reproduces
through that seam in a capable environment.

A provenance failure exits before browser inspection and persists a failed
browser-check receipt bound to the attempted artifact. If the failure receipt
cannot be written, the diagnostic names that incomplete evidence.

Both browser commands inspect the exact delivered HTML without modifying or rerendering it.

## Sequence width review

A passing `finalize` may report `layoutReviewRecommendation.action: "inspect-sequence-width"`. Its `evidence` measures the fixed participant columns' unused right-hand space after accounting for message labels, notes and segment titles. This advice adds no warning, failure, screenshot requirement or automatic geometry change.

A passing `validate --json`, `deliver`, or `finalize` receipt may carry `diagnostics[]` entries with `severity: "warning"` for Viewer locale fallbacks (`i18n/*`). They fail no gate. When the artifact should be fully localized, repair the listed keys from their `evidence` and rerun `finalize`.

Sequence canvases with omitted `meta.column_fit` use `spread`, whether or not `meta.viewBox` is supplied. An authored viewBox remains authoritative; infeasible participant capacity fails without silently enlarging it. Explicit `meta.column_fit: "fixed"` preserves historical fixed columns. For a candidate whose fixed-column width suggestion remains, first check whether the fixed geometry is intentional. Only when a change to that geometry is authorized, save the candidate, set only `meta.column_fit` to `"spread"`, and rerun the complete `finalize` once with `--out-dir <folder>/width-review`. Keep participant order, messages and their y positions, labels, notes, sources and canvas dimensions. If that attempt fails, restore the candidate and finalize it with `--out-dir <folder>/width-restore`; report the remaining layout suggestion rather than iterating. Preserve intentional fixed geometry and disclose the suggestion when a change is not authorized. To retain historical fixed coordinates for an older omitted-fit input, set `meta.column_fit: "fixed"` explicitly. This review is about horizontal composition; a passing receipt still does not claim perceptual approval.

## Optional capture evidence

`visual-check` remains backward compatible for a requested or escalated
perceptual review:

```bash
node bin/archify.mjs visual-check <output.html> --summary --require-provenance
```

`--summary` returns compact JSON with all diagnostics and absolute paths to the complete receipt, contact sheet, and every screenshot. For a chosen visual review, inspect the relevant captures; capture success is not perceptual approval. `--json` retains the full receipt output for existing consumers. Both modes run the same checks and keep the same exit status. If cleanup fails after publication, the summary retains the final failure diagnostics and `publication` recovery details; the linked receipt records the earlier committed evidence.

It performs the same automated browser measurements, captures light/dark
screenshots at 1440×900 and 2048×1320, and writes four viewport PNG sidecars,
one relative-path HTML contact sheet, and one JSON receipt. `--out-dir <dir>` moves all of these sidecars together.
Open the HTML contact sheet in a browser or inspect the viewport PNGs with an image reader. Its receipt reports `visualReview: "pending"` because captures do not themselves
make a perceptual judgment. Capture and provenance failures follow the ownership rules below.

The receipt, contact sheet, and four PNGs form one owned evidence set. Before
capture, `visual-check` freezes every requested directory entry, its
canonical write slot and physical parent, and the target's absent/file state,
type, device/inode identity, and mode. Hard-linked evidence targets are not safe
write targets. All candidate files are created exclusively inside one random,
private staging directory beneath the physical evidence directory; the receipt
is published last. Each staged candidate must have exactly one hard-link name
before publication. The no-clobber publish link temporarily gives the staged
and final names a link count of two; unlinking the verified staged name must
leave the final entry with a link count of one. An unexpected external hard
link fails closed and its alias is never removed.

Chrome inspects one identity- and content-checked copy of the captured artifact
in a private local temporary directory, so browser file loading does not depend
on UNC or long-path support. The six publication candidates remain on the
evidence volume. Both temporary directories are cleaned without recursively
deleting unknown contents; retained entries include their recovery locations.

Immediately before committing anything, `visual-check` re-resolves and verifies
the complete six-path set. An absent-path claimant, existing-path replacement,
symbolic-link or dangling-link retarget, parent-topology change, hard link, or
indeterminate identity fails closed with `viewer/evidence-path-conflict`. The
claimant and every other final evidence path remain untouched. Cleanup removes
only this run's staged or published entries after rechecking their captured
identities; a changed or unknown entry is preserved.

An existing visual evidence set is replaceable only when a regular
`visual-check` receipt proves ownership of the same artifact and evidence
directory, and its exact sidecar manifest matches every existing contact-sheet
or PNG byte count and SHA-256 digest. A missing, malformed, unknown, mismatched,
or incomplete ownership record never authorizes deletion. Failed and skipped
runs retire prior screenshots/contact sheets only as part of the same verified
transaction when that ownership proof succeeds; otherwise they preserve all
unknown evidence and report `viewer/evidence-path-conflict`.

This rule also applies when Chrome is unavailable or provenance fails before
browser inspection: neither path may blindly delete stale-looking evidence. A
verified owned set may be recoverably retired before publishing a skipped or
failed receipt; unowned evidence remains intact. These outcomes do not invalidate an already
successful deterministic delivery and do not turn a perceptual visual review
into passed or failed. Retry an environmental failure through the supported
command in a browser-capable execution context when practical. Keep the
packaged transport unchanged unless the failure reproduces through that seam in
a capable environment.

`browser-check` applies the same private-snapshot, identity, ownership, and no-clobber rules to its single JSON receipt. Its namespace is separate from `visual-check`, so a browser-only rerun cannot remove capture evidence.

## A new candidate at an existing output path

Browser evidence belongs to exact artifact bytes. After editing a candidate whose previous HTML already has browser evidence, choose a fresh evidence directory before running the next `finalize`; this preserves the old receipts and captures without an avoidable ownership-conflict retry:

```bash
node bin/archify.mjs finalize architecture candidate.json diagram.html --quality showcase --repo-root <root> --out-dir diagram.review-2 --json
node bin/archify.mjs visual-check diagram.html --out-dir diagram.review-2 --summary --require-provenance
```

Keep the requested HTML path stable. Use a new revision directory for each changed candidate, and retain the same directory for retries of unchanged bytes. For a diagram without repository evidence, omit `--repo-root`. Let the commands create their output directory. A prior validation failure that produced no HTML or browser evidence needs no new directory. Never remove unknown evidence to make a retry pass.

## Optional opening

Add `--open` only when the user wants an immediate local preview. It runs after
the verified pair commit has completed, its recovery journal has been removed,
and the delivery lock has been released successfully. It uses one argument-array
OS opener with a five-second bound on macOS and Linux, and a fifteen-second bound
for PowerShell startup on Windows. The receipt records `open.status`; failed or
unavailable launch attempts also include normalized `open.failure` details.
Keep it off for CI, unattended agents, and non-interactive environments.
Failure or unsupported opening does not invalidate delivery; its
status proves only whether the local opener invocation succeeded.

## Perceptual review

The automated path ends with the deterministic browser gate and reports
`visual_review: not_requested`. Ordinary generation does not require screenshots
or an image-reading step, including newly authored or repositioned Architecture.
Perceptual review is optional; use it for an explicit request or a concrete visual
investigation. Possible reasons include:

- the compact finalizer includes `visualReviewRecommendation` for crossings or detours (advisory, not a delivery gate);
- the user explicitly requests an aesthetic or visual review;
- a template, renderer, or Viewer change needs visual regression evidence;
- a novel layout or browser diagnostic leaves low confidence;
- the run is selected for sampled audit or dogfood.

For the default standalone desktop viewer, measure 1440×900, 1600×1000, 1920×1080, and 2048×1320. Require `document.documentElement.scrollWidth <= window.innerWidth` at every checked size. Prefer `scrollHeight <= window.innerHeight`; accept page-level vertical scrolling only through the Reader-declared readable exception defined above. At the largest checked viewport, inspect the rendered composition for a conspicuous empty lower band: the main panel and necessary conclusion cards should use the available height as a balanced whole, not collapse into a shallow strip. For unexpected overflow, repair the authored composition by removing only genuinely redundant content or compacting spacing before shrinking nodes, labels, or the main panel. Do not hide overflow, clip content, introduce an internal diagram scroller, or reduce node/label typography to make the measurement pass. Narrow/mobile containment may retain vertical page scrolling.

For an escalation, run `visual-check` on the current finalized artifact, inspect
its contact sheet with a capable image reader or human, and check both endpoint
themes, the default READ view, line crossings/corridors, label masks, node/card
fit, focus/search/passport closure, and export cleanliness. This review is
supplementary and never changes `browser_evidence`. An unconstrained browser
glance can support perceptual review only.

In a diagnostic or structured handoff, report one truthful optional-review
status:

- `visual_review: not_requested` — no review trigger applies; this is not a visual acceptance claim.
- `visual_review: passed` — only after inspecting the rendered artifact.
- `visual_review: skipped (image reader unavailable)` — a requested or triggered review could not run.
- `visual_review: failed` — with the concrete visible defect.

For an escalated review, use `correction_rounds: 0`, `correction_rounds: 1`, or
`correction_rounds: 2`; never exceed two focused correction rounds. When review
is not requested, use `correction_rounds: 0`. Never report
`visual_review: passed` without inspecting the artifact. If perceptual review
changes the candidate, rerun `finalize` because the previous specification and
artifact receipts are no longer current.

## Handoff receipt

For a requested diagnostic or structured handoff, derive the following details
from the existing receipts. Ordinary user-facing replies follow
[Output](../SKILL.md#output); this checklist is not a default chat response.

```text
diagram_type: <actual diagram type>
output: /absolute/path/to/file.html
specification_sha256: <receipt value>
artifact_sha256: <receipt value>
validation: <actual quality profile, check counts, errors, and warnings>
browser_evidence: passed|failed|skipped
visual_review: not_requested|passed|skipped (image reader unavailable)|failed
correction_rounds: 0|1|2
```

Derive `browser_evidence` only from the latest artifact-bound `browser-check`
receipt, normally the stage embedded by `finalize`. Record optional capture or
manual browser work separately with its artifact binding, viewport/theme scope,
and observations; never use it or `visual_review` to overwrite the automated
status.

Opening, preview status, Share Cards, and other viewer exports are not validation claims.

Finalize receipt publication uses the same identity-bound, no-clobber publisher and explicit recovery records described above. The full and summary receipts must be distinct from the candidate, artifact, delivery metadata, and browser receipt. Their targets must be absent or single-link regular files; symlink receipt entries and hardlinked targets fail closed. A later claimant or changed parent stops publication and remains untouched. Default receipt names share the physical artifact namespace and are bounded for the host filename limit. The two receipts are published individually, not as a crash-atomic pair; only a completed passing command is a successful handoff.

## Fork checker transport

Captured checker output uses a 64 MiB default, configurable with a positive integer `ARCHIFY_CHECK_MAX_BUFFER`. Exhaustion reports `artifact/check-output-limit` without a diagram verdict; previous delivered output is preserved. Direct `check` streams its complete JSON.
