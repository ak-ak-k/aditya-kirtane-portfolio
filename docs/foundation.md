# Portfolio foundation — Step 1

> Current production startup is **Intro → Home** (16 October 2026). Profile-selector/state references below describe the earlier implementation or its dated QA. See [home-cleanup.md](home-cleanup.md) for the replacement and current verification.

Step 1 architecture is implemented and preserved. The navigation and route placeholders
exist to verify architecture; they are not the portfolio design. Step 2 now adds the
reusable visual language and a development-only preview; see [design-system.md](design-system.md).
Step 3 uses this foundation for the [home intro](intro.md). Step 4 adds the
[Who's Exploring selector and temporary profile handoff](explorer.md).
Step 5 replaces that handoff with the [Main Home, navbar, and cursor](home.md).
Step 6 replaces the About placeholder with [The Full Story](about.md), using the
existing lazy route and scoped ScrollTrigger infrastructure.
Step 7 replaces the Experience placeholder with [Top Moments](experience.md),
preserving the route, state, and motion contracts. Step 8 replaces Skills with
[My Skill Universe](skills.md) using those same contracts. The [project showcase](projects.md)
and [reusable detail pages](project-details.md) now use the existing lazy routes.
The detail guide records content evidence limits. Step 11 adds [Contact](contact.md)
and [global route transitions](route-transitions.md), preserving these contracts.
Final production QA is recorded in [final-qa.md](final-qa.md).

## Project inspection

| Area             | Existing project                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Angular          | Framework and CLI installed at 22.2.2; framework declared as `^22.1.0`, CLI/build as `^22.1.8`               |
| Bootstrap        | Standalone `bootstrapApplication`, `app.config.ts`; no NgModules                                             |
| Change detection | Angular 22 default OnPush and zoneless behavior; no Zone.js dependency                                       |
| Routing          | Router installed/provided, but routes empty                                                                  |
| Styles           | SCSS for components and global styles; generated Angular welcome template                                    |
| TypeScript       | 6.0.3 installed, ES2022 target, isolated modules; strict and strict template checking not explicitly enabled |
| Dependencies     | Angular Common/Core/Compiler/Forms/Platform Browser/Router, RxJS 7.8.2, tslib; no animation or UI libraries  |
| Tests/tooling    | Angular unit-test builder, Vitest 4.1.11, jsdom 28.1.0, Prettier 3.9.10; no lint or e2e target               |
| SSR              | Disabled; browser entry only, no server entry or SSR package                                                 |
| Assets           | `public/favicon.ico` configured; supplied `src/assets` pack present but not copied by the builder            |
| Source structure | Root component, app config, empty routes, starter test; no features or shared infrastructure                 |

The app sources, package manifest/lockfile, Angular/TypeScript configuration, public
folder, asset inventory/tokens/content map, formatter/editor configuration, and IDE
task/MCP settings were inspected. The existing asset pack was untracked when work began
and is preserved without modifying its files.

## Dependencies and defaults

Added only `gsap@^3.15.0` as an application dependency. ScrollTrigger and Flip are
included in that package, as are the TypeScript definitions. No separate GSAP typings,
NgRx, UI libraries, Three.js, or other animation frameworks are needed.

Angular 22 components are standalone and OnPush by default. Decorators intentionally
omit both `standalone: true` and an explicit OnPush setting, following `AGENTS.md`.
The UI state service uses Angular 22's `@Service()`, which provides a root singleton
without a separate `providedIn` option. Dependencies use `inject()`.

Strict TypeScript, strict templates, and unused local/parameter checks are enabled.
Existing Angular versions, production budgets, and the browser-only build are retained.

## Folder structure

```text
src/
├── app/
│   ├── core/
│   │   ├── constants/portfolio.ts
│   │   ├── models/ui-state.ts
│   │   └── services/ui-state.ts (+ spec)
│   ├── shared/
│   │   ├── components/route-placeholder/route-placeholder.ts
│   │   ├── directives/.gitkeep
│   │   ├── pipes/.gitkeep
│   │   └── utilities/.gitkeep
│   ├── layout/
│   │   ├── navbar/navbar.ts + navbar.scss
│   │   ├── cursor/.gitkeep
│   │   └── page-transition/.gitkeep
│   ├── features/
│   │   ├── home/home.ts
│   │   ├── about/about.ts
│   │   ├── experience/experience.ts
│   │   ├── skills/skills.ts
│   │   ├── projects/
│   │   │   ├── projects.routes.ts
│   │   │   ├── project-list/project-list.ts
│   │   │   └── project-detail/project-detail.ts
│   │   └── contact/contact.ts
│   ├── data/.gitkeep
│   ├── animations/
│   │   ├── gsap.ts
│   │   ├── create-motion-context.ts
│   │   └── gsap.spec.ts
│   ├── app.ts + app.html + app.scss + app.spec.ts
│   └── app.config.ts + app.routes.ts + app.routes.spec.ts
├── assets/
│   ├── branding/
│   ├── images/aditya/
│   ├── backgrounds/
│   ├── textures/
│   ├── icons/ui/
│   ├── projects/covers/
│   ├── companies/
│   ├── resume/
│   ├── seo/
│   ├── tokens/
│   ├── content/
│   └── references/
├── styles.scss
├── index.html
└── main.ts
public/favicon.ico
docs/foundation.md
```

Empty folders have `.gitkeep` files so Git preserves the planned structure. They do not
contain premature components or services. Keep global cross-feature concerns in `core`,
small reusable UI in `shared`, shell elements in `layout`, and domain behavior in its
own feature. `data` is reserved for future typed, verified portfolio content; existing
asset JSON remains reference material rather than automatically published page content.

## Routing

| URL               | Lazy entry                         | Section    |
| ----------------- | ---------------------------------- | ---------- |
| `/`               | `Home`                             | home       |
| `/about`          | `About`                            | about      |
| `/experience`     | `Experience`                       | experience |
| `/skills`         | `Skills`                           | skills     |
| `/projects`       | `PROJECT_ROUTES` → `ProjectList`   | projects   |
| `/projects/:slug` | `PROJECT_ROUTES` → `ProjectDetail` | projects   |
| `/contact`        | `Contact`                          | contact    |
| Unknown URLs      | Redirect to `/`                    | home       |

Feature components use `loadComponent`. Projects also use `loadChildren` to keep their
route configuration isolated. No eager preloading is configured. Intro and the canonical Home are internal states
of the home feature; no additional routes are needed.

Route titles update the document title. Component input binding supplies `:slug` to a
required signal input, including when navigating between projects on the same component.
Any slug is accepted by the foundation placeholder; validating slugs and showing a real
project-not-found state belongs with the future verified project catalog.

The shell provides semantic header/nav/main elements, a skip link, active-link ARIA,
visible focus indicators, and heading focus after section/project changes. Browser
scroll restoration and anchor scrolling are enabled. Production hosting must rewrite
application routes to `index.html` for direct visits and refreshes.

## Signals state

`UiState` exposes read-only signals; consumers change state through its methods.

| State             | Source and behavior                                                  |
| ----------------- | -------------------------------------------------------------------- |
| `activeSection`   | Computed from the active route's section metadata                    |
| `selectedProject` | Computed project slug or `null`; the URL is the source of truth      |
| `introCompleted`  | `false` until `completeIntro()`                                      |
| `menuOpen`        | `setMenuOpen()` / `toggleMenu()`; closes after successful navigation |
| `cursorMode`      | `setCursorMode()`; returns to `default` after successful navigation  |

Navigation subscriptions are destroyed with the service. Intro completion remains
in memory across navigation; refresh resets it. Profile state/actions/types have
been removed. Active route, selected project, menu, cursor, and motion contracts
remain unchanged. See [home-cleanup.md](home-cleanup.md).

## Animation contract

`animations/gsap.ts` registers ScrollTrigger and exports GSAP. `loadFlip()` imports
and registers Flip only when requested. No animation code is imported by the app shell
or placeholders, keeping GSAP out of the initial foundation bundle.

Future animated features should initialize after rendering and call
`createMotionContext(element, animate)`. Register the returned cleanup with
`DestroyRef.onDestroy()`. The helper scopes animations to the feature and uses GSAP
matchMedia so animations run only with `prefers-reduced-motion: no-preference`.
Changes to that preference automatically revert existing animations. Keep base styles
visible and usable so reduced-motion users see complete content. Capture `DestroyRef`
with `inject()` in an injection context before registering rendering callbacks.

Use transforms and opacity for motion, CSS transitions for simple hover states, and
scoped cleanup for ScrollTriggers/listeners. Avoid global `killAll()` cleanup, layout
animations, video backgrounds, excessive particles, or continuous work on mobile.
Global CSS also reduces CSS animation/transition duration when reduced motion is set.

## Assets and visual direction

`public` stays available at the root URL. Angular copies `src/assets` to `/assets`,
so existing files use URLs such as `assets/images/aditya/portrait-upper.webp`.
The supplied `tokens/design-tokens.css` is loaded before `src/styles.scss` and is the
source of theme colors/motion values. The shell only applies basic dark defaults;
cinematic layouts, glow, smoke, textures, glass cards, and typography are deferred.

Brand: **Aditya Kirtane — Angular Developer**.

Use only the supplied sunglasses and white/red graphic T-shirt photo, with head/chest/
upper-body crops. Never show pants or lower body. No portraits are rendered in Step 1.
Preserve the asset-pack notes: company SVGs are temporary wordmarks, and project covers
are fallback artwork, not official logos or real product screenshots. Do not invent
missing screenshots or logos.

Future static images must use `NgOptimizedImage`, with explicit dimensions or a sized
fill container to avoid layout shift. Prefer WebP/AVIF; lazy-load large project images
and reserve priority for a measured above-the-fold image. Use CSS/SVG effects and a
small number of decorative elements. Review asset sizes and exclude unused source/reference
files before publishing the final site. SSR/prerendering and complete SEO remain future
decisions; SSR has not been enabled here.

## Verification commands

```bash
npm run build
npm run typecheck
npm run test:ci
```

The production build checks Angular templates and budgets. Type checking includes app
and test code and rejects unused locals/parameters. Vitest exercises all routes and
titles, wildcard fallback, changing slug inputs, route-derived state, transient UI
reset, shell accessibility behavior, GSAP/ScrollTrigger/Flip imports, animation cleanup,
and reduced-motion behavior.

Verified after implementation:

- Production build passed within the existing budgets; feature routes are separate lazy chunks.
- Strict app/test type checking and Prettier checks passed; no whitespace errors were found.
- All 18 Vitest tests passed across four test files, including initial home heading focus.
- Browser checks in headless Microsoft Edge passed for all seven routes at desktop width
  and 320 px mobile width with reduced motion: 14 AXE audits, zero violations, and zero
  runtime errors. Checks also covered direct visits, active links, titles, heading focus,
  client navigation, browser back, wildcard fallback, keyboard skip navigation, and asset URLs.
- Playwright and axe-core were installed only in a temporary verification directory;
  GSAP is the only dependency added to this repository.

## File changes

Created the `core`, `shared`, `layout`, `features`, `data`, and `animations` files shown
above, route/state/GSAP specs, and this document. Modified `README.md`, `package.json`,
`package-lock.json`, `angular.json`, `tsconfig.json`, `src/index.html`, `src/styles.scss`,
and the existing app component/template/styles/config/routes/spec. The entry point,
app/spec TypeScript configs, IDE settings, public favicon, and asset-pack files are
unchanged.

Before building the portfolio experiences, confirm profile/intro interaction requirements
and the content that can be published. Real screenshots and official company logos can
replace the supplied fallbacks later. The Step 2 design system does not add portfolio
screens or animations.
