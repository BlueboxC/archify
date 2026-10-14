# DOX.md — Archify fork

## Purpose

Maintain BlueboxC's Archify fork and compatible, verified corrections to its five-type 2.17 baseline.

## Ownership

Root owns distribution builders, workflows, generated public examples, licensing and fork policy. `archify/` owns the installed Skill runtime and its tests.

## Local Contracts

- Preserve MIT attribution, pinned Actions, restricted workflow permissions and the embedded licensed font. Never restore network-loaded fonts.
- Adapt reviewed corrections independently of upstream integration. Preserve schema-v1 inputs, explicit geometry, existing receipt failures and standard-quality compatibility.
- Keep private project data, installed backups, machine paths and local test receipts out of Git. Keep installation rollback outside the public package.
- Regenerate only artifacts affected by changed inputs. Build the canonical ZIP with Node 22 through the tracked-only stager.
- Existing user installation changes require a preimage, checks for concurrent/local edits and a verified readback. Preserve unrelated files and settings.

## Work Guidance

- Read CONTRIBUTING.md and the applicable DOX chain before editing. Keep changes small and credit adapted upstream contributions.
- Record tasks and verified evidence in the owner's initialized Beads workspace; do not initialize other projects implicitly.

## Verification

- Run failing regressions before fixes, focused compatibility checks afterward, then `npm test` from `archify/` and `git diff --check`.
- Browser behavior requires real Chrome checks; distinguish them from static geometry and perceptual review.
- Verify generated output and the extracted package match tracked source while preserving font/security customizations.

## Child DOX Index

- [archify/DOX.md](archify/DOX.md) — Skill runtime, contracts, source and tests.
