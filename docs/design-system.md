# Portfolio design system — Step 2

Step 2 defines the reusable visual language. Step 1 routing, standalone features,
Signals state, and GSAP foundation remain in place. The approved primitives are now
used by [Step 3's intro](intro.md), [Step 4's selector](explorer.md), and
[Step 5's Home/navbar/cursor](home.md), and [Step 6's About page](about.md).
About adds scoped scroll reveals; Step 11 now adds scoped global
[route transitions](route-transitions.md) without changing the primitives.

## Visual direction

Aditya Kirtane — Angular Developer • Product Builder. Near-black, restrained neon red,
large condensed type, dark surfaces, and optional static atmosphere. The intended balance
is 70% clean professional UI and 30% cinematic treatment. Repeated gradient surfaces,
gaming motifs, and streaming-service imitation are avoided.

## Token ownership

`src/assets/tokens/design-tokens.css` remains the source of primitive brand colors,
existing radii, and motion values. It is loaded first, as configured in Step 1.
`src/styles/_tokens.scss` maps those values into semantic CSS custom properties and
adds typography/layout tokens. Existing colors are referenced with `var()`, not copied
into Sass variables or component styles. The success color is the only new literal
color. Derived surfaces, hover color, and border/glow strengths use `color-mix()`.

The supplied JSON remains the original asset-pack reference. It is not imported by
the app and is not a second live token source. Update primitive brand values in the
supplied CSS; update semantic/size rules in `_tokens.scss`. Preview color annotations
describe the live tokens and do not control styling.

## Colors

| Token                   | Value / source                                      |
| ----------------------- | --------------------------------------------------- |
| `--color-bg`            | `--bg`: `#070709`                                   |
| `--color-bg-elevated`   | 97% supplied surface + 3% supplied text             |
| `--color-surface`       | `--surface`: `#101014`                              |
| `--color-surface-hover` | 96% surface + 4% text                               |
| `--color-text`          | `--text`: `#f3f4f6`                                 |
| `--color-text-muted`    | `--muted`: `#9ca3af`                                |
| `--color-accent`        | `--accent`: `#ff2038`                               |
| `--color-accent-hover`  | 85% accent + 15% text                               |
| `--color-accent-dark`   | `--accent-dark`: `#c80f28`                          |
| `--color-on-accent`     | Background color, used for filled red button labels |
| `--color-border`        | Muted gray at 22% opacity; decorative boundaries    |
| `--color-border-accent` | Supplied `--border-red`, accent at 35% opacity      |
| `--color-success`       | `#86d7ac`; always paired with a text label          |
| `--color-focus`         | Accent red                                          |
| `--color-selection`     | Dark accent with soft-white selected text           |

Dark labels on the primary red provide approximately 5.29:1 contrast. Small soft-white
labels on that red would fail WCAG AA, so they are not used. Accent red is approximately
4.99:1 against the base surface. Dark accent is a background/decorative color, not a
small-text color. Muted text remains readable rather than using low opacity.

Glows: `--glow-sm` is a 12 px, 14% red glow; `--glow-md` maps to the supplied 32 px glow;
`--glow-lg` is 48 px at 22%. Use small glows selectively. `glow-subtle`,
`glow-interactive`, `nav-glow`, `border-highlight`, and `focus-glow` provide opt-in states.
The active navigation treatment also has an underline; color alone carries no meaning.

## Typography

No fonts are installed, bundled, or requested from a network. The UI stack prefers
locally available Inter/Manrope, then Segoe UI/system sans. The display stack uses
Arial Narrow, Franklin Gothic Medium, Impact, and a sans fallback. Code/meta uses
Cascadia Code, SFMono-Regular, Consolas, and monospace. Appearance can vary by OS;
licensing and self-hosting a specific display/UI font can be decided later.

All sizes use `clamp()`. The ranges below assume the browser's default 16 px root;
relative units preserve user font-size preferences and zoom.

| Class                     | Range     | Preferred fluid size |
| ------------------------- | --------- | -------------------- |
| `.text-display-xl`        | 52–144 px | 10vw                 |
| `.text-display`           | 44–104 px | 7.5vw                |
| `.text-heading-1`         | 36–72 px  | 5vw                  |
| `.text-heading-2`         | 28–48 px  | 3.5vw                |
| `.text-heading-3`         | 22–32 px  | 2.2vw                |
| `.text-heading-4`         | 18–22 px  | 1.6vw                |
| `.text-body-lg`           | 18–20 px  | 1.4vw                |
| `.text-body`              | 16–17 px  | 1.1vw                |
| `.text-body-sm`           | 14–15 px  | 0.96vw               |
| `.text-label`, `.eyebrow` | 12–13 px  | 0.85vw               |
| `.text-meta`              | 13–14 px  | 0.9vw                |

