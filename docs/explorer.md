# Who's Exploring — Step 4

> Archived Step 4 design: the selector and its production code were removed on 16 October 2026. Current startup is **Intro → Home**. This document preserves historical implementation/verification notes; see [home-cleanup.md](home-cleanup.md).

Step 4 implements profile selection. Its original temporary handoff is now replaced
by [Step 5's Main Home and profile switching](home.md). The approved foundation,
design system, cinematic intro, and selection implementation remain in place.

## Structure and Home flow

Home has three views without adding routes:

1. `introCompleted() === false`: the existing Intro.
2. Intro complete and `selectedProfile() === null`: Explorer.
3. Completed choice: Step 5's profile-aware Main Home, replacing the temporary
   **{Profile title} selected.** handoff used to verify Step 4.

Explorer is one component with minimal AK/name branding, a real HTML heading,
supporting copy, four native card buttons rendered with `@for`, and a decorative
footer. The existing shell navigation is hidden during Intro/Explorer and returns
for Main Home. Other routes and the development preview retain their normal shell.

## Typed profile definitions

`ExplorerProfile` already defines the stable IDs in the foundation model.
`ExplorerProfileDefinition` types each title, description, verified icon path,
visual theme, and decorative labels. `EXPLORER_PROFILES` is the readonly config.

| ID                   | Title              | Description                                                             | Icon / treatment                                                         |
| -------------------- | ------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `angular-engineer`   | Angular Engineer   | Crafting scalable, high-performance web experiences with Angular.       | `code.svg`; red backdrop, component/signals/performance labels           |
| `full-stack-builder` | Full Stack Builder | Bridging frontend, backend, APIs and data to build end-to-end products. | `server.svg`; grayscale, layered frontend/API/data labels                |
| `product-thinker`    | Product Thinker    | Turning user needs and real problems into meaningful digital products.  | `skills.svg`; closer crop, idea/build/growth labels                      |
| `resume-viewer`      | Resume Viewer      | Explore my experience, skills, impact and professional journey.         | `download.svg`; cleaner portrait, framed experience/skills/impact labels |

The supplied pack has code/server/skills/download motifs rather than an Angular
shield or lightbulb. Those existing icons distinguish roles without adding a
library or inventing a logo. Resume Viewer selects a profile and never downloads
or opens a document.

## Assets and visuals

All paths below are under `/assets/`:

| Asset                                  | Size                  | Use                                            |
| -------------------------------------- | --------------------- | ---------------------------------------------- |
| `images/aditya/portrait-headshot.webp` | 46,670 bytes          | Same portrait for all four cards and the intro |
| `branding/ak-logo-mark.svg`            | 386 bytes             | Supplied AK mark                               |
| `textures/smoke-red.svg`               | 726 bytes             | One static atmosphere layer                    |
| `icons/ui/code.svg`                    | 232 bytes             | Angular role                                   |
| `icons/ui/server.svg`                  | 287 bytes             | Full-stack role                                |
| `icons/ui/skills.svg`                  | 242 bytes             | Product role                                   |
| `icons/ui/download.svg`                | 226 bytes             | Resume role                                    |
| `icons/ui/arrow.svg`                   | Existing supplied SVG | Decorative CTA arrow                           |

The screen reuses `.card`, `.card--interactive`, portrait/icon/background primitives,
semantic colors, spacing, and typography. Near-black, a CSS red radial glow, and
one static smoke layer provide atmosphere. Grayscale, brightness, a red backdrop,
and a closer product crop vary the same photograph. No pose or gesture is fabricated.
The approved sunglasses/white-red shirt head-and-chest source contains no lower body.

Images use `NgOptimizedImage`; each portrait fills a reserved square frame with
`object-fit: cover` and top positioning. Identical URLs reuse the browser cache,
including the intro resource; offscreen portraits retain lazy loading. Icon paths
are a closed typed set of local constants, used as CSS masks. The reference PNG
is visual direction only and is never requested. Asset files are unchanged.

## Motion and selection timing

The existing `createMotionContext()` owns preference detection and GSAP cleanup.
`EXPLORER_EFFECTS` exposes the motion boundary for supported Angular TestBed
replacement, following the intro's approach. It introduces no state service.

Entrance lasts about 1.1 seconds: heading opacity/y18 reveal over 0.45 s; cards
start at 0.2 s, revealing from opacity 0, y48, scale 0.96 over 0.6 s with 0.1 s
stagger. Easing has no bounce or elastic motion.

Fine-pointer hover with no reduced-motion preference adds an 8 px lift, 1.025 card
scale, brighter border/small glow, 1.04 portrait scale, and 4 px arrow movement.
The closer product crop has an equivalent small increase. Touch has no hover lift.
Pointer tilt was omitted.

Selection first sets local `pendingSelection`, guards every further activation,
and communicates the lock with `aria-disabled`. The chosen panel scales to 1.045
with y-6, glow, and one light sweep. Others move 12 px, scale to 0.97, and fade
slightly to 0.78 so copy remains readable. At approximately 650 ms, completion calls
the existing `UiState.selectProfile(id)`. Early selection stops entrance and restores
panels to a visible baseline. A 1.2 s safety bound releases an interrupted callback;
normal behavior commits on animation completion.

`UiState.selectedProfile` is the sole completed-choice source of truth. Home changes
only after it updates. Late callbacks cannot overwrite an external completed choice.
Navigation retains the choice in the current app instance; refresh resets it.
Step 4 adds no persistence. Step 5's Switch Profile calls the same existing API
with `null`, preserving intro completion and returning to this selector.

Destruction clears the safety timer and reverts only this GSAP context. Late callbacks
cannot mutate state. Click-created timelines are explicitly added to that context.
There are no global GSAP operations, ScrollTriggers, Flip use, continuous particles,
pointer RAF loop, video, WebGL, backdrop blur, or new packages.

## Reduced motion and accessibility

Base styles show all cards completely. Reduced motion skips entrance/selection
timelines and commits immediately without waiting for an animation callback.
Hover translations/scales are disabled; static crop/color treatments remain static.
Enabling reduced motion mid-selection reverts the context and commits the pending
choice. Later preference changes never replay entrance.

Each card is one native `button type="button"` without nested controls. Its
accessible name comes from the visible title and short description. Decorative
portraits, labels, indices, icons, arrows, and CTA copy are `aria-hidden`.
Explicit title-only ARIA naming was removed after AXE found a label/name mismatch;
native content naming preserves the meaningful visible copy.

Tab visits all cards in reading order; Enter/Space activate them. The design system
provides a visible 2 px focus outline. There is no focus trap or roving tabindex.
The existing shell focuses the Explorer H1 after intro completion and the handoff
H1 after selection (now Main Home). A single short status announces the pending choice. Existing
forced-color and reduced-motion rules apply.

## Responsive behavior

One column below 48rem, two from 48rem, and four from 75rem. Portraits reserve their
dimensions and content wraps/grows naturally. At 320 px all choices appear in a
vertically scrollable single column with readable copy and reachable controls.
There is no horizontal carousel or page overflow.

## Files created

- `src/app/core/models/explorer-profile.ts`
- `src/app/core/constants/explorer-profiles.ts`
- `src/app/features/home/explorer/explorer.ts`, `explorer.html`, `explorer.scss`, `explorer.config.ts`
- `src/app/features/home/explorer/explorer-animation.ts`, `explorer-effects.ts`, `explorer.spec.ts`
- `docs/explorer.md`

## Files modified

- `src/app/features/home/home.ts`, `home.html`: three-state orchestration/handoff.
- `src/app/app.ts`, `app.html`, `app.scss`: full-width selector, shell visibility/focus.
- `src/app/app.spec.ts`, `app.routes.spec.ts`: handoff and shell integration checks.
- `src/app/features/home/intro/intro.spec.ts`: post-intro expectations only.
- `README.md`, `docs/foundation.md`, `docs/design-system.md`, `docs/intro.md`: status/links.

UiState implementation, routes, intro implementation, animation helpers, global
primitives, package manifests, and supplied assets are unchanged by Step 4.
All working changes from Steps 1–3 are preserved.

## Verification

```bash
npm run build
npm run typecheck
npm run test:ci
```

Sixteen new Explorer tests cover the four definitions/choices, post-intro visibility,
native controls, approved shared portrait, delayed commit, competing activation,
reduced motion, Resume Viewer's selection-only behavior, handoff, external choice
preservation, safety fallback, live preferences, and late callback/timer cleanup.
One new shell test checks navigation restoration/focus; intro/route tests are updated.
Tests use lifecycle completion rather than exact animation milliseconds.

Browser checks use the temporary Playwright/axe-core installation from earlier steps,
outside the project. All 12 final Explorer AXE audits passed (development and production;
1440×900, 768×1024, 320×740; both motion preferences), with zero violations.
All 24 production profile choices passed through
native Enter/Space, including visible focus rings and handoff focus. Hover and 320 px
touch behavior, early/competing clicks, live preference changes, navigation cancellation,
return visits, and refresh/reset passed. Shared resource checks confirmed at most one
portrait transfer per fresh context, and delayed portrait loading caused zero layout
shift with unchanged image frames. No console errors/warnings, missing assets, downloads,
forbidden project/reference/resume requests, clipped copy, or horizontal overflow
were observed. Desktop/tablet/mobile screenshots were inspected for crop safety and
composition.

The production build passed within the unchanged initial/component-style budgets
without budget warnings: 269.25 kB initial, approximately 72.50 kB estimated transfer.
Home/GSAP remain lazy. All 55 tests across seven files passed. Strict app/test type
checks, formatting for Step 4 and existing app/style/documentation files, and
`git diff --check` passed. A broader repository formatting check also identified
pre-existing formatting differences in the untouched `src/main.ts`, supplied
`assets/content/portfolio-content.json`, and supplied CSS/JSON token files; those
files were preserved.

Production checks also passed automatic intro-to-Explorer completion with both motion
preferences, the no-JavaScript fallback, preview bundle exclusion, and the production
`/design-system` redirect home. The development preview retains its normal navigation,
and the running development server remains available at `http://localhost:4300/`.
Final development checks reconfirmed image frame dimensions, crop positioning, resource
reuse, keyboard focus, and absence of Angular image warnings.

## Step 5 integration

Review `http://localhost:4300/`: Skip Intro to reach the selector; refresh to reset
the in-memory choice. Step 5 now renders Main Home after selection and provides a
Switch Profile button that returns here without replaying Intro. The Explorer
implementation and selection timing are unchanged; integration tests now expect
Main Home. See [home.md](home.md). Step 6 adds [The Full Story](about.md), without
changing Explorer or profile state. Step 7 adds [Top Moments](experience.md), also
preserving that state. Step 8 adds [My Skill Universe](skills.md) without changing
Explorer. The [project showcase](projects.md) and [case studies](project-details.md)
also preserve Explorer state. Step 11 adds [Contact](contact.md) and
[route transitions](route-transitions.md), without animating internal profile changes.
Final production QA is recorded in [final-qa.md](final-qa.md).
