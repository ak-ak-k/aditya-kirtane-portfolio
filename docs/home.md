# Main Home, navbar, and cursor — Step 5

> Current production startup is **Intro → Home** (16 October 2026). Profile-selector/state references below describe the earlier implementation or its dated QA. See [home-cleanup.md](home-cleanup.md) for the replacement and current verification.

The canonical Home follows Intro directly. It keeps the approved hero, portrait,
CTAs, launcher navigation, navbar, cursor, tokens, and scoped entrance.

## Current Home content

Home renders Intro while `introCompleted()` is false and `HomeLanding` otherwise.
The landing component uses `HOME_CONTENT`; it has no profile input or derived state.
Identity is **Aditya Kirtane — Angular Developer**. Its eyebrow is Angular engineering,
with the existing 4+ years supporting line and Angular frontend emphasis.
Explore Projects, About Me, and Download Resume retain their routes and order.
The selector, selection labels, and switch action have been removed without replacement UI.
Completion remains in memory across navigation; refresh replays Intro.

## Hero composition and assets

Desktop uses a spacious copy/portrait split. At 768 px it uses a balanced narrower
split; below 48rem it becomes a single column with stacked CTAs. Launcher columns
are one below 48rem, two from 48rem, and five from 75rem. All content wraps, and the
document scrolls vertically on small screens instead of clipping controls.

| Asset under `/assets/`                                          | Use                                                                           |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `images/aditya/portrait-headshot.webp`                          | One real 511×553, 46,670-byte head/chest portrait, shared with Intro/Explorer |
| `branding/ak-logo-mark.svg`                                     | Navbar brand, with `NgOptimizedImage` and nearby text                         |
| `textures/red-halo.svg`                                         | One restrained halo behind the hero                                           |
| `icons/ui/user.svg`, `server.svg`, `skills.svg`, `projects.svg` | Launcher roles                                                                |
| `icons/ui/arrow.svg`, `download.svg`                            | CTA and download motifs                                                       |
| `resume/aditya-kirtane-resume.pdf`                              | Real 120,418-byte resume download                                             |

The hero combines the existing dark background, CSS radial red glow, and one halo.
There is no collage, ghost duplicate, smoke stack, video, canvas, WebGL, or large blur.
The portrait uses `NgOptimizedImage` fill/priority in a reserved square frame, with
the approved `.portrait--hero` fade, top positioning, and `object-fit: cover`.
The actual sunglasses/white-red shirt source contains no lower body. CSS color/fade
treatment does not fabricate a pose or modify the asset.

Both supplied PDFs (`Aditya_Resume.pdf` and `aditya-kirtane-resume.pdf`) are present
and have the same SHA-256 hash. The lowercase named file is the single live path.
Hero/launcher download anchors use a real `href` and `download` filename.
The résumé is never automatically requested or downloaded. No fake handler exists.

## Home entrance and scroll

`HOME_LANDING_EFFECTS` exposes the GSAP boundary to TestBed, following the existing
Intro pattern. `createMotionContext()` scopes the entrance and reverts it on
destroy or a reduced-motion change. The sequence lasts approximately 1.39 seconds:

- Halo fades from 0 s over 0.6 s.
- Portrait reveals from 0.1 s over 0.7 s, with y20 and scale 1.03→1.
- Copy groups reveal from 0.15 s over 0.5 s with a 0.07 s stagger and y16.
- Actions reveal from 0.55 s over 0.45 s with y12.
- Launchers reveal from 0.75 s over 0.4 s with a 0.06 s stagger and y16.

Only opacity/transforms animate, with restrained easing and no letter splitting,
bounce, ScrollTrigger use, or Flip use. Base styles remain completely visible.

Internal Home views share a URL, so route scroll restoration cannot handle them.
The shell scrolls instantly to the top when Intro hands off to Home, then focuses
the Home H1. Normal route scroll restoration remains in place.

## Navbar and mobile navigation

The shell shows the production navbar on Main Home and all normal routes, while
keeping it hidden during Intro. The development preview retains its normal
shell behavior. The header is sticky at the top, with an opaque-enough translucent
dark base and subtle border. No backdrop filter is required.

