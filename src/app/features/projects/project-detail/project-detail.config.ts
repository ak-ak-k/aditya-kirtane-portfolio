import { PROJECTS, ProjectSlug, ProjectSummary, findProject } from '../projects.config';

export interface CaseStudyPoint {
  readonly title: string;
  readonly description: string;
}
export interface CaseStudyLink {
  readonly label: string;
  readonly url: `https://${string}`;
}
export interface ProjectCaseStudy {
  readonly slug: ProjectSlug;
  readonly overview: string;
  readonly role?: readonly string[];
  readonly features?: readonly CaseStudyPoint[];
  readonly engineering?: readonly CaseStudyPoint[];
  readonly architecture?: readonly CaseStudyPoint[];
  readonly outcome?: string;
  readonly metric?: CaseStudyPoint;
  readonly links?: readonly CaseStudyLink[];
  readonly sourceNotes: readonly string[];
}
export interface ProjectDetailView {
  readonly summary: ProjectSummary;
  readonly study: ProjectCaseStudy;
  readonly previous: ProjectSummary | null;
  readonly next: ProjectSummary | null;
}

export const CASE_STUDIES = [
  {
    slug: 'slingsip',
    overview: 'SlingSip is included in Aditya Kirtane’s curated project collection.',
    sourceNotes: [
      'assets/content/portfolio-content.json verifies identity and artwork only. No project documentation is available; technical sections are intentionally absent.',
    ],
  },
  {
    slug: 'ready-inventory',
    overview:
      'Ready Inventory is a full-stack inventory management SPA with real-time sales, purchase, and stock-tracking modules. The work combines an Angular interface with Node.js, Express.js, and MongoDB, alongside NgRx state management.',
    role: [
      'Architected and maintained the production Angular SPA.',
      'Implemented role-based access control and an NgRx analytics dashboard.',
    ],
    features: [
      {
        title: 'Inventory workflows',
        description:
          'Sales, purchases, and stock tracking in one inventory-management application.',
      },
      { title: 'Role-based access', description: 'Access control aligned with user roles.' },
      {
        title: 'Real-time analytics',
        description: 'A dashboard supported by NgRx state management.',
      },
    ],
    engineering: [
      {
        title: 'Full-stack delivery',
        description:
          'Angular, Node.js, Express.js, and MongoDB form the documented application stack.',
      },
      {
        title: 'State management',
        description: 'NgRx supports the real-time analytics dashboard.',
      },
    ],
    outcome: 'Maintained as a production Angular application within Onelife’s product portfolio.',
    links: [{ label: 'Visit product', url: 'https://readybusiness.in/' }],
    sourceNotes: [
      'Resume p1, Ready Inventory System and Onelife production-SPA bullet.',
      'External URL extracted from the Ready Inventory Live Demo PDF annotation.',
    ],
  },
  {
    slug: 'ready-salesman',
    overview:
      'Ready Salesman is a cross-platform field-sales app for Android and iOS, with offline-first sync, persistent background GPS tracking, GPS/photo visit check-ins, and push notifications. Its full stack also includes a REST API and an Angular live-tracking admin dashboard.',
    role: [
      'Single-handedly built the full stack.',
      'Developed the React Native/Expo field app and Node.js/Express/MongoDB REST API.',
      'Built the Angular live-tracking dashboard with Socket.IO and OSRM route optimization.',
    ],
    features: [
      {
        title: 'Offline-first sync',
        description: 'Field-sales workflows include offline-first synchronization.',
      },
      {
        title: 'Background location',
        description: 'Persistent GPS tracking supports screen-lock and app-kill scenarios.',
      },
      { title: 'Visit check-ins', description: 'GPS and photo check-ins record field visits.' },
      { title: 'Push notifications', description: 'FCM delivers notifications to the mobile app.' },
    ],
    engineering: [
      {
        title: 'Authenticated API',
        description: 'A Node.js/Express REST API uses JWT authentication and MongoDB.',
      },
      {
        title: 'Live administration',
        description:
          'An Angular dashboard uses Socket.IO for live tracking and OSRM for route optimization.',
      },
    ],
    architecture: [
      { title: 'Field app', description: 'React Native · Expo · FCM' },
      { title: 'REST API', description: 'Node.js · Express.js · JWT' },
      { title: 'Data storage', description: 'MongoDB' },
      { title: 'Admin dashboard', description: 'Angular · Socket.IO · OSRM' },
    ],
    outcome:
      'Delivered a cross-platform field app with its backend and live-tracking admin dashboard.',
    sourceNotes: [
      'Resume p1–2, Ready Salesman — Field Sales App. System map shows documented components without inventing deployment topology.',
    ],
  },
  {
    slug: 'customer-portal',
    overview:
      'Customer Portal is a customer-facing dashboard for invoices, account statements, Razorpay payments, and real-time WebRTC chat. Its Angular interface works with Node.js and MongoDB.',
    role: [
      'Architected and maintained the production Customer Portal SPA.',
      'Integrated customer payments and real-time WebRTC communication.',
      'Optimized OnPush change detection for large data tables.',
    ],
    features: [
      {
        title: 'Account self-service',
        description:
          'Invoices and account statements are available through the customer-facing dashboard.',
      },
      { title: 'Payments', description: 'Razorpay integration supports payment workflows.' },
      { title: 'Real-time chat', description: 'WebRTC enables customer communication.' },
    ],
    engineering: [
      {
        title: 'Rendering performance',
        description: 'OnPush change detection was optimized for large data tables.',
      },
      {
        title: 'Connected workflows',
        description:
          'Payments and peer communication sit alongside invoice and account information.',
      },
    ],
    metric: {
      title: '35%',
      description:
        'Improvement in rendering performance for large data tables, as recorded in the resume.',
    },
    outcome:
      'Maintained as a production Angular application with customer self-service, payments, and communication workflows.',
    links: [{ label: 'Visit customer portal', url: 'https://customerportal.readybusiness.in' }],
    sourceNotes: [
      'Resume p1, Customer Portal System. The 35% metric is project-specific; portfolio-wide 25% and company-wide user counts are not reused.',
      'External URL extracted from the Customer Portal Live Demo PDF annotation.',
    ],
  },
  {
    slug: '911care',
    overview:
      '911Care is a healthcare app and admin platform with prescriptions, lab modules, and Zoom API video consultations. The documented stack includes Angular, Ionic, Firebase, Paytm, and Capacitor.',
    role: [
      'Architected and maintained the production 911Care app/admin SPA.',
      'Implemented Paytm payments, FCM notifications, and biometric authentication through Capacitor.',
    ],
    features: [
      {
        title: 'Healthcare workflows',
        description: 'Prescriptions and lab modules support the platform’s healthcare use cases.',
      },
      {
        title: 'Consultation integration',
        description: 'Zoom API supports video consultations within the healthcare product.',
      },
      {
        title: 'Mobile integrations',
        description:
          'Paytm payments, FCM push notifications, and biometric authentication through Capacitor.',
      },
    ],
    engineering: [
      {
        title: 'Web and mobile',
        description: 'Angular and Ionic support the app/admin experience.',
      },
      {
        title: 'Service integrations',
        description:
          'Healthcare consultations, payments, notifications, and biometric authentication are integrated at product level.',
      },
    ],
    outcome:
      'Maintained as a production healthcare app and admin platform within Onelife’s product portfolio.',
    links: [
      {
        label: 'View Android app',
        url: 'https://play.google.com/store/apps/details?id=com.fch.care911&hl=en_IN',
      },
    ],
    sourceNotes: [
      'Resume p2, 911Care — Healthcare App & Admin; p1 Onelife production-SPA bullet.',
      'External URL extracted from the 911Care Live Demo PDF annotation. No video is embedded in this portfolio.',
    ],
  },
  {
    slug: 'collabspace',
    overview: 'CollabSpace is included in Aditya Kirtane’s curated project collection.',
    sourceNotes: [
      'assets/content/portfolio-content.json verifies identity and artwork only. Prototype status, features, and stack are unverified and intentionally absent.',
    ],
  },
] as const satisfies readonly ProjectCaseStudy[];

export function getProjectDetail(slug: string): ProjectDetailView | null {
  const summary = findProject(slug);
  const study: ProjectCaseStudy | undefined = CASE_STUDIES.find((entry) => entry.slug === slug);
  if (!summary || !study) return null;
  const index = PROJECTS.findIndex((entry) => entry.slug === slug);
  return {
    summary,
    study,
    previous: PROJECTS[index - 1] ?? null,
    next: PROJECTS[index + 1] ?? null,
  };
}
