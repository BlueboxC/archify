# DOX.md — Viewer

## Purpose

Own authored Viewer scripts and styles that build the standalone Skill template.

## Ownership

Viewer modules own UI state, navigation, keyboard behavior, themes and export. The Skill CLI owns delivery and Preview transport.

## Local Contracts

- Follow README.md module interfaces and export cleanup contracts.
- Edit authored modules, then regenerate the template; do not patch generated template scripts directly.
- Preserve offline fonts, authored identity/geometry, accessibility and last-verified Preview recovery.

## Work Guidance

Use existing module interfaces and avoid introducing parallel state owners.

## Verification

`npm --prefix archify run check:viewer`; root maintained browser gate and export/WebM gates for affected behavior.

## Child DOX Index

- None.