There is one semantic Primary navigation, containing the six existing routes and
Let’s Connect → `/contact`. `RouterLinkActive` supplies the active class and
`aria-current="page"`; a CSS underline and accent text identify the current route.
The underline scales smoothly where motion is permitted and is not color alone.

A passive native scroll listener changes only a boolean at the 24 px threshold.
It strengthens the background/border without continuous animation or layout reads.
The listener is removed on destroy.

Below 64rem, a native Menu/Close menu button exposes `aria-expanded` and
`aria-controls="primary-navigation"`. It opens an expanding non-modal panel in
normal flow, with bounded internal scrolling when necessary. Hidden links are
removed from keyboard navigation by `display: none`. The toggle keeps focus on
opening; Tab moves naturally into the links. Escape from the header closes the
panel and focuses the toggle. Moving keyboard focus outside the header also closes
the panel, keeping the next focused control unobscured. There is no trap, checkbox
hack, or body scroll lock. The panel reserves a text-relative viewport allowance
for branding/toggle rows, supporting enlarged text without clipping the last CTA.

Successful navigation closes the existing `UiState.menuOpen` signal and the shell
focuses the destination H1. Browser navigation therefore cannot retain stale state.
Resizing to desktop and destroying the navbar also clear mobile menu state. The
media-query listener is removed on destroy.

## Custom cursor

Cursor is a layout enhancement available only with:

```text
(min-width: 64rem) and (hover: hover) and (pointer: fine)
and (prefers-reduced-motion: no-preference)
```

Touch-capable environments are additionally excluded. The enhancement is mounted
with the normal shell, so Intro retains its approved behavior. Native
cursors are always preserved, including initialization failure. There is no
`cursor: none` rule.

A 4 px accent dot tracks closely using GSAP quick setters. A thin 32 px ring trails
using reusable `quickTo` transform tweens with a 0.16 s duration. Tracking imports
lazily only after eligibility is established. Native pointer listeners run outside
Angular; pointer movement does not update Signals or trigger per-frame template work.
There is no custom idle RAF loop.

The existing shared modes keep their IDs: `default`, `pointer` (ordinary interactive
controls), and `project` (VIEW for the Projects CTA/launcher). One `open` mode is added
for deliberate download links. Pointer boundary events update mode; disabled
controls use the default. The cursor hides on keyboard input, window exit/blur, and
touch events. Both layers are `aria-hidden`, non-selectable, and ignore pointer events.
The ring stays transparent; the small VIEW/OPEN label sits below it so button text
remains readable. The ring/labels never replace native click or focus behavior.

Preference/viewport changes stop listeners and revert the scoped GSAP context.
Destruction removes pointer, keyboard, blur, and media-query listeners and prevents
late lazy-import results from restarting tracking. CSS also hides the enhancement
for reduced motion, coarse pointers, mobile, and forced-color mode.

## Accessibility and reduced motion

Home has one semantic H1, a meaningful portrait alt, hidden decoration, native
links/buttons, and logical navigation/heading order. Download links identify PDF
content. Focus indicators and 44 px control sizing come from the approved primitives.
Navbar active state has both underline and color. Native text selection remains usable.

Reduced motion leaves Home fully visible, skips the hero entrance, disables cursor
tracking, and removes launcher lift through existing global rules. Navbar, mobile
menu, downloads, route navigation, remain functional.

## Historical Step 5 files created

- `src/app/features/home/home-landing/home-landing.ts`, `.html`, `.scss`
- `src/app/features/home/home-landing/home-landing.config.ts`, `home-landing-animation.ts`, `home-landing-effects.ts`, `home-landing.spec.ts`
- `src/app/layout/navbar/navbar.html`, `navbar.spec.ts`
- `src/app/layout/cursor/cursor.ts`, `cursor.scss`, `cursor-effects.ts`, `cursor-tracking.ts`, `cursor.spec.ts`, `cursor-tracking.spec.ts`
- `docs/home.md`

## Historical Step 5 files modified

