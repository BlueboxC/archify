# Delivery provenance and recovery

## Validate and deliver

`render` and direct renderer entry points print classified authoring failures
to stderr as readable diagnostics and exit 1. Input read/JSON parse failures
use `input/read` or `input/json-parse`; output filesystem failures use
`output/write` and identify the output path. Schema and layout failures keep
their existing rule codes. Use the advertised `validate --json` or
`deliver --json` interface for a machine receipt; `render` has no `--json` flag.
Unexpected implementation failures retain debugging information in human
mode and remain `internal/unclassified` in machine receipts.

Each delivered output has two artifact-specific metadata paths. When an output
stem is too long for those derived filenames, Archify shortens it and appends a
stable hash:

- `<output-stem>.delivery.json` records the latest completed attempt.
- `<output-stem>.delivery-pending.json` is the recovery journal for an attempt
  in progress.

For a literal artifact stem that already matches Archify's reserved bounded-name
marker, a pre-namespace raw provenance sidecar remains a read fallback when the
encoded sidecar is absent. A pre-namespace raw pending journal is an independent
fail-closed barrier: it blocks checks and redelivery even when an encoded pending
journal also exists, and neither journal is silently replaced.

One directory-wide `.archify-delivery-lock.json` serializes every delivery that
resolves into the same physical output directory. This deliberately prevents
case, Unicode-normalization, Windows short-name, and symbolic-link aliases from
creating independent owners for one filesystem location. The tradeoff is that
deliveries to different artifact names in one directory also run serially;
provenance and pending journals remain artifact-specific.

For migration safety, Archify also detects and preserves a legacy
`<output-stem>.delivery-lock.json` beside the requested artifact. An existing
legacy entry is a fail-closed recovery barrier. While a new delivery owns the
directory mutex, it also holds temporary legacy-format fences for the requested
spelling and an existing artifact's physical target spelling. It acquires the
directory lock first, then all required compatibility fences before writing a
journal or artifact, and removes the directory lock before those fences during
release. This blocks an older Archify binary using
either known spelling from entering the delivery. A legacy fence whose raw
HEAD-era filename exceeds the host component limit is omitted because the old
binary could not create that lock or deliver that artifact on the host either.

`deliver` acquires the lock by exclusive `open(..., "wx")` before creating or
replacing the recovery journal. A successful exclusive create yields an
internal opaque ownership capability bound to that attempt. Journal creation,
failed-provenance recording, pair commit, rollback, journal finalization, and
lock release each verify the current capability inside the operation that
would mutate shared state. A rejected contender does not create a journal or
write failed provenance.

An existing directory or legacy lock is handled without automatic recovery:

| Observed lock state | Required `deliver` result |
| --- | --- |
| No directory entry | Attempt exclusive creation; only its success grants ownership. |
| Valid schema-v1 lock whose PID is running, or whose death cannot be established | Exit 1 with `delivery/concurrent-attempt`; preserve every shared path. |
| Valid schema-v1 lock whose PID is known to have exited | Exit 1 with `delivery/lock-stale`; preserve the lock, artifact, journal, and current provenance exactly. |
| Unreadable, malformed, symlink, dangling symlink, directory, or other non-regular lock entry | Exit 1 with `delivery/lock-invalid`; preserve the entry and every other shared path. |
| An acquired capability no longer matches the current lock or journal | Exit 1 with `delivery/ownership-lost`; stop all shared-path mutation. |
| The matching owner cannot remove its lock | Exit 1 with `delivery/lock-release`; preserve the lock. |

A `delivery/lock-stale` diagnostic identifies the absolute output and lock
paths plus the original PID and receipt ID. Recovery is deliberately explicit
and serial: stop all delivery attempts for that physical output directory,
confirm that no active delivery owns it and that the reported stale entry has
not been replaced, remove only the reported lock, then rerun `deliver`. Do not
remove an artifact, current provenance, or pending journal as part of
stale-lock recovery.

