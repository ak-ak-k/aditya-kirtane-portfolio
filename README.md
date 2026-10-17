# Aditya Kirtane — Portfolio

A dark, red-accented Angular portfolio for an Angular Developer.
Built with Angular 22 (lockfile: 22.2.2), standalone components, Signals, strict
TypeScript/templates, lazy routes, SCSS tokens, and scoped GSAP motion.

## Run and verify

Use Node **24.21.0** and npm **11.19.0** for the tested setup. The installed Angular
CLI accepts Node `^22.22.3 || ^24.15.0 || >=26.0.0`. Activate a compatible runtime
in your shell first; `node --version` and `npm --version` must work.

```bash
npm ci
npm start
```

Open `http://localhost:4200/`. The development-only style guide is at
`http://localhost:4200/design-system`; its route and component are excluded from production.

```bash
npm run build
npm run typecheck
npm run test:ci
```

## Experience and routes

Home opens with a skippable intro, then goes directly to the canonical Home.
Completion lasts for the app instance, so returning Home skips Intro; refreshing
replays it. The profile-selector concept has been removed. No persistence is used.

Routes: `/`, `/about`, `/experience`, `/skills`, `/projects`, `/contact`, and:

- `/projects/slingsip`
- `/projects/ready-inventory`
- `/projects/ready-salesman`
- `/projects/customer-portal`
- `/projects/911care`
- `/projects/collabspace`

Unknown URLs redirect home; unknown project slugs show a recovery page. The portfolio
includes a career timeline, categorized skills, six project entries, reusable case
studies, verified contact links, and a native PDF download. SlingSip and CollabSpace
remain short, source-limited entries; richer content needs owner-verified documentation.

Keyboard navigation, destination focus, a skip link, responsive menus, forced-color
styles, and reduced-motion alternatives are built in. GSAP contexts own animation
cleanup. The optional desktop cursor preserves the native cursor and is disabled for
touch and reduced motion. There are **no videos**, external fonts, or autoplay media.

## Assets

Preserve supplied originals in `src/assets`. Use only the approved sunglasses/white-red
shirt headshot, cropped to head/chest/upper body, never below mid-torso. Project covers
are artwork, not screenshots; supplied company wordmarks are not official logos.

Development serves the full asset pack. Production uses the explicit asset patterns
in `angular.json`, retaining live URLs and reusable CSS assets while excluding reference
mockups, source portraits, duplicate résumés, and unused assets. Add a required asset
to those patterns when introducing a new live reference. Primitive brand values live
in `src/assets/tokens/design-tokens.css`; semantic tokens live in `src/styles/_tokens.scss`.

## Deployment

Publish **`dist/ak-portfolio/browser/`** after `npm run build`. Serve real static files
normally and rewrite application routes to `index.html` so deep links and refresh work.
Missing static assets should return 404. The app currently assumes deployment at `/`
and uses client rendering; SSR is not enabled. No hosting provider is configured.

Use HTTPS. Cache hashed JS/CSS with a long immutable lifetime and revalidate `index.html`.
Keep unhashed asset caching modest or version changed assets. Enable Brotli/gzip at the
host. Choose the deployment origin before adding absolute canonical/social-share URLs.

See [the final startup cleanup](docs/home-cleanup.md) for the current flow and checks.
Earlier full QA and deployment requirements are recorded in
[final QA and deployment readiness](docs/final-qa.md).
Detailed guides cover [foundation](docs/foundation.md), [design system](docs/design-system.md),
[intro](docs/intro.md), [Home](docs/home.md), [About](docs/about.md),
[experience](docs/experience.md), [skills](docs/skills.md), [projects](docs/projects.md),
[case studies](docs/project-details.md), [Contact](docs/contact.md), and
[route transitions](docs/route-transitions.md).
