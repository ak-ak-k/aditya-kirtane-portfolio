# Global route transitions — Step 11

> Current production startup is **Intro → Home** (16 October 2026). Profile-selector/state references below describe the earlier implementation or its dated QA. See [home-cleanup.md](home-cleanup.md) for the replacement and current verification.

The planned `layout/page-transition/` feature now supplies one decorative global
transition for actual client-side portfolio navigation. It does not replace route
definitions, feature entrance animations, state, focus, history, or scroll restoration.
The real [Contact page](contact.md) is the other Step 11 feature. Final QA is recorded in [final-qa.md](final-qa.md); the subsequent startup cleanup is recorded in [home-cleanup.md](home-cleanup.md).

## Ownership and router behavior

PageTransition is mounted once in the root shell, outside the Home visibility blocks.
Its host uses display: contents and its overlay is fixed, so it contributes no layout
space. A layout-local Router subscription and one active signal handle transitions;
ordinary private fields track the current navigation ID, phase, generation, animator,
and safety timer. No new singleton service or state manager is needed.

Eligible paths are `/`, `/about`, `/experience`, `/skills`, `/projects`,
`/projects/:slug`, and `/contact`. First direct navigation is skipped. Same-path
query/fragment changes and the development-only preview are skipped. Entering or leaving Home while Intro is incomplete is skipped. Intro → Home
is an internal same-route state change and never starts this layer. Once Intro
is complete, ordinary Home navigation uses the existing transition behavior.

NavigationStart resets old owned work, checks eligibility/motion preference, marks
the layer active, resets the existing cursor mode to default, and loads the animator
if needed. NavigationEnd updates the current path and finishes the matching sweep.
The Router never waits for GSAP. Fast completed navigations are supported even when
the dynamic import has not resolved; a generation check rejects stale imports.
Subsequent navigation supersedes the previous animation.

NavigationCancel, NavigationError, and NavigationSkipped reset matching active work.
Events from superseded navigation cannot cancel the latest sweep. A 1.5-second
watchdog also clears decoration if completion never arrives. DestroyRef unsubscribes,
removes media listeners, clears the timer, invalidates imports, and destroys owned
animation. The overlay is always pointer-transparent, so even a pending route or
animation failure cannot create a pointer blocker or keyboard trap.

## Visual treatment and motion

The animator is a separate lazy module using the existing GSAP runtime. It creates
no ScrollTriggers, persistent RAF loop, global kill, blur, filter, layout animation,
scroll animation, or full red screen. One low-opacity dark veil and one 2 px red edge
animate only opacity and transforms.

Entrance uses about 0.2 seconds; the finish sweep takes about 0.35 seconds. They can
overlap as Router navigation completes, producing roughly 350–550 ms of visual motion
without delaying destination rendering. The finish phase explicitly makes the edge
visible and starts a faint 8% veil fade, so cached routes still show the intended
brief treatment instead of finishing before the entrance has painted. Longer route
loading is not artificially extended; the safety timer prevents lingering decoration.

Existing page entrances retain sole ownership of their content transforms. The
global layer animates only its own spans, avoiding competing content animations.
Its GSAP context can be reset/restarted; completion, cancellation, preference
changes, and destruction restore styles. Unrelated feature triggers/tweens remain intact.

Reduced motion bypasses the animator entirely and resets any active sweep. Forced
colors also bypass it. CSS hides the overlay in both cases as a final safeguard.
Feature reduced-motion behavior is unchanged.

## Focus, history, cursor, and navigation polish

The overlay is aria-hidden, has no controls/tabindex/live region, and never receives
or moves focus. The existing shell still focuses destination H1, including on reused
ProjectDetail slug changes. Browser Back/Forward and Angular scroll restoration
remain unchanged. Known and unknown project destinations work through the existing
catalog/detail implementation.

The existing cursor returns to default at transition start; its existing Router
reset and pointer tracking restore normal modes afterward. OPEN and VIEW are reused;
no cursor architecture or navbar code is changed.

