# DOX.md — Explainer documents

## Purpose

Own structured explanatory HTML, embedded diagrams and static data charts.

## Ownership

This directory owns document parsing, rendering, dependency freezing and the vendored Pele chart compiler. References own authoring guidance; root tests own regression fixtures.

## Local Contracts

- Preserve source and data bytes. Chart display labels retain literal quotes, backslashes and line breaks; normalize ordinary display spacing only.
- Declared chart-data and external native-diagram paths are protected inputs even when their content fails preparation. Publication uses the shared physical-path alias checks; failures never replace those inputs with evidence.
- Parse quoted CSV records across line endings. Reject malformed or ambiguous selected data before publishing; preserve the previous delivered artifact on failure.
- Keep file-scope validation, finite values, row limits, frozen dependencies and atomic delivery unchanged. Vendored chart code keeps its license and notices.
- Explainer does not change global agent instructions or activate proactive output during installation.
- At narrow widths the existing toolbar wraps within its page column. Style and Export menus anchor below the complete toolbar so wrapped controls cannot place a popup outside the viewport. Preserve desktop layout, keyboard handlers, print exclusion and offline loading; no version-check control or network feature is introduced.
- Cyclic shorthand can try one alternate placement through the existing native renderer and validator. Keep authored nodes, relations, input bytes and explicit/edited geometry intact; publish only a validated candidate. Preview lane classes follow the selected rendering without changing the retained source model.

- Pie legend normalization preserves diagnostic line counts, including blank lines and standalone showData. Retain accepted multiline slice whitespace and rendered SVGs.

- Match Pele detector IDs when redirecting chart fences to native modes, including treeView-beta to the native tree shorthand.

## Work Guidance

Reuse the document diagnostic and publication paths; keep chart errors located at the authored block.

## Verification

Root Explainer tests, chart-data fidelity regressions, maintained browser gate and extracted-package checks. Skipped browser checks are not runtime evidence.

## Child DOX Index

- None.