The lock protocol targets Node.js 18 or later on a local filesystem with
cooperating Archify processes. PID, receipt, and file-identity comparisons are
defensive checks, not an atomic compare-and-swap. Compatibility fences cover
the requested spelling and an existing physical-target spelling; they cannot
enumerate arbitrary hard-link names or previously unknown filesystem aliases,
so mixed-version delivery through such aliases remains out of scope. This
contract does not claim distributed-lock correctness on NFS, SMB, or other
network filesystems, and it cannot prevent an external process that ignores
the protocol from replacing shared paths.

Every no-clobber HTML publisher (`render`, `deliver`, `compare`, and `preview`)
captures the requested directory entry, canonical write slot, physical parent,
and existing target type, device/inode identity, and mode before staging, then
revalidates that snapshot immediately before replacement. An existing write
target must be a regular file with exactly one hard-link name. A target with
multiple hard-link names fails closed with `output/target-hardlinked`: replacing
the requested name cannot update unknown sibling names as one publication.
Hard links remain supported for read identity and input/alias collision checks;
they are unsupported only as write targets. A symbolic link to a single-link regular
file remains supported: publication preserves the symbolic-link entry and
applies the same protocol to its resolved target. Directory, FIFO, socket,
device, changing mode, new claimant, and indeterminate identity cases fail
before replacement.

Publication is no-clobber and recoverable, not crash-atomic replacement of an
existing target. To avoid overwriting a claimant that appears after the last
identity check, Archify first retains the bound old file in a private recovery
backup, removes the public name through identity-bound quarantine, and then
creates the new public name with an exclusive hard link. A caught failure rolls
back when the public slot and recovery binding still permit it. A process
interruption between those namespace operations can instead leave the public
path absent while the verified previous bytes remain in an adjacent private
recovery backup. Single-artifact publication records the original slot/alias
identity and backup inode, mode, SHA-256, and byte count in private
`.archify-remove-*/publication-recovery-v1.json`, beside `previous`. To make a
specific interrupted publication visible again, stop concurrent writers and run:

```bash
node bin/recover-output.mjs /absolute/path/to/.archify-remove-<id> --json
```

This is explicit recovery, not a directory scanner. Before linking, the helper
checks for a changed parent or alias, an altered/hardlinked record or backup,
digest or inode mismatch, and any existing public target. It restores only by
no-clobber hard link, so a new claimant is preserved rather than overwritten;
it never recursively removes unknown entries. A completed recovery is
idempotent. The record is evidence to be independently verified, not an
authority to restore arbitrary private bytes: the helper accepts it only from
the recorded generated child of the original physical target parent, with the
same directory identity. Name the exact directory reported by the interrupted
process and inspect an uncertain record manually. A non-cooperating process can
still swap pathnames after those checks and before Node.js `linkSync`; Node does
not expose a descriptor-bound link operation. Post-link identity verification
then fails closed and retains recovery evidence, rather than claiming recovery
or deleting an uncertain name. If recovery itself is interrupted after the
link, the old public bytes and private backup can both remain; a later recovery
run preserves the public target and needs explicit operator resolution. The
record is fsynced before the old public name is retired on platforms supporting
directory sync, and the tested guarantee is recovery after a killed process;
this is not a claim of power-loss, storage-controller, NFS, or SMB durability.
Paired flows retain their backup in private transaction staging. For `deliver`,
the pending journal and lock keep strict checkers fail-closed. The portable
Node.js filesystem API has no pathname
compare-and-swap that both replaces an existing name atomically and refuses to
overwrite a late claimant: `rename` would close the visibility gap only by
overwriting that claimant.

After ownership is established, `deliver` creates the journal before rendering
and keeps it through the recoverable HTML/sidecar pair commit. It removes the
journal only after that commit completes. A validation, render, or pair-commit
failure, or a process interruption, may therefore leave a journal. The journal
is a safety barrier: `check`, `browser-check`, and `visual-check` fail closed when any directory
entry exists at the journal or lock path, including an unreadable file,
symlink, or dangling symlink. Run deliveries targeting the same physical output
directory serially; one attempt must finish or be recovered before another
begins.

