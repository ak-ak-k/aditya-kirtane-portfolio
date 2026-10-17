# Home startup and identity cleanup

Completed 16 October 2026. This focused change removes the profile-selector experience
and the obsolete second professional title. The final positioning is **Aditya Kirtane —
Angular Developer**. The approved theme, page layouts, portraits, CTAs, native actions,
animation timing, and lazy routing remain in place.

## Inspection and ownership

Before changing code, the repository-wide search found:

| Reference                        | Previous consumers                                                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Selector heading/cards           | `features/home/explorer/`, its tests, shell/Intro/Home tests, historical docs, and source asset README/JSON                                                              |
| Completed profile state          | `UiState`, Home orchestration, root visibility/focus, HomeLanding, Explorer, route-transition eligibility, and their tests; About/routing tests also prepared this state |
| Switching/current-profile labels | HomeLanding template/controller/styles/tests, historical docs, and README                                                                                                |
| Profile-dependent content        | `HOME_PROFILE_CONTENT`, the typed HomeLanding input/computeds, profile definitions/models, and selector animations                                                       |
| Previous professional title      | Shared `PORTFOLIO.headline`, About/Skills, global metadata/no-JavaScript text, source JSON/wordmark, README, and four guides                                             |

There were no legitimate independent consumers requiring profile state after removing
the selector. Selector icon paths were shared code/server/skills/download resources,
so those assets remain available to existing Home/primitives consumers.

## Current architecture

```text
Fresh load or refresh
  → Intro
  → Home

Skip Intro
  → Home immediately

Return Home during the same app instance
  → Home directly
```

Home has exactly two branches: `!introCompleted()` renders Intro; otherwise it renders
HomeLanding. `completeIntro()` remains the common entry point for Skip, successful exit,
reduced motion, and safety recovery. There is no selection input, handoff, route, or
persistence. Refresh creates fresh in-memory state and replays Intro.

The root hides navbar/cursor only during Intro on `/`. After handoff it shows the normal
shell, focuses `#home-title`, and scrolls to the top. Internal view tracking now has only
`intro` and `landing` states. Other routes retain their normal shell and destination focus.

The global transition still observes Router events, never internal Intro completion.
Its special Home eligibility check now depends only on incomplete Intro. Ordinary route
navigation, fast/lazy imports, history, cancellation/error recovery, reduced motion,
forced colors, pointer neutrality, and cleanup retain their existing behavior.

## Canonical Home

| Role                 | Current text                                                                    |
| -------------------- | ------------------------------------------------------------------------------- |
| Eyebrow              | Angular engineering                                                             |
| H1                   | Aditya Kirtane, using the existing two-line treatment                           |
| Professional title   | Angular Developer                                                               |
| Experience line      | 4+ years building scalable web, mobile, and product experiences.                |
| Engineering emphasis | Scalable frontend experiences built with Angular.                               |
| Engineering support  | Angular, TypeScript, RxJS, Signals, performance, and maintainable architecture. |

`HOME_CONTENT` is one readonly constant. HomeLanding no longer needs a profile input,
UiState injection, derived profile content/title, or a switch action. The former controls
row and its styles were removed. Existing grid gaps now separate only the surviving CTA
and résumé rows; no empty wrapper, spacer, replacement UI, or reserved control height remains.
Explore Projects, About Me, Download Resume, and the launcher navigation retain their order,
routes, and native behavior. Legitimate references to products and product experiences remain.

The shared headline updates Intro and Home together. About's portrait caption, Skills'
identity line, global description, no-JavaScript subtitle, source content JSON, source
wordmark text, README, and current documentation were aligned. Page titles retain their
existing name/section/project-specific behavior; no new SEO library or social origin was added.

## Removed and retained files

Deleted all seven implementation/test files under `src/app/features/home/explorer/`:
`explorer.ts`, `.html`, `.scss`, `.config.ts`, `explorer-effects.ts`,
`explorer-animation.ts`, and `explorer.spec.ts`.
Also deleted `core/constants/explorer-profiles.ts` and `core/models/explorer-profile.ts`.
Removed the profile ID type from `core/models/ui-state.ts` and all completed-profile
storage/actions from UiState. All remaining route/menu/cursor/Intro state is retained.

Historical `docs/explorer.md` is explicitly archived. Earlier step/QA documents preserve
their dated implementation and verification evidence with a current-flow notice. The Home,
Intro, foundation state/routing, and transition contracts describe the replacement directly.

Supplied images, portraits, covers, résumé, and reference mockups are preserved. No image was
regenerated or edited. Only text metadata changed in `src/assets/README.txt`, the content
JSON, and the unused wordmark SVG. The JSON's obsolete selector screen/profile list was
removed and Main Home added. These source reference files remain outside the production
asset copy. Existing production exclusions still prevent reference mockup requests.

## Tests and verification

All **167 tests across 24 files pass**. Removed 16 obsolete Explorer tests and six former
Home profile/null/switch cases; added one canonical Home case and one transition handoff
case. The remaining tests were updated rather than discarded:

- Intro: initial title, immediate Skip, ready/reveal/exit completion, completed-state Home,
  static reduced-motion handoff, safety, races, cancellation, and destruction.
