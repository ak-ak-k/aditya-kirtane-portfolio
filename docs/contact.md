# Contact — Step 11

> Current production startup is **Intro → Home** (16 October 2026). Profile-selector/state references below describe the earlier implementation or its dated QA. See [home-cleanup.md](home-cleanup.md) for the replacement and current verification.

The real lazy `/contact` page replaces the final feature placeholder. The approved
routes, Home/Intro/Explorer flow, About, Experience, Skills, Projects, case-study
data, navbar, cursor, state, global design system, dependencies, and assets are
preserved. Step 11 also adds [global route transitions](route-transitions.md).
Final production QA is recorded in [final-qa.md](final-qa.md).

## Verified contact data

The current `src/assets/resume/aditya-kirtane-resume.pdf` was read directly. Its
page 1 header and hyperlink annotations verify:

| Item     | Published value / action                                                                 |
| -------- | ---------------------------------------------------------------------------------------- |
| Email    | `adityakirtane27@gmail.com` / `mailto:adityakirtane27@gmail.com`                         |
| Phone    | `+91 88797 51140` / `tel:+918879751140`                                                  |
| LinkedIn | `https://linkedin.com/in/adityakirtane`                                                  |
| Location | Mumbai, India                                                                            |
| Resume   | `assets/resume/aditya-kirtane-resume.pdf` — existing 120,418-byte PDF used by Home/About |

The phone's grouping is presentation only; digits match the resume. The LinkedIn
destination is the actual PDF link annotation. No GitHub, WhatsApp, Calendly,
additional account, map URL, immediate availability, or employment-status claim
is invented. The supporting copy follows the user's stated interest in meaningful
products, engineering teams, and frontend problems; it is not an availability badge.

`contact.config.ts` owns readonly values, copy, approved asset references, and a
closed local-icon union. The template consumes the data without repeating contact
values in multiple files. No backend, HTTP request, form, message-builder state,
submission endpoint, CAPTCHA, or fake success status is added.

## Structure and interaction

The hero has the Contact Me eyebrow, one H1 “Let’s build something great,” concise
copy, three native actions, and one approved portrait. Send Message opens the mail
client. View LinkedIn opens the verified profile in a new tab, with noopener/noreferrer,
an external icon, and accessible new-tab text. Download Resume uses a native download
anchor with `Aditya-Kirtane-Resume.pdf` as its filename; no JavaScript download logic
or automatic PDF fetch is introduced.

The Let’s connect section contains an address/definition list with Email, Phone,
LinkedIn, and Location cards. Three real links use stretched hit areas; their visible
labels and values are retained in accessible names. Location is informational and
has no link, map action, pointer cursor, hover border, or tab stop. Email/phone labels
remain visible alongside the actual values. Interactive targets are at least 44 px.

Desktop (64rem+) uses an editorial copy/portrait split; tablet and mobile stack
the hero. Cards use two columns from 48rem, then one on mobile. At narrow widths,
actions stack and long contact values wrap without horizontal overflow. The existing
opaque cards, relative typography, spacing, borders, colors, focus styles, and
portrait utilities are reused; no global primitive is changed.

## Assets and motion

Only these supplied feature assets are used:

- `assets/images/aditya/portrait-headshot.webp` — one head-and-chest crop, 511×553.
- `assets/icons/ui/mail.svg`, `phone.svg`, `linkedin.svg`, `location.svg` — decorative
  icons with explicit 28×28 dimensions and empty alternatives.
- `assets/textures/light-streak.svg` — one aria-hidden static layer, with a CSS red glow.
- The verified resume PDF, fetched only after deliberate download activation.

The portrait uses NgOptimizedImage fill/priority inside a reserved square frame,
with `object-fit: cover` and `object-position: center top`. It is limited to 24rem
on desktop and 14rem on smaller layouts. Existing portrait--hero/portrait--rim
utilities provide the fade/border. There is no original/full-body source, fabricated
pose, alternate AI image, reference PNG, background video, or new asset.

One scoped GSAP timeline reveals the hero, portrait, action group, and four cards,
finishing in approximately one second. It uses opacity/translation and a small
card stagger, without ScrollTrigger, bounce, letter splitting, or ongoing effects.
The existing createMotionContext helper handles reduced motion and live preference
changes; DestroyRef reverts owned work. Base CSS is fully visible.

## Files

Created under `src/app/features/contact/`:

- `contact.config.ts`
- `contact.html`
- `contact.scss`
- `contact-animation.ts`
- `contact-effects.ts`
- `contact.spec.ts`
- `contact-animation.spec.ts`

Modified `contact.ts` to replace the placeholder and own its motion lifecycle.
The Contact route assertion now expects the actual H1. Created this guide; updated
README and earlier integration notes. Transition/shell files are inventoried in
[route-transitions.md](route-transitions.md). Prior uncommitted changes are preserved;
no dependency, supplied asset, navbar, cursor, shared state, or global stylesheet changes.

## Validation

Nine Contact component tests cover exact source-backed values, native actions,
external attributes, PDF download semantics, address/list structure, informational
location, safe portrait/icons, unsupported claims, reduced motion, and disposal.
One real GSAP test verifies zero contact ScrollTriggers, restoration of owned styles,
preservation of unrelated animation, and absence of late writes. Final integrated
build/test/browser results are recorded in the [transition guide](route-transitions.md).

Development browser checks passed at 1440×900, 768×1024, and 320×740 with both
motion preferences, plus 320 px / 200% text. Checks include active navigation,
heading focus, native link attributes, target sizes, portrait source/crop/frame,
keyboard focus, mobile-menu Escape, OPEN cursor mode, no automatic resume/future
asset fetch, and a deliberate 120,418-byte PDF download. A deliberately delayed
portrait preserved its frame and caused zero post-paint image layout shift.

## Before Step 12

Review `http://localhost:4300/contact`: copy, contact values, portrait crop/fade,
long-link wrapping, direct actions, and restrained entrance. Final production QA is recorded in [final-qa.md](final-qa.md).
