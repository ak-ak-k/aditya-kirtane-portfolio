export type ProjectSlug =
  | 'nexbuy'
  | 'ak-portfolio'
  | 'slingsip'
  | 'ready-inventory'
  | 'ready-salesman'
  | 'customer-portal'
  | '911care'
  | 'collabspace';
export type ProjectOwnership = 'personal' | 'professional';
export type ProjectStatus = 'production' | 'deployed' | 'prototype' | 'in-development';
export interface ProjectScreenshot {
  readonly kind: 'screenshot';
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}
export interface ProjectSummary {
  readonly ownership: ProjectOwnership;
  readonly status?: ProjectStatus;
  readonly statusLabel?: string;
  readonly subtitle?: string;
  readonly visual?: ProjectScreenshot;
  readonly identityArtwork?: boolean;
  readonly slug: ProjectSlug;
  readonly name: string;
  readonly shortDescription: string;
  readonly category: string;
  readonly type:
    | 'Professional'
    | 'Personal Product'
    | 'Prototype'
    | 'Resume project'
    | 'Portfolio entry'
    | 'Independent Build'
    | 'Personal Project';
  readonly technologies: readonly string[];
  readonly highlights: readonly string[];
  readonly coverAsset: `assets/projects/${string}`;
  readonly iconAsset: `assets/projects/${ProjectSlug}.svg`;
  readonly detailRoute: `/projects/${ProjectSlug}`;
  readonly featured: boolean;
  readonly sourceNote: string;
}

// Supplied covers are artwork, not product screenshots. Names/assets match the content map.
// Ownership follows the owner brief; technical claims and visual provenance are recorded per entry.
export const PROJECTS = [
  {
    ownership: 'personal',
    slug: 'slingsip',
    name: 'SlingSip',
    category: 'Desktop Hydration Companion',
    type: 'Independent Build',
    shortDescription:
      'A local-first desktop companion for hydration reminders, daily progress, and a quieter workday.',
    technologies: ['Angular', 'Electron', 'TypeScript'],
    highlights: ['Routine-based reminders and local hydration history.'],
    coverAsset: 'assets/projects/screenshots/slingsip-desktop.png',
    visual: {
      kind: 'screenshot',
      width: 1144,
      height: 781,
      alt: 'SlingSip desktop dashboard with daily hydration progress and reminder panels',
    },
    iconAsset: 'assets/projects/slingsip.svg',
    detailRoute: '/projects/slingsip',
    featured: true,
    sourceNote:
      'Owner confirms personal ownership. github.com/ak-ak-k/SlingSip README and package.json verified 22 October 2026; screenshot from docs/previews/final-qa-2026-10-08/overview.png.',
  },
  {
    ownership: 'personal',
    slug: 'nexbuy',
    name: 'NexBuy',
    category: 'Full-Stack E-commerce Platform',
    type: 'Personal Project',
    status: 'deployed',
    shortDescription:
      'A responsive shopping experience connecting product discovery, cart, checkout, and order workflows.',
    technologies: ['Angular', 'Node.js', 'MongoDB', 'Razorpay', 'TypeScript'],
    highlights: ['Signal-based UI state and a separately hosted REST API.'],
    coverAsset: 'assets/projects/screenshots/nexbuy-desktop.jpg',
    visual: {
      kind: 'screenshot',
      width: 1440,
      height: 900,
      alt: 'NexBuy storefront with smartphone and laptop product sections',
    },
    iconAsset: 'assets/projects/nexbuy.svg',
    detailRoute: '/projects/nexbuy',
    featured: true,
    sourceNote:
      'github.com/ak-ak-k/ShoppingFrontend README, package.json, source tree and docs/screenshots/desktop-home.jpg verified 22 October 2026. Live frontend returns HTTP 200; no payment was performed.',
  },
  {
    ownership: 'personal',
    slug: 'collabspace',
    name: 'CollabSpace',
    category: 'Team Collaboration',
    subtitle: 'Angular Collaboration Workspace Prototype',
    type: 'Independent Build',
    status: 'prototype',
    statusLabel: 'Frontend Prototype',
    shortDescription:
      'An Angular collaboration workspace prototype featuring messaging, task boards, workspace management, files and reactive UI state.',
    technologies: ['Angular 22', 'TypeScript', 'Signals', 'Angular CDK', 'PWA'],
    highlights: ['Browser-side demo data with simulated collaboration workflows.'],
    coverAsset: 'assets/projects/screenshots/collabspace/02-dashboard.webp',
    visual: {
      kind: 'screenshot',
      width: 1440,
      height: 900,
      alt: 'CollabSpace demo dashboard with workspace actions, recent conversations, tasks and activity',
    },
    iconAsset: 'assets/projects/collabspace.svg',
    detailRoute: '/projects/collabspace',
    featured: false,
    sourceNote:
      'CollabSpace-Frontend README.md, docs/ARCHITECTURE.md, docs/FEATURES.md and package.json, published commit 9bd66517a2faef27795ca46dec047075e258a5e8, verified 22 October 2026. Dashboard is docs/screenshots/02-dashboard.webp. Independent frontend prototype; no connected backend or real authentication.',
  },
  {
    ownership: 'professional',
    slug: 'ready-inventory',
    name: 'Ready Inventory',
    category: 'Inventory management',
    type: 'Professional',
    shortDescription: 'A full-stack inventory platform for sales, purchases, and stock tracking.',
    technologies: ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'NgRx'],
    highlights: [
      'Real-time sales, purchase, and stock workflows.',
      'Role-based access and NgRx-powered analytics.',
    ],
    coverAsset: 'assets/projects/covers/ready-inventory-cover.webp',
    iconAsset: 'assets/projects/ready-inventory.svg',
    detailRoute: '/projects/ready-inventory',
    featured: true,
    sourceNote: 'Resume p1, Ready Inventory System; Onelife production-SPA bullet.',
  },
  {
    ownership: 'professional',
    slug: 'ready-salesman',
    name: 'Ready Salesman',
    category: 'Field sales · Mobile',
    type: 'Resume project',
    shortDescription:
      'A cross-platform field-sales app connecting visits, location tracking, and offline workflows.',
    technologies: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'Socket.IO'],
    highlights: [
      'Offline-first sync with GPS and photo visit check-ins.',
      'Live-tracking Angular admin dashboard and FCM notifications.',
    ],
    coverAsset: 'assets/projects/covers/ready-salesman-cover.webp',
    iconAsset: 'assets/projects/ready-salesman.svg',
    detailRoute: '/projects/ready-salesman',
    featured: false,
    sourceNote: 'Resume p1–2, Ready Salesman — Field Sales App.',
  },
  {
    ownership: 'professional',
    slug: 'customer-portal',
    name: 'Customer Portal',
    category: 'Customer self-service',
    type: 'Professional',
    shortDescription:
      'A customer-facing dashboard for invoices, account statements, payments, and real-time communication.',
    technologies: ['Angular', 'Node.js', 'MongoDB', 'Razorpay', 'WebRTC'],
    highlights: [
      'Invoice and account-statement workflows with Razorpay payments.',
      'Real-time WebRTC chat for customer communication.',
    ],
    coverAsset: 'assets/projects/covers/customer-portal-cover.webp',
    iconAsset: 'assets/projects/customer-portal.svg',
    detailRoute: '/projects/customer-portal',
    featured: false,
    sourceNote: 'Resume p1, Customer Portal System; Onelife production-SPA bullet.',
  },
  {
    ownership: 'professional',
    slug: '911care',
    name: '911Care',
    category: 'Healthcare · Web & mobile',
    type: 'Professional',
    shortDescription:
      'A healthcare app and admin platform spanning prescriptions, lab modules, and video consultations.',
    technologies: ['Angular', 'Ionic', 'Firebase', 'Capacitor', 'Paytm'],
    highlights: [
      'Zoom API video consultations and healthcare workflows.',
      'Paytm payments, FCM notifications, and biometric authentication.',
    ],
    coverAsset: 'assets/projects/covers/911care-cover.webp',
    iconAsset: 'assets/projects/911care.svg',
    detailRoute: '/projects/911care',
    featured: false,
    sourceNote: 'Resume p2, 911Care — Healthcare App & Admin; Onelife production-SPA bullet.',
  },
] as const satisfies readonly ProjectSummary[];

