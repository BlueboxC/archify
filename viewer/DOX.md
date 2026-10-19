# DOX.md — Viewer

## Purpose

Own authored Viewer scripts and styles that build the standalone Skill template.

## Ownership

Viewer modules own UI state, navigation, keyboard behavior, themes and export. The Skill CLI owns delivery and Preview transport.

## Local Contracts

- Follow README.md module interfaces and export cleanup contracts.
- Edit authored modules, then regenerate the template; do not patch generated template scripts directly.
- Composition and IME commit events remain native. Modified navigation leaves roving focus unchanged; preserve ordinary and printable Shift shortcuts. Refresh owned public Viewer copies without altering authored diagram geometry.
- Camera clipping and panning use the container content box, excluding reserved Dock padding, without shrinking the SVG viewport. Preserve overview, reset and authored geometry.
- Preserve offline fonts, authored identity/geometry, accessibility and last-verified Preview recovery.

## Work Guidance

Use existing module interfaces and avoid introducing parallel state owners.

## Verification

`npm --prefix archify run check:viewer`; root maintained browser gate and export/WebM gates for affected behavior.

## Child DOX Index

- None.
