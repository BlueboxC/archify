# Purpose

Own Story walkthroughs and component choreography bundled with the Skill.

# Ownership

Own native-document scanning, brief/source-map generation, Viewer attachment, choreography planning, animated/still SVGs, Stage HTML and video adapters. The parent owns CLI dispatch, native renderers, schemas and package distribution; root test/ owns Story regressions.

# Local Contracts

- scan is read-only; draft and attach preserve source identities and the complete native document. Keep source topology and authored IDs when adding playback.
- Validate choreography against the parent story-choreography schema. Explicit timing cannot overlap steps or overrun the story; structural relation diagrams require allowStructuralTrace for live tokens, and removed elements reject live transfer.
- Code excerpts retain verified paths, at most20lines and the owning view's exact revision. Explicit pins never fall back to working-tree text; outputs cannot replace cited inputs.
- Keep recoverable no-clobber publication and parent-identity checks. Rollback preserves another writer's replacements and reports retained recovery paths when restoration is incomplete.
- Stage honors reduced motion and restores playback controls and reader position after video success, failure or cancellation. Codec or browser unavailability remains a structured failure; SVG or browser checks do not establish decoded media success.
- Keep the Node-only parse5 7.3.0/entities6.0.1 parser bundle and its MIT/BSD licenses. Story shares the Skill release; it has no separate package.json or installation step.

# Work Guidance

Read [Story authoring](../references/story-authoring.md) for command, timing, identity and source rules. Reuse the existing attachment/choreography/output interfaces. Read [parser provenance](vendor/README.md) before changing its inputs.

# Verification

- Repository tests test/story.test.mjs and test/story-choreography.test.mjs cover package-only operation, preserved inputs, malformed briefs, revision pins, timing, SVGs and rollback.
- The maintained browser runner covers test/story-browser.test.mjs and test/story-choreography-browser.test.mjs. Honor CI's existing Story media owner when that coverage belongs to the WebM lane.
- The existing test:webm gate supplies decoded-media evidence. Keep unsupported codecs, skipped checks and perceptual review distinct.

# Child DOX Index

None; vendor/ retains its provenance README and license files.
