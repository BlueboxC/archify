# DOX.md — Archify fork

## Purpose

Maintain BlueboxC's Archify fork and compatible, verified corrections to the ten-type Archify 3.1.0 release.

## Ownership

Root owns distribution builders, workflows, community intake, agent integration metadata, generated public examples, licensing and fork policy. `archify/` owns the installed Skill runtime. `viewer/` owns authored Viewer sources; `test/` owns repository regression tests.

## Local Contracts

- Keep fast-uri >=3.1.8 in both root and Skill development dependency graphs.
- Preserve MIT attribution, pinned Actions, restricted workflow permissions and the embedded licensed font. Never restore network-loaded fonts.
- Adapt reviewed corrections independently of upstream integration. Preserve schema-v1 inputs, explicit geometry, existing receipt failures and standard-quality compatibility.
- Automatic GitHub Pages publishing is limited to the original repository; the fork still builds and verifies the website without provisioning hosting.
- Keep private project data, installed backups, machine paths and local test receipts out of Git. Keep installation rollback outside the public package.
- Regenerate only artifacts affected by changed inputs. Build the canonical ZIP with Node 22 through the tracked-only stager.
- Existing user installation changes require a preimage, checks for concurrent/local edits and a verified readback. Preserve unrelated files and settings.

## Work Guidance

- Read CONTRIBUTING.md and the applicable DOX chain before editing. Keep changes small and credit adapted upstream contributions.
- Record tasks and verified evidence in the owner's initialized Beads workspace; do not initialize other projects implicitly.

## Verification

- Run failing regressions before fixes, focused compatibility checks afterward, then root `npm run test:full`, the maintained browser gate and `git diff --check`.
- Windows repository-evidence fixtures bind the actual credential-free checkout origin and pinned revision; keep origin validation strict.
- Browser behavior requires real Chrome checks; distinguish them from static geometry and perceptual review.
- Verify generated output and the extracted package match tracked source while preserving font/security customizations.

## Child DOX Index

- [archify/DOX.md](archify/DOX.md) — Skill runtime, contracts and bundled source.
- [viewer/DOX.md](viewer/DOX.md) — authored Viewer modules and generated template boundary.
- [test/DOX.md](test/DOX.md) — regression ownership and runtime/package/browser gates.
