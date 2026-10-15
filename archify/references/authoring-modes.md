# Mode placement

## Mode placement

### Architecture

Choose overview or mechanism detail using [Composition and meaning](authoring-defaults.md#composition-and-meaning). Use one obvious primary reading path, which may step across meaningful rows when the requested topology needs room. Keep the overview readable at its chosen abstraction; expand implementation details when they answer the reader's question. Group only real ownership, trust, process, or deployment boundaries. Boundaries do not replace relationships.

Grid placement is preferred when the schema supports it. Free positions are appropriate for a bounded exception, not for prose-level coordinate planning. Keep external actors outside the system boundary when that is factually true. A boundary is drawn as the padded box around all of its members, so place them as one compact axis-aligned cluster (no empty bay that lets a non-member sit inside the padded frame) and keep every non-member outside that box; `layout/boundary-encloses-non-member` reports a component the box swallows in showcase quality. Standard retains its existing acceptance behavior.

### Workflow

Lanes express responsibility or phase. Columns `0..5` express logical
progression. Start new workflows on `readable-v2`; retain `fixed-v1` only for
legacy geometry compatibility. In readable-v2, nodes may share a `(lane, col)`
when distinct `yOffset` values leave room for their full rectangles, labels and
connecting routes. Keep the happy path monotonic, preserve semantic edge labels,
and route retries and exception returns outside the main lane corridor.

#### Workflow viewport repair

When `viewer/viewport-overflow` includes `workflowLanes`, inspect the tallest
rendered frames and their node span before changing the source. Measurements
are CSS pixels; space above/below nodes includes lane titles and routing, so it
is not a removable-space budget. Frame IDs identify rendered lane indices.

Run `validate workflow <source.json> --layout-json` and match those frames to
source lanes and nodes. Check whether many steps share the last logical column
and use large `yOffset` values. Readable-v2 reserves symmetric space around
offsets. With a same-column vertical stack, an implicit canvas and no absolute
route or label pins, it measures each lane independently. Other cases retain
shared-height geometry for compatibility; see the canonical
[lane measurement contract](../renderers/workflow/README.md#readable-v2).

Where the source's ownership and explicit geometry permit, redistribute steps
across logical columns and meaningful lanes, keeping the main path monotonic.
Preserve every required node, relationship, label and semantic check. If ownership
or absolute pins prevent reflow, report that constraint instead of merging lanes
or moving pins automatically. Validate the changed JSON, deliver a fresh HTML,
then rerun browser checks and inspect the first screen; a static pass alone does
not settle viewport fit. These are repair directions, not guaranteed coordinates.

### Sequence

Participants are ordered by conversation role. Messages own their vertical order. Use return/async/security variants for meaning, not decoration; sequence does not use Automatic Port Spread. A segment's `from`/`to` edges must stay at least 4px off every message arrow (`message.y`): an edge along an arrow leaves the reader unable to tell which phase the message belongs to, and showcase quality reports `sequence/segment-message-border-run`. Standard retains its existing acceptance behavior.

First-draft shape: every message needs an `id`, `from`, `to`, `label`, and integer `y` at least 160. Matching `from` and `to` IDs draw an orthogonal self-call on that participant; reserve its 42px loop plus 28px clearance before the next overlapping message. Optional phase bands are `segments[]` with only `from`, `to`, and `label` (no segment `id`). Inventing `pos`/`size` on participants fails schema validation — order alone places them. Omit `meta.viewBox` so automatic height fits the timeline + legend (minimum 327px readable band) instead of a fixed 760px floor, and so 2–3 participant spreads pack below the 920px default when labels fit (4+ stay at 920px; long labels still widen).

### Dataflow

Stages express transformation or custody. Rows separate parallel streams. Give every flow a concise data-contract or movement label; choose its visual convention using the required [Dataflow authoring defaults](authoring-defaults.md#presentation-and-modes).

First-draft shape: declare `stages[]` (each a `{label}`), then place every node with integer `stage` and `row` — not `pos`/`size`. Flows are `flows[]` with required `from`, `to`, and non-empty `label`.

Omit `meta.viewBox` to fit canvas width to all stages and nodes in either quality
profile, including explicit node widths. Width uses content + 24px right padding
with a 480px minimum (five default stages still need ~1068); left-edge overflow
still needs a node repair. An authored viewBox stays fixed. Showcase node growth, readable typography, content height, port bridges
and bounded label placement apply only when the canvas and all node widths are
omitted. `--quality` overrides `meta.quality_profile`; without it, the renderer
uses `ARCHIFY_QUALITY_PROFILE` when set, otherwise the JSON profile.

### ERD

Read [ERD placement](authoring-erd.md#erd).

### Tree

A tree answers "how is this decomposed?": one root, and every other node names
exactly one `parent`. Links mean containment only; do not use a tree for calls,
data movement, or cross-branch dependencies. Nothing is inferred: a missing
parent (`tree/missing-parent`), zero or several roots (`tree/root-count`), a
parent cycle (`tree/cycle`, which also covers every node stranded beneath it),
and duplicate ids are refused. Children read in declaration order.

Use `layout.direction: "down"` (default) for a shallow, balanced breakdown and
`"right"` for a deep or leaf-heavy tree such as a repository layout; a rightward
tree aligns each parent with its first child and scrolls vertically in the
reader. Labels wrap between words. `collapsed: true` makes a branch start
collapsed in the Viewer; it never removes content from the artifact, and every
export is the complete tree. For a real codebase, ground each node in the
observed path and attach `sources`. See
[`../renderers/tree/README.md`](../renderers/tree/README.md).

### Class

A class diagram explains the contracts inside one module: which types exist,
which members matter to the explanation, and how the types relate. Choose the
members the question needs; a type may show none. Each type states its `kind`
(`class`, `abstract`, `interface`, `enum`, `record`); every kind except `class`
draws its UML keyword, so an interface never reads as an empty class. For a real
codebase, ground every type, member, and relationship in repository evidence and
attach `sources`.

Every relationship reads `from` -> `to` and its `kind` owns the notation:
`dependency` (`from` uses `to`, dashed open arrow), `association` (`from` holds a
`to`, solid open arrow), `inheritance` (`from` extends `to`, solid hollow
triangle), `realization` (`from` implements interface `to`, dashed hollow
triangle), `composition` and `aggregation` (`from` is the whole, filled or
hollow diamond at `from`). Realization must target an interface from a
non-interface; inheritance must not cross the interface boundary; an
inheritance cycle is rejected.

Place types on the `row`/`col` grid with supertypes above their subtypes. Two
or more automatic generalizations into one supertype draw as one hierarchy bus
with a single triangle. Members never truncate: a type grows to its widest
member up to `layout.typeMaxW` and longer members wrap at parameter boundaries.
See [`../renderers/class/README.md`](../renderers/class/README.md).

First-draft shape: types use `row`/`col` (not `pos`/`size`), fields go in
`attributes[]`, operations in `methods[]` with `parameters` as one string such as
`"msg: Message"` (not an array of objects). Enum members are attributes with only
`name`. Relationships need an `id`, `from`, `to`, and `kind`.

### Timeline

A timeline answers "when did what happen, and how far apart?". Every event
needs an ISO 8601 `at` with an explicit `Z` or `±HH:MM` offset; a timestamp
without one is rejected rather than guessed. `meta.timezone` (IANA, default
`UTC`) is the display clock for ticks and labels, and the axis caption states
it. `meta.evidence` is required: `observed` for recorded events (logs, git
history, pager records) and `illustrative` for explanatory input. Never mark
invented or approximate times as observed, and never fill gaps with events the
input does not contain.

Use `lanes` for sources or categories (release, monitoring, response); every
event then names one. Each event's visible text is `title` (not `label`). `kind`
(`default`, `change`, `alert`, `action`, `recovery`) only
colours the card; inventing values such as `milestone` fails schema validation. Events are drawn in time order whatever the authored order;
simultaneous and close events stack. By default a quiet period longer than 8×
the median gap and 10% of the span is drawn as a fixed-width break labelled
with the omitted duration; `layout.breaks: "none"` keeps one proportional axis.
See [`../renderers/timeline/README.md`](../renderers/timeline/README.md).

### Waterfall

A waterfall answers "where did the time go?" for one request, job, or agent
run. Each span has `id`, `name`, `start`, and `end` or `duration` in
`meta.unit` (`us`, `ms`, `s`; default `ms`), plus optional `parent`, `status`,
`service`, and `detail`. Bar position and length come only from these numbers.
`meta.evidence` is required: `measured` only for recorded timing (trace export,
logs, profiler, timed run); otherwise `illustrative`. Never infer a duration
from code structure, and never present estimated numbers as measured.

A span with no recorded end must be `status: "incomplete"`; it is drawn as an
open lower bound to the last recorded instant. Contradictory end/duration,
an end before the start, a missing parent, or a parent cycle is refused.
Percentages are always "of the wall-clock total"; parent and child durations
are inclusive and never summed. Do not mark a critical path or waiting time
unless the input states the dependency. See
[`../renderers/waterfall/README.md`](../renderers/waterfall/README.md).

### Lifecycle

Schema v3 is the only lifecycle contract. `mainPath` lists the happy path from
the initial state; every consecutive pair needs a transition. The renderer owns
all geometry: the main path is one row, transitions back to an earlier phase
(or skipping ahead) become arcs above it, and every other state sits below the
state it branches from, one row deeper per step away from the main path.
Equivalent exits share one arrow only when their labels, notes and variants
match and exactly one group from at least two main-path phases qualifies for
that target. Consecutive phases receive a composite frame; non-consecutive
phases share a bus. Other exits stay separate, including distinct notes on
their original transitions. Do not remove or copy notes to force sharing.
There are no lanes, columns, sizes, or routing controls. Layout retries retain
the transition text's minimum gap and stop widening the main-path row when its
minimum width would exceed the original text readability budget; the final
width and label-clearance checks still apply.

Keep the main path to the phases a reader follows, at most about six states,
and keep transition labels short. A recoverable failure needs a real transition
back to an active state; a card saying “retry” is not topology.

Pick each state's `type` by what the reader should notice, since color and the
corner sigil follow it: `waiting` for a pause on a person, time, or input;
`decision` for a review or branch point; `success` or `failure` for a good or
bad outcome; `neutral` for parked states and outcomes that are neither;
`external` when an outside party holds the work; `active` otherwise. From a
Mermaid `stateDiagram`, `[*] -->` names the first `mainPath` state, a state
with `--> [*]` is an outcome (`success`, `failure`, or `neutral`; it is drawn as
final when it has no other outgoing transition), and `<<choice>>` becomes a
`decision` state. Flatten a composite `state X { ... }` into its inner states
and repeat its exit from each of them with one label; consecutive main-path
phases sharing that exit are framed automatically. Concurrent regions (`--`)
have no lifecycle form: draw one lifecycle per region.