Headings balance their lines and wrap long words. Text classes do not replace semantic
heading levels. `.eyebrow` adds a red line; `.eyebrow--dot` swaps it for a small dot.
`.text-muted`, `.text-accent`, and `.content-measure` cover common readable text roles.

Heading treatments are `.white-red` (direct child spans are red), `.red-accent`,
`.brush-accent` (the supplied brush SVG is a short underline), and
`.outline-background-word`. The outline word must be a decorative duplicate with
`aria-hidden="true"`, inside a positioned, isolated parent. It clips locally and does
not replace readable foreground text.

## Spacing and layout

The spacing ladder is 4, 8, 12, 16, 24, 32, 48, and 64 px at the default root size.
`--container-max` is 90rem (1440 px). `--page-padding` is `clamp(1rem, 4vw, 4rem)`;
`--section-space` is `clamp(4.5rem, 8vw, 8.75rem)`. Content gap is 24–48 px,
card gap 16–24 px, and card padding 20–32 px.

- `.page-container`: centered, fluid gutter container with the 1440 px maximum.
- `.section`: consistent vertical section rhythm.
- `.section-header`: title/copy spacing, limited to 52rem.
- `.stack`: vertical flex layout; override `--stack-gap` locally when needed.
- `.cluster`: wrapping horizontal flex layout; override `--cluster-gap` locally.
- `.grid`: automatic columns with a default 18rem minimum and a safe 100% mobile cap.
- `.grid--two`: one column below 48rem, then two.
- `.grid--three`: one column below 48rem, two from 48rem, three from 72rem.

Children can shrink without forcing horizontal overflow. The existing shell uses
these layout tokens rather than a separate fixed content width.

## Controls, cards, and badges

Use native `<button type="button">` for actions and `<a href>`/RouterLink for
destinations. Base class `.btn` supplies layout, minimum 44 px dimensions, and focus
behavior. Variants are `.btn--primary`, `.btn--secondary`, `.btn--ghost`,
`.btn--icon`, and `.btn--connect`. Combine an icon modifier with a color variant when
needed. Icon-only buttons require an accessible name.

Hover is restricted to devices with hover/fine pointers. Pressed controls have a tiny
CSS translation. Native `disabled` prevents activation and has a distinct muted state.
`aria-disabled` styling is provided, but the caller must prevent activation when using
it; prefer native disabled buttons. Do not create a disabled link with CSS alone.
Reduced motion removes lift/press transforms and effectively removes transitions.

Cards use `.card` with optional `.card--neon`, `.card--glass`, `.card--interactive`,
or `.card--metric`. The standard card is opaque and has no glow. Neon is restrained.
Glass has a readable opaque fallback and is the only primitive using backdrop blur
(8 px, opt-in). An interactive card should be one semantic link or button without
nested interactive controls. Metric examples in the preview describe the design
system; they are not personal portfolio claims.

`.badge` provides compact tags; `.badge--tech` and `.badge--accent` offer controlled
variants. `.chip` is for native interactive filter buttons and uses `aria-pressed`.
Selected chips add a CSS check shape, which does not change their accessible name.
`.status` / `.status--success` include text alongside the indicator.

## Background layers

Use `.cinematic-bg` on a parent and one or two `.bg-layer` children. Each layer must
have `aria-hidden="true"`. They are absolute, ignore pointer events, reserve no extra
layout space, and remain static. Example:

```html
<section class="cinematic-bg section">
  <span class="bg-layer bg-red-glow" aria-hidden="true"></span>
  <div class="page-container">Readable foreground content</div>
</section>
```

Available modifiers: `.bg-dark`, `.bg-red-glow`, `.bg-grid`, `.bg-noise`, `.bg-smoke`,
`.bg-halo`, `.bg-light-streak`, and `.bg-particles`. They reference actual supplied
background/texture files; the radial glow is CSS. The preview shows each effect
separately. Do not stack every effect. Noise is about 595 kB, so keep it opt-in and
measure whether it is needed on mobile. No background video, ongoing animation,
large CSS blur, or particle DOM collection is introduced.

## Portraits and icons

`.portrait` is a sized, overflow-clipped wrapper. Use the approved cropped source
with `NgOptimizedImage` fill mode inside it. The wrapper's aspect ratio reserves layout
space. The image uses `object-fit: cover` and `object-position: center top`.

Variants: `.portrait--hero` adds a bottom fade, `.portrait--card` gives a 4:3 frame,
`.portrait--ghost` gives a quiet grayscale treatment, and `.portrait--red-treatment`
adds an optional color overlay. `.portrait--rim` adds a restrained border/glow.
Overlays are decorative and ignore pointer events.

The preview uses only `assets/images/aditya/portrait-headshot.webp`, showing sunglasses
and the white/red shirt with a head-and-chest crop. Source files are unchanged. CSS
cannot guarantee a safe crop of an arbitrary source: never substitute a full-body
original or unverified image. Future uses must remain head/chest/upper-body, with
mid-torso the maximum and no pants or lower body.