- App: navbar visibility before/after handoff, top reset, Home H1 focus, automatic completion,
  return Home, destination focus, current-route skip, and decorative transition behavior.
- Home: exact canonical content, absence of removed UI/title, unchanged links/portrait/PDF,
  reduced-motion readability, animation scope, and cleanup.
- UiState/About/routing: no profile preparation; Intro completion and existing route/transient
  state behavior remain correct. All primary-route and six detail renders reject the old title.
- Transitions: internal completion performs no sweep; subsequent ordinary Home navigation
  works without profile state. Other lifecycle/error/history tests remain intact.

Production build, strict application/test type checks, Prettier, and `git diff --check` pass.
The Angular MCP task runner could not execute targets under this session's tool approval
policy; the existing installed Node 24.21.0/npm 11.19.0 ran the actual npm scripts with a
temporary process-local PATH instead. No dependency or machine configuration was changed.

| Production viewport | Normal | Reduced |
| ------------------- | ------ | ------- |
| 320×740             | Pass   | Pass    |
| 390×844             | Pass   | Pass    |
| 768×1024            | Pass   | Pass    |
| 1440×900            | Pass   | Pass    |

All eight browser configurations verified keyboard Skip, automatic completion, refresh,
Home → About → Experience → Skills → Projects → SlingSip → Ready Inventory → Contact → Home,
and Back/Forward. A mutation observer found no selector markup even briefly. Internal
handoffs produced zero global sweeps; navigation focus, active shell, top reset, menu,
desktop VIEW cursor, mobile/reduced cursor exclusion, canonical copy, CTA paths, portrait
crop, and reduced-motion content passed. There was no horizontal overflow.

**66 AXE audits passed with zero violations**, covering Home/all primary pages/two details
in all eight configurations plus 200% Home text at 320 and 1440 px. Enlarged Intro geometry
also passed. Desktop/mobile/200% Home screenshots were inspected for balance, CTA spacing,
crop safety, and reachable controls; keyboard focus indicators remain visible.

Final browser checks produced zero unexpected console errors/warnings or missing requests.
Fresh Home requested no project covers, résumé, reference mockups, or selector-only resources.
The same approved portrait URL is reused by Intro/Home. No-JavaScript fallback branding
was checked. Production HTML/JS contains none of the removed selector IDs, component,
profile state, switching labels, or obsolete second title.

Initial bundle is **278.79 kB** (estimated transfer **77.12 kB**), down from 280.93 kB.
The lazy Home chunk is **19.75 kB**, down from 33.89 kB. Existing budgets and all other
asset/motion contracts are unchanged. Verification tooling/screenshots remain outside the
repository in the existing temporary `ak-portfolio-foundation-checks/home-cleanup` directory.

## Final search and requested report

| #   | Item                          | Result                                                                                                                                           |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Old flow                      | Intro → selector → chosen profile → Home                                                                                                         |
| 2   | New flow                      | Intro → canonical Home, including Skip and reduced motion                                                                                        |
| 3   | Explorer files                | Nine dead source/test/model/config files deleted; guide archived                                                                                 |
| 4   | Profile state                 | Removed; no independent consumers remained                                                                                                       |
| 5   | Profile-aware Home            | Removed input, computed content/title, four variations; one constant remains                                                                     |
| 6   | Switch/current-profile UI     | Removed markup, action, labels, and styles; no replacement space/UI                                                                              |
| 7   | Obsolete professional title   | Removed 12 prior text occurrences across 11 source/config/README/guide files                                                                     |
| 8   | Intro text                    | Angular Developer through the shared headline                                                                                                    |
| 9   | Home text                     | Canonical requested copy and existing CTAs                                                                                                       |
| 10  | SEO/meta                      | Accurate global description/fallback; existing route titles preserved                                                                            |
| 11  | Route transitions             | Only obsolete profile eligibility removed; internal handoff remains sweep-free                                                                   |
| 12  | Focus                         | Home H1/top reset directly after Intro; normal destination focus retained                                                                        |
| 13  | Tests                         | Obsolete selection cases removed; direct-handoff/canonical/regression coverage added or updated                                                  |
| 14  | Dead code                     | Selector effects/animations, models/constants, state/actions, branches, CSS removed                                                              |
| 15  | Build                         | Pass within unchanged budgets                                                                                                                    |
| 16  | Typecheck                     | Pass for strict app and test configs                                                                                                             |
| 17  | Tests                         | 167/167 pass, 24 files                                                                                                                           |
| 18  | Browser                       | Eight configurations pass; 66 AXE audits, zero violations                                                                                        |
| 19  | Reduced motion                | Direct static-path handoff; no selector flash, sweep, or cursor                                                                                  |
| 20  | Intentional remaining matches | Historical/archived selector documentation, negative test assertions, and original reference filenames; no unintended production-visible matches |

The literal old title remains only in negative regression assertions, not published
content, metadata, source branding/config, README, or guides. Archived selector terms
describe historical work rather than an active feature. Binary source mockups may depict
the earlier design; they remain excluded from production. No feature, route, persistence,
dependency, video, commit, push, or deployment was added. This cleanup is complete.
