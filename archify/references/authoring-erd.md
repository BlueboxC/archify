# ERD placement

### ERD

Treat a schema ERD as a table catalogue as well as a relationship map. If the
schema has more than 8 tables or 50 fields, it is a dense full-schema map: start
with `meta.quality_profile: "standard"` so complete field visibility is not
traded away for repeated showcase route repairs. Include every physical column in
`attributes`, keep the source SQL type, and preserve the
field's Chinese comment in the type string as `SQL_TYPE｜中文备注` because the
schema has no separate comment property. The default viewer shows these rows at
the `read` level; do not rely on hover/focus or cards to reveal physical fields.
Cards may explain constraints, inferred relationships, or domain rules, but never
replace a field list.

Before placing boxes, classify tables into functional domains using verified table
names, comments, module paths, and foreign-key meaning. Put the domain name in
`tag` and give each domain one solid rectangle of grid cells: a single row, a
single column, or a filled rectangular block — not an L or a diagonal — with
every cell of the rectangle holding one of its tables.
All tables with the same tag stay together; do not interleave unrelated tables
between members. A domain that fills one such rectangle is drawn as a labelled
band behind its tables, so the
grouping is visible without reading every box;
a tag whose tables do not fill one rectangle earns no band, and because the band
is the only place a domain name is drawn the renderer reports
`erd/domain-not-drawn` rather than publishing a diagram that cannot name the
domain. Absolute
coordinates have no grid cells at all, so a tagged table always needs `row`/`col`.
Order parent/core tables
toward the shared boundary and
place their direct children beside or beneath them. Columns read left to right and
rows read top to bottom, so a relationship between neighbouring columns is one
straight corridor. Never place an unrelated entity between two aligned anchors;
the router can detour around it, but the clear corridor is shorter and reads
better. A junction table has two parents: put it in a cell beside or between
both, not beneath one of them with tables stacked between it and the other,
and keep every table that shares its domain tag in one solid rectangle of cells. A relationship must connect two different entities; a self-reference such as manager_id stays as a foreign-key column (and optionally a card), not an `employees`→`employees` edge.
Use `row`/`col` for this normal grouped layout, and only use explicit
`pos`/`via` after a diagnostic identifies a concrete geometry problem.

State every key role a column carries in `key`, and the real references in
`references`. A column is often more than one at once — a junction table's
`tenant_id` is both part of the primary key and a foreign key to `tenant.id` — so
`key` takes a role or a list (`["pk", "fk"]`), and dropping a role claims less
than the schema does.
A many-to-many pair is a real fact about the model, so state it and identify the join
table when one exists. A relationship has two ends and each one declares its own
maximum, so a `many`-to-`one` foreign key needs both `fromCardinality` and
`toCardinality`; `fromOptional`/`toOptional` only lowers that same end's minimum
from one to zero (an optional `one` end reads zero-or-one, an optional `many` end
reads zero-or-many), and `identifying: false` draws the non-identifying dashed
line and owns that dash — the schema rejects a `variant` that would draw the
relationship solid beside it. The foot opens toward the entity it describes, so the
drawn glyph states the end's maximum, not a direction of travel.

A table side only has room for so many ends: the ports spread at most `(side
extent - 32) / (ends - 1)` apart, and a cardinality glyph is 14 units tall. More
relationship ends than that room allows is `layout/marker-capacity`, which names
the table, the side, and the ways out — add fields so the side is taller, spread
the relationships, or reduce the fan-in. Never fix it by hiding the cardinality.

Give the domains a column each when the model has to read completely inside a
laptop viewport. The Reader scales a wide canvas up to the reader width and
narrows a tall one until the whole page fits, so the same eleven tables cost text
size when they are stacked as four horizontal domains instead of four vertical
ones. Leave a whole tile of the grid free where a long relationship has to cross
a domain: a run that crosses an occupied cell forces a jog, and a jog below the
interior floor is a `composition/short-interior-segment` failure.

An automatic canvas is sized so the default legend is always in the generated
content, and a canvas the author fixes with `meta.viewBox` reports its legend
capacity instead of dropping the key; see
[`../renderers/erd/README.md`](../renderers/erd/README.md) for the band, port, and
reader contract.