`.icon` uses supplied SVGs as CSS masks and inherits `currentColor`. Sizes
`.icon--sm`, `.icon--md`, `.icon--lg`, `.icon--xl` are 16, 20, 24, and 32 px. The
default is medium. Prepared masks are `code`, `arrow`, `mail`, `github`, `external`,
and `download`. Decorative spans use `aria-hidden`; meaning belongs in visible text
or the control's accessible name. No large icon dependency is added.

## Accessibility and reset

The reset preserves native semantics, relative font sizing, image aspect ratios, and
form font inheritance. Links stay underlined. Text selection uses dark red/soft white.
The scrollbar uses only the browser-safe `scrollbar-color` property. Smooth scrolling
is enabled only for focused documents when reduced motion allows it.

Focus rings remain visible and have a dark separator on red controls. The skip link
is clipped until focused. `.sr-only` supports hidden accessible labels. Forced-color
mode uses system outline/border colors. Reduced motion removes interactive transforms
and CSS transition/animation durations. The existing GSAP motion helper is unchanged
and is not used by these primitives.

## Development preview and production isolation

Run `npm start` and visit `http://localhost:4200/design-system`.
The verification server uses `http://localhost:4300/design-system`.

`development.routes.ts` exports an empty array by default. Only Angular's development
configuration replaces it with `development.routes.dev.ts`, which adds the lazy preview
route. Production has no preview component import or route. The preview is not added
to primary navigation; portfolio routes and state do not depend on it. Production
visits to `/design-system` use the existing wildcard redirect home.

The shell's existing activation focus signal now tracks the activated component
instance so it also focuses correctly between home and this preview, even though
the preview is not a portfolio section. No route/state architecture was replaced.

## Files

Created `src/styles/_tokens.scss`, `_reset.scss`, `_typography.scss`, `_layout.scss`,
`_buttons.scss`, `_cards.scss`, `_badges.scss`, `_headings.scss`, `_backgrounds.scss`,
`_images.scss`, `_icons.scss`, `_utilities.scss`, and `_accessibility.scss`.

Created `src/app/development/development.routes.ts`, `development.routes.dev.ts`,
and `design-system/design-system.ts`, `.html`, and `.scss`, plus this document.

Modified `src/styles.scss`, `src/app/app.scss`, `src/app/app.ts`, `src/app/app.html`,
`src/app/app.routes.ts`, `src/app/layout/navbar/navbar.scss`, `angular.json`,
`README.md`, and the completion status in `docs/foundation.md`. No package,
Signals store, portfolio feature, animation helper, or supplied asset file was changed
in Step 2. All Step 1 working changes are preserved.

## Verification

```bash
npm run build
npm run typecheck
npm run test:ci
```

Formatting is checked with the existing Prettier installation. Browser verification
covers 1440 px desktop, 768 px tablet, and 320 px mobile with both motion preferences;
headings, layout overflow, control sizes/states, keyboard focus, image loading, console
messages, and missing requests are checked. Production is checked for absence of the
preview route/component and for the home redirect from `/design-system`.

No additional project dependencies are required. Browser checks use the temporary
Playwright/axe-core installation from Step 1.

Results: production build passed within the existing budgets; strict application/test
type checks and Prettier passed; all 18 existing Vitest tests passed. The preview
passed six AXE audits (three widths, both motion preferences), and the existing seven
portfolio routes passed 14 regression audits. All 20 audits had zero violations.
The preview had no horizontal overflow, missing assets, browser errors, or Angular
image warnings. Keyboard focus, category selection, button actions, disabled controls,
touch targets, reduced-motion hover behavior, and portrait loading were checked.
Screenshots of desktop/tablet/mobile typography, controls, cards, and portrait treatments
were inspected. Production bundles exclude the development preview, and visiting
`/design-system` in production redirects home.

## Step 3–6 integration

The approved system is now used by the [Step 3 intro](intro.md) and
[Step 4 profile selector](explorer.md), plus [Step 5 Home/navbar/cursor](home.md).
Step 6 uses the same primitives for [The Full Story](about.md).
They reuse its tokens, typography, portraits, backgrounds, controls, and accessibility
rules without changing the global primitives.
The system font strategy remains intentional; a specific licensed, self-hosted font
can be approved later. Step 7 now uses these primitives for [Top Moments](experience.md).
Step 8 reuses them for [My Skill Universe](skills.md), with feature-local orbit
graphics and category styling. The [showcase](projects.md) and
[case studies](project-details.md) also reuse the approved primitives.
Step 11 uses them for [Contact](contact.md) and [route transitions](route-transitions.md).
Final production QA is recorded in [final-qa.md](final-qa.md).
