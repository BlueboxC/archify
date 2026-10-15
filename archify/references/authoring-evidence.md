# Repository evidence

## Repository evidence

When the diagram must reflect real code, inspect repository entrypoints,
runtime boundaries, storage, transports, and deployment configuration before
authoring. Record only evidence you actually verified. `--repo-root <path>` is
accepted by `render`, `validate`, `deliver`, and `preview` for every diagram
type, by architecture `compare`, and by workflow `migrate`; every mode verifies `meta.repository` and
node `sources` the same way. Migrating a source-backed workflow requires the same
`--repo-root` so its candidate is verified before replacing the destination.
Never infer runtime causality from file proximity
or naming alone.

Declare `meta.repository.url` and one full 40-character `revision`, then attach
`sources` to the mode's node collection (Architecture `components[]`, Workflow
and Data Flow `nodes[]`, Sequence `participants[]`, Lifecycle `states[]`) with
repository-relative `path`, optional `line`, `end_line`, and `label`.
Verification reads blobs at that commit, independently of working-tree edits.
Verification ignores local Git replacement refs, including those selected by
`GIT_REPLACE_REF_BASE`, and always reads the original objects at the pinned SHA.
It does not change repository configuration or delete replacement refs.
A matching local origin, available commit, bounded path,
blob, and valid line range are required in every link mode. Verification is
local and makes no remote requests; it establishes neither public availability
nor the current reader's access rights.

`link_mode` defaults to `web`. GitHub, Gitee, and GitLab HTTPS repository URLs
generate revision-pinned links; the public hosts github.com, gitee.com, and
gitlab.com select the provider automatically. Optional `provider: "github"`,
`"gitee"`, or `"gitlab"` must agree with a public host. A self-managed GitLab
host declares `provider: "gitlab"`; Archify never contacts the host to detect
its forge. Existing GitHub declarations and default delivery receipt fields
remain compatible.

GitLab URLs may name nested groups (`group/subgroup/project`). Source links use
`<url>/-/blob/<revision>/<path>#L<line>-<end_line>` and the repository link
uses `<url>/-/tree/<revision>`. A Markdown source (`.md`, `.markdown`) with a
line range links to the plain view (`?plain=1`) so the cited lines are
highlighted instead of the rendered document. GitLab repository paths compare
case-insensitively, like GitHub.

```json
{
  "url": "https://gitee.com/team/service",
  "revision": "0123456789abcdef0123456789abcdef01234567",
  "provider": "gitee"
}
```

```json
{
  "url": "https://git.example.com/platform/payments/service",
  "revision": "0123456789abcdef0123456789abcdef01234567",
  "provider": "gitlab"
}
```

For an internal or unsupported forge, select `link_mode: "local-only"`. The
Viewer retains SRC markers, searchable file paths, line ranges, and revision
labels without repository or source hyperlinks. The evidence receipt adds
`linkMode: "local-only"`. `url` remains required as the expected origin identity;
local-only disables links, not identity verification. A repository without an
origin is not supported.

```json
{
  "url": "http://git.internal:3000/Platform/Services/service",
  "revision": "0123456789abcdef0123456789abcdef01234567",
  "link_mode": "local-only"
}
```

Local-only accepts HTTP(S), `git@host:path`, and `ssh://git@host[:port]/path`
addresses, including nested namespaces. Declare a credential-free address;
HTTP(S) credentials on the checkout's origin are ignored for identity and
redacted from diagnostics. Hostnames compare case-insensitively; repository
paths retain case except for GitHub and GitLab. A trailing slash
normalizes away. Only GitHub, Gitee, and GitLab (gitlab.com, or a host declared
with `provider: "gitlab"`) normalize a terminal `.git` and match standard
HTTPS/443 with Git SSH/22 on the same host; a GitLab SSH endpoint on another host
or port is not inferred. For other hosts, use the actual clone address:
transport, port, `.git` suffix, and remote-relative versus absolute paths must
match. For example, `git@host:Team/repo` differs from
`ssh://git@host/Team/repo`; `git@host:/Team/repo` matches the latter. SCP-style
paths preserve literal percent escapes, while URI paths decode them. SSH host
aliases and forge-specific browse/clone prefixes are not guessed.
Gitea/Forgejo/Bitbucket web links are not implemented in this version;
use local-only until a tested link provider is available. Unknown web providers
fail with a diagnostic rather than emitting a guessed link.
