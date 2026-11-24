# Purpose

Own the separately packaged Code Analysis pipeline and workbench bundled with the Skill.

# Ownership

Own this package's schemas, extraction adapters, module graphs, rules, imported reports, captured source/tasks, local serving, overlays, vendored parsers and module tests. Parent Skill CLI dispatch and repository integration/browser tests stay outside this boundary.

# Local Contracts

- Preserve this package's own version and MIT license plus vendor notices; bundling in a stable Skill does not make its development version a separate stable release.
- prepare writes a captured investigation and exits. serve/start is an explicitly requested loopback workbench; origin/token checks fix repository and output scope server-side. Failed analysis preserves the last successful result and authored input diagram.
- Validate intermediate schemas and agreement between captured facts, graph ownership and aggregates. Keep working-tree captures, pinned PR sides and authored diagram evidence distinct; missing adapters or coverage remain explicit.
- The bundled TypeScript SDK is the default. auto or an explicit project SDK is an opt-in that executes the selected package; preserve SDK provenance and never imply that inferred dependencies prove runtime behavior.
- Keep external warning defaults, source-severity opt-in and baseline review semantics. Changed coverage, rules or severity policy can make comparisons incomparable; unknown or incompatible evidence cannot qualify new-only gating.
- Task/source navigation remains tied to captured identity and checked ranges. The browser cannot choose repository/output paths; optional language helpers and duplicate tooling retain the prerequisites and scope in the usage guide.

# Work Guidance

Read [README](README.md), [architecture](ARCHITECTURE.md) and the relevant [usage](docs/USAGE.md), [technical](docs/TECH-GUIDE.md) or language contract before changes. Reuse the shared extraction, graph, diagnostic and evidence interfaces.

# Verification

- This package's test script runs test/*.test.mjs after pretest checks the Python bundle, TypeScript declarations and vendored Node bundles.
- Preserve source-identity.test.mjs, comparability.test.mjs, boundary.test.mjs, external-contract-regressions.test.mjs, task.test.mjs and pull-request.test.mjs controls alongside adapter suites.
- Root maintained Chrome tests cover integrated, standalone, PR, boundary and workbench views. Static fixtures do not prove live external review providers, native language tooling or runtime behavior.

# Child DOX Index

None.
