# Archify — BlueboxC fork

This fork keeps the five-type 2.17 development baseline and its schema-v1 inputs.
It backports reviewed corrections without importing the Archify 3.x release or
changing existing generated HTML in user projects.

Our original hardening remains: embedded JetBrains Mono with its OFL license,
immutable GitHub Action references, reduced workflow permissions and the existing
dependency lock. MIT and third-party notices remain intact.

## Adapted corrections

| Report | Source contribution | Fork behavior |
| --- | --- | --- |
| [#395](https://github.com/tt-a1i/archify/issues/395) | [applesnort, PR501](https://github.com/tt-a1i/archify/pull/501), `5d8d9ad7a6083a53e19246722337ea03674fd6dd` | Authored boundary membership reaches the artifact checker. Showcase rejects fully enclosed non-members; partial overlap and standard-quality containment warn. Compare frames/nodes are scoped by rendered version. Older HTML without membership is explicitly unjudged. |
| [#248](https://github.com/tt-a1i/archify/issues/248) | [robll-v1, PR260](https://github.com/tt-a1i/archify/pull/260), `b8b752ef7e34b10ba52c57266c053639bf59e0dc` | Coincident architecture routes produce an actionable showcase warning without rewriting explicit routing or accepting unrelated hard failures. Other diagram types keep their existing contract. |
| [#590](https://github.com/tt-a1i/archify/issues/590) | [gold-beyond, PR538](https://github.com/tt-a1i/archify/pull/538), `08d057862abe5e65c72a6551d199320629ec8e82` | Piped children use a 64 MiB default. Captured checker calls accept `ARCHIFY_CHECK_MAX_BUFFER`; exhausted capture reports `artifact/check-output-limit` and preserves previous output. The direct checker streams. Natural checker shutdown also flushes complete JSON before exit. |
| [#927](https://github.com/tt-a1i/archify/issues/927) | [To3akaRin, PR930](https://github.com/tt-a1i/archify/pull/930), `83632403931d995c5d1507b31bc44d96a7e4c469` | New Preview clients restore the retained verified revision during checking/failure; status, diagnostics and same-revision focus remain intact. |

The upstream implementations and tests are adapted under MIT. Open upstream PRs
remain proposals there; their inclusion here does not imply upstream approval.
This baseline has no `finalize` command, so its 3.x capture changes are not copied.
Compare generation checks both snapshots independently. A later check of the
overlay can judge only the geometry it actually contains, including any drawn
baseline phantoms; it cannot reconstruct omitted baseline geometry.

## Verification and installation

Run `npm ci` and `npm test` from `archify/`. The focused regression files are
`boundary-membership.test.mjs`, `coincident-routes.test.mjs`,
`checker-buffer.test.mjs` and `preview-browser.test.mjs`. Set `ARCHIFY_CHROME`
to execute the real Preview browser tests; skipped checks are not passes.

The ZIP uses `scripts/build-zip.sh` with Node 22 and the tracked-only stager.
Qualify the extracted package independently. Existing installations require a
private backup and source/hash reconciliation before replacing affected files;
preserve local additions and stop for conflicting edits. Keep installation
receipts and rollback material outside this public repository.
