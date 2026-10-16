export type ProjectSlug =
  'slingsip' | 'ready-inventory' | 'ready-salesman' | 'customer-portal' | '911care' | 'collabspace';
export interface ProjectSummary {
  readonly slug: ProjectSlug;
  readonly name: string;
  readonly shortDescription: string;
  readonly category: string;
  readonly type:
    'Professional' | 'Personal Product' | 'Prototype' | 'Resume project' | 'Portfolio entry';
  readonly technologies: readonly string[];
  readonly highlights: readonly string[];
  readonly coverAsset: `assets/projects/covers/${ProjectSlug}-cover.webp`;
  readonly iconAsset: `assets/projects/${ProjectSlug}.svg`;
  readonly detailRoute: `/projects/${ProjectSlug}`;
  readonly featured: boolean;
  readonly sourceNote: string;
}

// Supplied covers are artwork, not product screenshots. Names/assets match the content map.
// SlingSip and CollabSpace descriptions await owner verification; no generated-cover claims are used.
export const PROJECTS = [
  {
    slug: 'slingsip',
    name: 'SlingSip',
    category: 'Project collection',
    type: 'Portfolio entry',
    shortDescription: 'A build in Aditya Kirtane’s curated project collection.',
    technologies: [],
    highlights: [],
    coverAsset: 'assets/projects/covers/slingsip-cover.webp',
    iconAsset: 'assets/projects/slingsip.svg',
    detailRoute: '/projects/slingsip',
    featured: true,
    sourceNote:
      'assets/content/portfolio-content.json verifies name and cover only. Features, stack, and product type require owner documentation.',
  },
  {
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
  {
    slug: 'collabspace',
    name: 'CollabSpace',
    category: 'Project collection',
    type: 'Portfolio entry',
    shortDescription: 'A build in Aditya Kirtane’s curated project collection.',
    technologies: [],
    highlights: [],
    coverAsset: 'assets/projects/covers/collabspace-cover.webp',
    iconAsset: 'assets/projects/collabspace.svg',
    detailRoute: '/projects/collabspace',
    featured: false,
    sourceNote:
      'assets/content/portfolio-content.json verifies name and cover only. Features, stack, and prototype status require owner documentation.',
  },
] as const satisfies readonly ProjectSummary[];

export function findProject(slug: string): ProjectSummary | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