Keyboard verification found the old native `href="#main-content"` resolved against
the root base URL on inner pages. The skip link now uses RouterLink with empty
commands, preserves query parameters, targets `main-content`, and explicitly focuses
main without forcing a scroll position. Angular's existing anchor scrolling handles
the fragment. This keeps skip navigation on the current page rather than returning
Home; fragment-only navigation still bypasses the sweep.

## Files

Created under `src/app/layout/page-transition/`:

- `page-transition.ts`
- `page-transition.html`
- `page-transition.scss`
- `page-transition-effects.ts`
- `page-transition-animation.ts`
- `page-transition.spec.ts`
- `page-transition-animation.spec.ts`

Modified `src/app/app.ts` and `app.html` to mount the layer and correct skip navigation;
`app.spec.ts` adds destination/slug focus and inner-route skip regression coverage.
`app.routes.spec.ts` changes only the expected Contact heading. Created this guide
and [contact.md](contact.md); README and preceding integration notes reflect Step 11.
All prior working changes remain preserved. No app routing definition/provider,
package, supplied asset, shared state, navbar, cursor, or global stylesheet is modified.

## Historical Step 11 verification (before startup cleanup)

Production build passed within unchanged budgets, without warnings: 280.39 kB
initial (approximately 77.66 kB estimated transfer), 8.53 kB lazy Contact chunk,
and a separate 657-byte lazy transition animator. Strict application/test type
checks, changed-file/documentation Prettier, and `git diff --check` pass.

All 187 tests across 25 files pass, including 30 new cases: nine Contact component
tests, one real Contact animation test, 17 transition-state/lifecycle tests, one
real sweep-animation test, and two shell focus/skip regressions. Tests cover direct
load, ordinary and fast/lazy navigation, reduced/forced-color eligibility,
cancel/error/skipped events, outdated imports/cancellations, import failure, live
preference changes, same-path query/fragment navigation, internal Home state,
popstate, project slug reuse, focus neutrality, destruction, and safety-timeout
recovery. Real GSAP tests verify repeatable contexts, visible fast-route finish,
unrelated animation preservation, style restoration, no late writes, and no
new ScrollTriggers. Tests avoid exact-duration assertions.

Development and production each passed six Contact width/motion configurations:
1440×900, 768×1024, 320×740, with normal and reduced motion. Each environment also
passed four navigation flows (desktop/mobile × both motion preferences) covering:
Home → About → Experience → Skills → Projects → SlingSip → Ready Inventory →
Contact → Home, browser Back/Forward, rapid navigation, and a live preference change.
Switch Profile and Intro/Explorer/Main Home handoffs produced no global sweep.
Destination focus, active nav, project title/data, profile retention, and route
completion remained correct; no normal sweep lingered until the watchdog.

All 70 AXE audits passed with zero violations: per environment, six Contact,
four open-menu, one Contact 320 px / 200% text, and 24 representative Home/About/
Experience/Skills/Projects/Detail regression audits. Contact's long values, safe
portrait, 44 px targets, real PDF download, keyboard focus, and OPEN cursor were
verified. A delayed portrait kept the same frame and produced zero image-driven CLS.

Additional checks passed for direct detail loading without a sweep, unknown-project
return navigation, current-route fragment skip, forced-color bypass, stable main
geometry, and zero post-paint layout shift caused by the fixed transition layer.
Final checks had no console warnings/errors, missing assets, unintended downloads,
horizontal overflow, stuck overlay, focus loss, or route race. Screenshots of
desktop/tablet/mobile Contact, 200% text, and an active route sweep were inspected.
The development style preview remains excluded from production bundles.

Browser tooling remained in the existing temporary Playwright/axe-core directory,
with no repository dependency added. The verification server remains available at
`http://localhost:4300/contact`.

## Before Step 12

Review the normal-motion route sweep, speed, destination entrance, Contact composition,
and keyboard skip behavior. The existing SlingSip/CollabSpace documentation limitations
remain unchanged and are outside this step. Final production QA is recorded in [final-qa.md](final-qa.md).
