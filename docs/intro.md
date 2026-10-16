# Cinematic introduction — Step 3

Step 3 implements the opening/loading experience. Its original neutral handoff has
now been replaced by the approved [Step 4 Who's Exploring selector](explorer.md).
The standalone/lazy architecture, Signals store, design system, intro behavior, and
asset pack are preserved. [Step 5](home.md) now supplies the post-profile Main Home.

## Structure and visual direction

Home reads the existing `UiState.introCompleted()` signal. While false, it renders
one dedicated Intro component. Once completed, Step 4 renders **Who's Exploring?**
until a profile is selected. The production navigation returns with Step 5's Main Home.
Intro completion itself still only calls `completeIntro()`.

The intro is a full-viewport dark composition with a real AK monogram, one cropped
portrait, two HTML name groups, professional subtitle, progress track, and a subtle
Skip Intro button. Desktop/tablet use a split composition; mobile stacks a smaller
portrait above branding and text. Technical labels remain static and decorative.

The loading reference at `assets/references/01-loading-screen.png` guided the
composition. It is not displayed or downloaded by the app. Text is live HTML, the
logo is the supplied SVG, and the portrait is the actual source crop. The practical
interface uses restrained effects rather than the mockup's intense illustrated scenery.

## Assets

| Asset                                  | Size         | Use                                                 |
| -------------------------------------- | ------------ | --------------------------------------------------- |
| `images/aditya/portrait-headshot.webp` | 46,670 bytes | Only portrait; head/chest crop                      |
| `branding/ak-logo-mark.svg`            | 386 bytes    | Supplied monogram                                   |
| `textures/smoke-red.svg`               | 726 bytes    | Static, low-opacity background layer                |
| `textures/particles.svg`               | 420 bytes    | Static decorative particles, no DOM particle engine |

All paths are under `/assets/`. These assets total about 48.2 kB. The radial glow
uses the approved `.bg-red-glow` CSS utility. No noise texture, reference image,
project image, video, canvas, WebGL, new font, or additional package is loaded for
the introduction.

Both critical images use `NgOptimizedImage` with `priority` for eager/high-priority
fetching as Home renders. The portrait uses fill mode in a sized, clipped frame with
`object-fit: cover` and top positioning. Its headshot source contains no lower body.
The existing portrait fade/rim utilities are reused. Static grayscale/brightness
treatment does not modify the source file or stretch it. Image dimensions do not
alter layout after loading.

## Timeline

The existing `createMotionContext()` scopes the sequence to the component. The
timeline uses transforms and opacity; it does not animate width, top/left, blur, or
individual letters.

| Phase    | Start / duration              | Behavior                                                   |
| -------- | ----------------------------- | ---------------------------------------------------------- |
| Opening  | 0–0.3 s                       | Ambient dark/red background; Skip remains available        |
| Brand    | 0.3 s / 0.6 s                 | Monogram opacity and slight scale reveal                   |
| Portrait | 0.65 s / 0.75 s               | Opacity, 1.04→1 scale, and 12 px translation               |
| Name     | 1 s / 0.7 s, 0.12 s stagger   | Two masked word groups                                     |
| Subtitle | 1.4 s / 0.5 s                 | Small fade/translation                                     |
| Progress | 1.7 s / 1.1 s                 | Visual track advances to 86%, awaiting readiness if needed |
| Exit     | After reveal and image checks | Track finishes in 0.15 s; intro fades over 0.35 s          |

The normal ready-asset sequence lasts approximately 3.3 seconds. It does not replay
within the current app instance after completion. No ScrollTriggers are created,
and Flip is not loaded. The approved shared GSAP entry continues to register its
existing plugins; its architecture is unchanged.

## Readiness and safety

`waitForCriticalImages()` waits for the actual portrait/logo image elements to load
and decode, including cached images. Both must settle before a normal exit can start.
Load or decode errors also settle: they must not prevent access to the portfolio.
A failed portrait is hidden inside its reserved frame rather than displaying a broken
image. The brand/name remain available.

There is no simulated network percentage. The visible bar is the cinematic sequence
indicator. The native accessible `<progress max="1">` is indeterminate until the
critical-image checks settle, then has value 1 and a descriptive `aria-valuetext`.
It represents image preparation, not the entire Angular application download. Status
copy changes once from loading to opening; no frame-by-frame announcements occur.

A six-second safety timer releases normal-motion visitors even if an image request
never finishes or an animation callback does not arrive. Skip releases immediately.
The readiness helper removes image/cancellation listeners when it settles. Abort on
skip, completion, or destruction also releases pending readiness work safely.

## Reduced motion

The existing motion helper owns preference detection. When its no-preference callback
does not run, the fully visible base styles are used immediately. No cinematic or
exit timeline is created. Once image checks settle, a short 900 ms hold allows the
brand to be understood before handoff. A separate two-second reduced-motion safety
bound prevents slow assets from prolonging this path.

If the user enables reduced motion during the cinematic sequence, the helper reverts
the GSAP context and the intro switches to the short static path. Changing preferences
again does not restart the full sequence. Smoke/particles never move in either mode.

## State, skip, and cleanup

`UiState.completeIntro()` is the only shared completion action. There is no duplicate
intro-completion store and no localStorage/sessionStorage. Refreshing creates a new
app instance and may replay the intro, as planned in Step 1.

Skip is a native button, remains visible throughout the intro, and does not wait for
assets or animation. Completion is guarded against repeated callbacks. Timers are
cleared, image readiness is cancelled, and the component's motion context is reverted
once. `DestroyRef` applies the same cleanup when navigation destroys the intro without
marking it completed. No global GSAP kill/cleanup is used. The asynchronously created
exit timeline is explicitly added to the same GSAP context.

An `INTRO_EFFECTS` injection token groups the browser/GSAP boundary so Angular TestBed
can replace effects while exercising real Home and UiState orchestration. This adds
no service, dependency, or state layer. Angular's unit-test builder does not support
relative-module `vi.mock`, so tests use this supported DI boundary.

## Accessibility and responsive behavior

The intro has one meaningful H1 and a brief portrait alt. The real logo is decorative
because the nearby heading already identifies the brand. Atmosphere and technical
labels are `aria-hidden`; no decorative layer intercepts pointer input.

The focused intro heading uses a visible red side marker instead of a large outline
box. Interactive controls retain the design system's keyboard focus rings. There is
no focus trap. After skip or automatic completion, the shell focuses the Explorer H1.
The shell omits ordinary navigation while the home intro or selector is active; direct visits
to other routes and the development design-system preview retain their normal shell.

The layout uses dynamic viewport sizing, reserved portrait space, responsive type,
and smaller portrait/decorative content on short mobile screens. At normal zoom the
intro fits 1440×900, 768×1024, and 320×740 without horizontal or vertical scrolling.
Content may grow for enlarged text or exceptionally small viewports rather than
clipping controls. A small `<noscript>` fallback identifies the developer and explains
the JavaScript navigation requirement.

## Files

Created under `src/app/features/home/intro/`:

- `intro.ts`, `intro.html`, `intro.scss`: presentation, lifecycle, and orchestration.
- `intro.config.ts`: critical image paths and safety/short-hold configuration.
- `intro-animation.ts`: GSAP reveal/exit functions.
- `critical-images.ts`: load/decode readiness and cancellation.
- `intro-effects.ts`: injectable effect boundary for TestBed.
- `intro.spec.ts`, `critical-images.spec.ts`: behavior/readiness tests.

Created `src/app/features/home/home.html` and this document. Modified `home.ts`,
`src/app/app.ts`, `app.html`, `app.scss`, `src/index.html`, the existing app/route/UI-state
specs, README, and the completion notes in foundation/design-system documentation.
Routes, UiState implementation, shared GSAP helpers, global style primitives, asset
files, and package manifests are unchanged in Step 3.

## Verification

```bash
npm run build
npm run typecheck
npm run test:ci
```

The new tests cover initial visibility, shared-state handoff, skip, automatic completion,
real readiness gating in either order, accessible progress, reduced motion, timeout,
duplicate completion races, late callbacks after destruction, preference changes,
approved image sources, cached decode, image/decode errors, and cancellation cleanup.
They test transitions rather than exact animation milliseconds.

Browser checks cover desktop/tablet/320 px mobile with both motion preferences,
automatic handoff, keyboard skip/focus, routing, in-memory returns, reload replay,
live preference changes, skipping a slow request, and a permanently stalled image.
The reference/project folders are not requested by the intro. Asset-driven layout
shifts are measured during the intro; the intentional handoff replaces its contents.
Screenshots are inspected for crop safety, logo/name visibility, wrapping, and layout.

Results: the production build passed within the existing budgets (267.20 kB initial,
approximately 71.95 kB estimated transfer; intro/GSAP remain lazy). Production smoke
checks passed with both motion preferences and preserved the development preview's
normal shell. All 38 tests passed, including 19 focused intro/readiness tests and the new
shell skip/focus test. Strict application/test type checking and Prettier passed.
Intro AXE checks passed at all three widths with both preferences (zero violations).
The brief reduced-motion intro was additionally audited with a controlled decode
delay to ensure the actual intro remained present throughout the audit. Normal-motion
browser runs completed in roughly 3.3–3.7 seconds; reduced motion used the short static
path. No console errors/warnings, missing normal assets, intro layout shifts, horizontal
overflow, or vertical scrolling were observed at the tested sizes. Live preference
changes, keyboard skip, handoff focus, reload, routing, return visits, slow-image skip,
stalled-image safety timeout, and the JavaScript-disabled fallback passed.

## Step 4 integration

Review the actual opening at `http://localhost:4300/` (or `http://localhost:4200/`
after `npm start`), including the pace, restrained portrait treatment, and mobile
composition. Refresh to replay; navigation within the app preserves completion.
Step 4 replaces only the neutral handoff, updates its integration-test expectations,
and extends shell focus/visibility handling. The intro implementation, readiness,
timelines, assets, and safety behavior are unchanged. See [explorer.md](explorer.md)
for profile selection and [home.md](home.md) for Step 5's Main Home and profile switching.
Switching profiles leaves Intro completed. Step 6 adds [The Full Story](about.md)
without changing Intro. Step 7 adds [Top Moments](experience.md) without changing
Intro. Step 8 adds [My Skill Universe](skills.md), also preserving Intro.
The [project showcase](projects.md) and [case studies](project-details.md) preserve
Intro and profile state. Step 11 adds [Contact](contact.md) and
[route transitions](route-transitions.md), explicitly excluding internal Home flow.
Final production QA is recorded in [final-qa.md](final-qa.md).
