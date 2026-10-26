# Third-party notices

Archify includes optional vector data for third-party brand marks. These marks
are provided only to identify technologies and services in user-authored
diagrams. Their inclusion does not imply sponsorship, endorsement, partnership,
or affiliation with Archify.

The Archify MIT license applies to Archify's own code and content. It does not
replace the copyright licenses, trademark policies, or brand guidelines that
apply to third-party marks. Users are responsible for confirming that their
particular use is permitted.

## Simple Icons

Most of the built-in vector paths and their metadata were generated from
[Simple Icons 16.28.0](https://github.com/simple-icons/simple-icons/tree/16.28.0).
Simple Icons makes its collection work available under
[CC0 1.0 Universal](https://github.com/simple-icons/simple-icons/blob/16.28.0/LICENSE.md).

As Simple Icons explains in its
[disclaimer](https://github.com/simple-icons/simple-icons/blob/16.28.0/DISCLAIMER.md),
CC0 for the collection does not mean that every underlying icon is CC0. License
and brand-guideline metadata may be incomplete or change over time. The absence
of an individual license entry is not a grant of permission.

Archify embeds the selected icons as vector-path data and may render them in a
user-selected color. The following individual licenses were recorded in the
pinned Simple Icons 16.28.0 metadata:

| Mark | Recorded source | Recorded license | Archify treatment |
|---|---|---|---|
| Angular | [Angular press kit](https://angular.dev/press-kit) | [`CC-BY-4.0`](https://creativecommons.org/licenses/by/4.0/) | Embedded as vector-path data; color may be changed by the authored diagram. |
| Apache Airflow | [Apache logos](https://apache.org/logos) | [`Apache-2.0`](https://www.apache.org/licenses/LICENSE-2.0) | Embedded as vector-path data; Apache trademarks remain subject to the [ASF trademark policy](https://www.apache.org/foundation/marks/). |
| Apache Kafka | [Apache logos](https://apache.org/logos) | [`Apache-2.0`](https://www.apache.org/licenses/LICENSE-2.0) | Embedded as vector-path data; Apache trademarks remain subject to the [ASF trademark policy](https://www.apache.org/foundation/marks/). |
| .NET | [.NET brand repository](https://github.com/dotnet/brand/blob/c7d0f51b8ec59531332d05fb27a5b758a7a3d689/logo/dotnet-logo.svg) | [`CC0-1.0`](https://creativecommons.org/publicdomain/zero/1.0/) | Embedded as vector-path data; color may be changed by the authored diagram. |
| JavaScript | [JS community logo](https://github.com/voodootikigod/logo.js/blob/1544bdeed6d618a6cfe4f0650d04ab8d9cfa76d9/js.svg) | [`MIT`](https://github.com/voodootikigod/logo.js/blob/1544bdeed6d618a6cfe4f0650d04ab8d9cfa76d9/LICENSE) | Embedded as vector-path data; color may be changed by the authored diagram. |
| Jenkins | [Jenkins artwork source](https://get.jenkins.io/art/) | [`CC-BY-SA-3.0`](https://creativecommons.org/licenses/by-sa/3.0/) | Embedded as vector-path data; color may be changed by the authored diagram. Jenkins retains its trademark rights. |
| Rust | [Rust project](https://www.rust-lang.org) | [`CC-BY-SA-4.0`](https://creativecommons.org/licenses/by-sa/4.0/) | Embedded as vector-path data; color may be changed by the authored diagram. See the [Rust media guide](https://www.rust-lang.org/policies/media-guide). |
| Vue.js | [Vue logo source](https://github.com/vuejs/art/blob/a1c78b74569b70a25300925b4eacfefcc143b8f6/logo.svg) | [`CC-BY-NC-SA-4.0`](https://creativecommons.org/licenses/by-nc-sa/4.0/) | Embedded as vector-path data; color may be changed by the authored diagram. The non-commercial and share-alike conditions remain applicable; see the [Vue artwork terms](https://github.com/vuejs/art/blob/a1c78b74569b70a25300925b4eacfefcc143b8f6/README.md). |

The source, guideline, and known license fields for every packaged mark are
preserved in `renderers/shared/generated-brand-marks.mjs`.

## OpenAI mark

The OpenAI vector path is recorded from the
[OpenAI brand guidelines](https://openai.com/brand/), not from Simple Icons.
Use remains subject to those current guidelines and any applicable trademark
rights. Its inclusion does not state or imply endorsement by OpenAI.

## JetBrains Mono

Delivered Archify viewer artifacts embed the JetBrains Mono variable font
subsets served by Google Fonts. For characters covered by these subsets, font
selection does not depend on a network request or a locally installed copy.
Uncovered characters (including CJK) still use the system fallback stack;
browser and operating-system rasterization can differ.
JetBrains Mono is maintained at
[github.com/JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono)
and is distributed under the SIL Open Font License 1.1. The complete license
text is preserved in `assets/JetBrainsMono-OFL.txt` in the packaged Skill and
in the font CSS carried by standalone HTML and SVG exports.

The fork also retains the original JetBrains Mono TTF assets and their OFL
license under `archify/assets/fonts/` (packaged as `assets/fonts/`).

## Pele

The explainer renders Mermaid chart fences with an unmodified subset of
[Pele 1.3.0](https://github.com/obsidianmd/pele), copyright (c) 2026 kepano,
distributed under the MIT License. The subset and its license text are in
`explainer/vendor/pele/` in the packaged Skill. Charts are rendered to static
SVG when a page is built; delivered pages contain no Pele code.


## Adapted compiler optimizations

The retained Archify 3.2.0 base keeps its original MIT grant. The lane/step
indexing changes adapted from cookingwithvlad-del’s
[PR #1106](https://github.com/tt-a1i/archify/pull/1106)
(head 3233ebcd7100bec64fb6450ed6345c78ee80153a), and the flow-validation iteration
and regression adapted from [PR #1109](https://github.com/tt-a1i/archify/pull/1109)
(head 34a4d345e159f311e272af12387cad2fe0a4d416), are Apache-2.0 portions.
Their original license and upstream attribution notice are included in
`assets/Archify-Apache-2.0.txt` and `assets/Archify-Upstream-NOTICE.txt` in the
Skill (`archify/assets/` in the repository). Those terms apply to these adapted
portions; the retained MIT grants are not replaced.

BlueboxC integrated those changes with the customized compiler and added
main-path/off-path animation and repeated-object diagnostic checks. See FORK.md
in the repository for the adaptation scope. No upstream trademark or endorsement
is granted.

## Adapted classic SVG grid correction

The CSS selector and browser regression adapted from vedantb7's
[PR #1117](https://github.com/tt-a1i/archify/pull/1117)
(head 04f5725555194b47668510a97fc251d4c0098818) are Apache-2.0 portions.
BlueboxC extended the browser controls to auto/light/dark variants, decoded
PNGs and the editorial preset. The retained base remains MIT; the complete
upstream license and notice remain in `assets/Archify-Apache-2.0.txt` and
`assets/Archify-Upstream-NOTICE.txt`.

## No additional rights granted

Brand names, logos, and trademarks remain the property of their respective
owners. This notice records provenance and known terms; it does not grant rights
that Archify does not hold, and it does not state that every packaged mark has
been cleared for every commercial, promotional, or redistributive use.
