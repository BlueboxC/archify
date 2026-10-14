# DOX.md — Regression tests

## Purpose

Protect source, distribution and Viewer behavior across supported runtimes.

## Ownership

Root tests own repository regression fixtures, helpers and browser checks. Installed Skills omit this repository-only tree.

## Local Contracts

- Keep independent regressions for the four adapted fixes and failure/recovery paths.
- Assert user outcomes; adapt obsolete automatic-layout expectations when a better valid result replaces an old limitation.
- Skips and platform simulations are not runtime passes. Keep real browser and package evidence distinct.

## Work Guidance

Use existing runners; add tests only for meaningful uncovered outcomes.

## Verification

Root `npm run test:full`, `npm run test:browser` with Chrome, and `npm run test:webm`; focused test files support diagnosis.

## Child DOX Index

- None.