export const PORTFOLIO_PROJECT = {
  slug: 'ak-portfolio',
  name: 'AK Portfolio',
  ownership: 'personal',
  type: 'Personal Project',
  category: 'Frontend architecture & creative engineering',
  shortDescription:
    'A custom-built Angular application combining modern frontend architecture, performance, accessibility, and creative engineering.',
  technologies: ['Angular 22', 'Signals', 'GSAP', 'TypeScript', 'Accessibility'],
  highlights: [
    'Lazy feature routes and typed project content.',
    'Scoped motion with reduced-motion support.',
    'Accessible semantics, focus management, and Vitest coverage.',
  ],
  coverAsset: 'assets/projects/screenshots/ak-portfolio-desktop.png',
  visual: {
    kind: 'screenshot',
    width: 1440,
    height: 900,
    alt: 'Current AK Portfolio home page with Aditya Kirtane introduction and project navigation',
  },
  iconAsset: 'assets/projects/ak-portfolio.svg',
  detailRoute: '/projects/ak-portfolio',
  featured: false,
  sourceNote:
    'Verified directly from this Angular 22 repository, its routing, Signals state, SCSS tokens, GSAP context helper, and Vitest tests on 22 October 2026. Screenshot captured locally from the current production build.',
} as const satisfies ProjectSummary;

export const ALL_PROJECTS: readonly ProjectSummary[] = [...PROJECTS, PORTFOLIO_PROJECT];

export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export function findProject(slug: string): ProjectSummary | undefined {
  return ALL_PROJECTS.find((project) => project.slug === slug);
}