- `src/app/features/home/home.ts`, `home.html`
- `src/app/layout/navbar/navbar.ts`, `navbar.scss`
- `src/app/core/models/ui-state.ts`: adds only the `open` cursor mode
- `src/app/app.ts`, `app.html`, `app.scss`, `app.spec.ts`
- `src/app/app.routes.spec.ts`, `src/app/features/home/explorer/explorer.spec.ts`: replaces temporary handoff expectations
- `README.md`, `docs/foundation.md`, `docs/design-system.md`, `docs/intro.md`, `docs/explorer.md`: current integration notes

UiState implementation, Intro/Explorer implementation, shared motion helpers,
route definitions, later feature placeholders, design primitives, assets, and
dependency manifests are preserved. No packages are added.

## Historical Step 5 verification

```bash
npm run build
npm run typecheck
npm run test:ci
```

Thirty new tests cover Home’s four perspectives, null-profile visibility,
switching without Intro replay, native launchers/verified PDF path, reduced motion,
entrance cleanup, navbar links/ARIA/active state/menu/Escape/navigation/resize/scroll
cleanup, cursor eligibility/modes/failure/late import cleanup, pointer tracking without
per-move shared state, keyboard/touch hiding, and native listener removal.
Integration tests now expect the real Home, and the shell checks internal-view scroll.
Tests do not depend on exact animation milliseconds.

The production build passed without budget warnings: 278.08 kB initial and about
74.60 kB estimated transfer. Home, GSAP, and cursor tracking remain lazy. All 85 tests
across 11 files passed. Strict application/test type checking, Prettier checks for
app/styles/documentation, and `git diff --check` passed. The four pre-existing
formatting differences recorded in Step 4's untouched entry/asset files remain outside
this step's changes.

Development browser verification covered all 24 profile/viewport/motion combinations
and 28 Home/menu AXE audits. Final production verification repeated all 24 combinations,
with 28 Home/menu AXE audits plus 14 existing-route regression audits at desktop/mobile.
All had zero violations. All four perspectives, native route navigation, active route
state, sticky/scroll navbar behavior, Escape/menu navigation/browser return/resize,
keyboard profile switching, native focus, desktop cursor modes/cleanup, touch exclusion,
and live reduced-motion changes passed. The 320 px enlarged-text check at 200% confirmed
the final menu CTA remains reachable and keyboard focus can exit without obstruction.

Both deliberate resume anchors downloaded the actual 120,418-byte PDF with a verified
PDF header and expected filename. Selection/loading never requested or downloaded it.
No future project/company/reference imagery was requested. Portrait requests reused the
cached source, and a delayed hero image produced zero image-driven layout shift with
unchanged frame dimensions. No horizontal overflow, missing assets, console errors,
or image warnings were observed. Desktop/tablet/mobile screenshots were inspected for
portrait safety, typography, composition, and menu layout. Production preview exclusion,
wildcard redirection, the development preview shell, and the no-JavaScript fallback passed.

The final development warning/AXE check passed against the completed menu styles:
six Home and four open-menu audits, with zero violations or runtime/image warnings.
Together with the 42 production audits, the final checks cover 52 AXE audits.
The running development preview remains available at `http://localhost:4300/`.

## Historical integration notes (before startup cleanup)

Review `http://localhost:4300/`: choose a profile after Intro or Skip, then inspect
the Home composition, four copy variations, mobile menu, subtle desktop cursor,
resume download, and Switch Profile. About now opens [The Full Story](about.md);
Home launchers, navbar, cursor, and state behavior are unchanged. The other feature
route Contact now opens [the real Contact page](contact.md). Step 7 opens the
[Experience timeline](experience.md) through the existing launcher/navbar links.
Step 8 opens [My Skill Universe](skills.md) through the existing Skills links.
Projects opens the [showcase](projects.md), with [case studies](project-details.md)
and documented evidence limits. Step 11 adds [route transitions](route-transitions.md)
for actual navigation, excluding Intro/Explorer/Switch Profile. Final production QA is recorded in [final-qa.md](final-qa.md).
