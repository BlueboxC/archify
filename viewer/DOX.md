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
- Compacted ordinary page flow pins the SVG top and restores the original inline height/alignment, including priorities, on reset or mode changes. Passport, Finder and Figure index small-text ink remains readable across supported themes/presets, including selected rows, without changing semantic border/stroke colors.
- Preserve offline fonts, authored identity/geometry, accessibility and last-verified Preview recovery.

- Mobile dock clearance follows its measured wrapped height; all actions and route overlays remain reachable. A capped semantic Lens shrinks its scrollable kinds list so Clear/Copy remain reachable at large root fonts. Presentation overflow keeps its leading edge scrollable. Default-label ink has its own token in light/print presets, while dark and semantic colors retain their contracts. Export filenames prefer the authored heading over translated page suffixes and preserve normalized Unicode. Without an authored heading, retain the complete document title; never guess which suffix words are generated.

- Print clears dock height in CSS even when page scripts are disabled; returning to screen media retains measured mobile clearance.
- Classic grid suppression is scoped to the SVG preset so standalone auto/light/dark exports retain the Viewer rule. Other presets keep their grid styles.

## Work Guidance

Use existing module interfaces and avoid introducing parallel state owners.

## Verification

`npm --prefix archify run check:viewer`; root maintained browser gate and export/WebM gates for affected behavior.

## Child DOX Index

- None.