A successful sidecar has `schemaVersion: 1`, `status: "current"`,
`command: "deliver"`, a unique `receiptId`, the diagram `type`, an absolute
`input` path, an absolute `output` path matching the inspected
artifact, and specification/artifact SHA-256 and byte counts. Checkers treat a
missing, malformed, unsupported, or inconsistent field as invalid. They also
reject a sidecar symlink, including a dangling one. A checker binds provenance
to the artifact bytes it actually checks and verifies that binding again before
reporting success; a concurrent byte change fails. The provenance directory
entry itself must be a single-link regular file: `deliver` and strict check fail
closed with `delivery/provenance-hardlink-unsupported` when it has another hard
link, without scanning for or guessing the sibling name.

If a currently verified owner fails after an older HTML exists, Archify writes
a new `status: "failed"` sidecar and leaves the journal until recovery is
complete. An unreadable old HTML does not prevent that marker; its artifact hash
and byte count may be absent. If the sidecar is locked or otherwise unwritable,
Archify keeps the prior sidecar rather than deleting evidence, and the journal
prevents checkers from trusting it. A rejected concurrent, stale, or invalid
lock attempt does not write failed provenance. If ownership is lost, Archify
reports `delivery/ownership-lost`, does not overwrite or remove the successor's
artifact, provenance, journal, or lock, and does not claim recorded failed
provenance; a failure receipt may report `provenance: "unrecorded"`. If every
metadata path is unavailable, the same unrecorded status applies; no tool can
preserve that fact across processes. Restore metadata-path access and complete
a successful `deliver` before trusting the output.

Artifacts with no sidecar, journal, or lock remain supported for backward
compatibility and for the lower-level `render` command. Their checker receipts
report `provenance: "unknown"`; use `--require-provenance` to turn that state
into a non-zero failure when the workflow requires a successfully delivered
artifact:

```bash
node bin/archify.mjs check <output.html> --require-provenance
node bin/archify.mjs browser-check <output.html> --json --require-provenance
```

## Recovering a failed comparison

`compare` commits an HTML artifact and its JSON receipt as a pair. If that commit
fails, it attempts to restore the previous files. A complete rollback removes
the temporary directory as usual.

If a previous file cannot be restored, compare exits non-zero with
`delta/commit-rollback-failed` and retains the recovery directory. In the JSON
failure receipt, `diagnostics[].evidence.recoveryDirectory` identifies that
directory and `recoveryFiles` lists `{ backup, target }` paths for the files whose
restoration failed. Human-readable diagnostics also print the recovery paths.

Resolve the filesystem error, inspect the current targets, and restore each
listed backup to its corresponding target before retrying. Keep the recovery
directory until both previous files have been recovered and verified; it can
also contain rejected candidate files, which must not be mistaken for backups.
Successful comparisons and failures before commit retain their normal cleanup.

## Last-Good Live Preview

For an active desktop authoring loop only:

```bash
node bin/archify.mjs preview <type> <input>.json <output>.html --quality showcase
```

Preview watches one explicit input on loopback, binds each stable digest to a private snapshot, and advances only after the existing verified delivery pipeline passes. Invalid, half-written, deleted, or superseded input leaves the previous verified revision on screen and on disk. Identical bytes do not rebuild or reload.

The preview runtime ships inside the zero-dependency Skill ZIP and must work without `node_modules`.

Never start it by default. Do not use it for CI, unattended agents, remote sharing, or mobile use. `--no-open` is only for a user who will open the printed local URL or for loop testing. Stop it with Ctrl-C before handoff. The first Ctrl-C drains the active delivery without publishing it; a second Ctrl-C forces shutdown of both delivery processes and HTTP connections, including incomplete requests. Shutdown preserves the last verified artifact and removes only staging files whose ownership can be verified. If delivery is interrupted before its receipt reaches Preview, unconfirmed files and recovery material may remain in the private staging directory; shutdown does not recursively delete unknown contents. Server state, port, source path, diagnostics, error text, and reload tokens must never enter the generated artifact or any export.
