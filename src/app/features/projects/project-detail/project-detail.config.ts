import {
  PROJECTS,
  PORTFOLIO_PROJECT,
  ProjectSlug,
  ProjectSummary,
  findProject,
} from '../projects.config';

export interface CaseStudyPoint {
  readonly title: string;
  readonly description: string;
}
export interface CaseStudyLink {
  readonly label: string;
  readonly url: `https://${string}`;
}
export interface CaseStudyImage {
  readonly src: `assets/projects/screenshots/${string}`;
  readonly title: string;
  readonly alt: string;
  readonly caption: string;
  readonly width: number;
  readonly height: number;
}
interface CaseStudySectionBase {
  readonly id: string;
  readonly title: string;
}
export type CaseStudySection =
  | (CaseStudySectionBase & {
      readonly kind: 'text';
      readonly paragraphs: readonly string[];
      readonly items?: readonly string[];
    })
  | (CaseStudySectionBase & {
      readonly kind: 'flow';
      readonly nodes: readonly CaseStudyPoint[];
      readonly events: CaseStudyPoint;
      readonly planned: CaseStudyPoint;
    })
  | (CaseStudySectionBase & {
      readonly kind: 'gallery';
      readonly images: readonly CaseStudyImage[];
    });

export interface ProjectCaseStudy {
  readonly slug: ProjectSlug;
  readonly overview: string;
  readonly intro?: string;
  readonly roleTitle?: string;
  readonly featuresTitle?: string;
  readonly engineeringTitle?: string;
  readonly contextSections?: readonly CaseStudySection[];
  readonly followUpSections?: readonly CaseStudySection[];
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
    overview:
      'SlingSip is a local-first Angular and Electron desktop hydration companion. A tray-based background process schedules reminders while a desktop dashboard tracks water intake and routine preferences.',
    features: [
      {
        title: 'Drink or defer',
        description: 'Record water during a reminder or defer the next break.',
      },
      { title: 'Daily progress', description: 'Track hydration goals and local daily history.' },
      {
        title: 'Background companion',
        description: 'Tray controls keep the app available when the dashboard is closed.',
      },
    ],
    engineering: [
      {
        title: 'Desktop boundaries',
        description:
          'Angular renderers communicate through typed preload/IPC contracts with the Electron main process.',
      },
      {
        title: 'Local-first storage',
        description:
          'Hydration history and preferences are stored locally; cloud sync is not claimed.',
      },
    ],
    links: [
      { label: 'View source', url: 'https://github.com/ak-ak-k/SlingSip' },
      { label: 'Visit product website', url: 'https://sling-sip.vercel.app/' },
    ],
    sourceNotes: [
      'SlingSip public README, package.json, electron/shared source tree, and dashboard QA capture verified 22 October 2026. The public Windows release is unsigned and automatic updates are disabled; no signed update capability or roadmap features are claimed here.',
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
    intro:
      'An independent Angular 22 frontend prototype exploring how conversations, teams, tasks, files and workspace administration can work together in one responsive collaboration experience.',
    overview:
      'CollabSpace brings conversations, task boards, people, shared files and workspace administration into one Angular application. The navigable frontend runs on fictional, built-in demo data; its interactions demonstrate product workflows without a production backend.',
    contextSections: [
      {
        kind: 'text',
        id: 'collabspace-problem',
        title: 'The Problem',
        paragraphs: [
          'Team conversations, tasks and shared files often sit in separate tools, making it difficult to retain context across everyday work.',
        ],
      },
      {
        kind: 'text',
        id: 'collabspace-approach',
        title: 'The Approach',
        paragraphs: [
          'A unified frontend workspace connects conversations, people, tasks, files and activity. Task attachments appear in Files, shared files link back to their messages and tasks, and changes feed the demo activity stream.',
          'The current product model is browser-side: mock data services and timer-driven events simulate the collaboration experience.',
        ],
      },
    ],
    roleTitle: 'Independent Engineering Project',
    role: [
      'Designed the standalone Angular feature architecture, lazy routes and functional guards.',
      'Built shared UI primitives, responsive layouts and signal-based state services.',
      'Implemented browser-side workflow simulations, PWA integration and unit tests.',
    ],
    featuresTitle: 'Core Features',
    features: [
      {
        title: 'Workspace Management',
        description:
          'Create, switch and configure demo workspaces; manage invitations, archive behavior and an administrative audit interface.',
      },
      {
        title: 'Messaging and Threads',
        description:
          'Channels, direct and group conversations, threads, reactions, mentions, pins and saved messages. Replies, typing and read receipts are simulated with timers.',
      },
      {
        title: 'Task Boards',
        description:
          'Kanban and list views, filters, Angular CDK drag and drop, keyboard task moves, subtasks, comments and attachments.',
      },
      {
        title: 'Files and References',
        description:
          'File previews, rename, delete and star actions connect files to tasks and messages. Upload progress is simulated; there is no backend file storage.',
      },
      {
        title: 'Search and Notifications',
        description:
          'A keyboard-accessible command palette searches a static browser index. Notification rules and activity consume simulated events.',
      },
      {
        title: 'Roles and Permissions',
        description:
          'Workspace roles shape client-side controls and access pages. These UI rules are not server-enforced security boundaries.',
      },
    ],
    engineeringTitle: 'Engineering With Modern Angular',
    engineering: [
      {
        title: 'Standalone, lazy and zoneless',
        description:
          'Angular 22.2 standalone components and lazy feature routes define application boundaries. Signals drive zoneless change detection without a zone.js dependency.',
      },
      {
        title: 'Reactive state ownership',
        description:
          'Singleton state services expose signals and computed views. A Loadable helper supplies loading, ready, empty and error states; linkedSignal resets local state when its source changes.',
      },
      {
        title: 'Forms and access rules',
        description:
          'Signal Forms validate prototype input. Functional guards and pure access rules control frontend navigation and permissions while authentication remains simulated.',
      },
      {
        title: 'Reusable interaction primitives',
        description:
          'Angular CDK supports dialogs, overlays, menus and task drag and drop with keyboard alternatives. SCSS tokens and Lucide Angular support a consistent component design system.',
      },
      {
        title: 'Async demo boundary',
        description:
          'Mock data services return promises or observables with simulated latency. RxJS 7.8 events feed replies, typing and notifications; no HTTP or real-time transport is connected.',
      },
    ],
    followUpSections: [
      {
        kind: 'flow',
        id: 'collabspace-architecture',
        title: 'Application Architecture',
        nodes: [
          { title: 'Angular Router', description: 'Lazy routes and functional guards.' },
          { title: 'Feature Components', description: 'Standalone product screens and shared UI.' },
          { title: 'State Services', description: 'Signals, computed views and Loadable states.' },
          {
            title: 'Mock Data Services',
            description: 'Simulated latency and browser-side writes.',
          },
          {
            title: 'Built-in Demo Data',
            description: 'Fictional workspace, message, task and file records.',
          },
        ],
        events: {
          title: 'Simulated RxJS events',
          description:
            'Timer-driven demo events feed the relevant state services. They do not come from a messaging server.',
        },
        planned: {
          title: 'Future Backend Integration',
          description:
            'Planned / Not Yet Implemented: an HTTP API and real-time transport would replace the mock data boundary.',
        },
      },
      {
        kind: 'gallery',
        id: 'collabspace-gallery',
        title: 'UI Screenshot Gallery',
        images: [
          {
            src: 'assets/projects/screenshots/collabspace/02-dashboard.webp',
            title: 'Workspace dashboard',
            alt: 'Demo workspace dashboard with quick actions, conversations and activity',
            caption: 'Dashboard combining demo conversations, tasks and workspace activity.',
            width: 1440,
            height: 900,
          },
          {
            src: 'assets/projects/screenshots/collabspace/03-messages-thread.webp',
            title: 'Messages and threads',
            alt: 'CollabSpace conversation list, message timeline and open thread panel',
            caption: 'Threaded conversation UI with simulated replies, typing and read receipts.',
            width: 1440,
            height: 900,
          },
          {
            src: 'assets/projects/screenshots/collabspace/05-tasks-board.webp',
            title: 'Task board',
            alt: 'Kanban task board grouped into Backlog, Todo, In progress, Review and Done',
            caption: 'Task board demonstrating Angular CDK drag and drop and status grouping.',
            width: 1440,
            height: 900,
          },
          {
            src: 'assets/projects/screenshots/collabspace/06-task-details.webp',
            title: 'Task details',
            alt: 'Task details drawer with status, priority, assignee, labels and subtasks',
            caption: 'Task details and linked work within the browser-side product model.',
            width: 1440,
            height: 900,
          },
          {
            src: 'assets/projects/screenshots/collabspace/10-roles-permissions.webp',
            title: 'Roles and permissions',
            alt: 'Workspace permission matrix with Owner, Admin, Member and Guest columns',
            caption: 'Client-side permission controls; a backend must enforce real access rules.',
            width: 1440,
            height: 900,
          },
          {
            src: 'assets/projects/screenshots/collabspace/14-mobile-messages.webp',
            title: 'Mobile messages',
            alt: 'Mobile CollabSpace conversation list with workspace header and bottom navigation',
            caption: 'Responsive messages interface using fictional demo conversations.',
            width: 780,
            height: 1688,
          },
        ],
      },
      {
        kind: 'text',
        id: 'collabspace-pwa',
        title: 'PWA and Offline Experience',
        paragraphs: [
          'Production builds register an Angular service worker and cache the application shell, scripts, styles, fonts and icons. The manifest, install/update interface and connectivity indicators support the PWA experience.',
          'Offline messages, task edits and invitations enter an in-memory action queue for simulated reconnect behavior. Reloading can discard queued changes; there is no durable offline synchronization or backend sync.',
        ],
        items: [
          'The source audit verified service-worker control on the deployed site and offline shell loading in a local production build.',
          'The install prompt has not been verified on a physical device. Application-data and API-response caching are not implemented.',
        ],
      },
      {
        kind: 'text',
        id: 'collabspace-testing',
        title: 'Testing and Quality',
        paragraphs: [
          'At the documented 22 October 2026 verification, the project passed 600 unit tests across 166 spec files using Vitest.',
        ],
        items: [
          'Coverage areas include state services, domain rules, data services, pipes and shared UI components.',
          'Feature page components are not unit-tested. There is no E2E suite or coverage reporting, and no production security certification is claimed.',
        ],
      },
      {
        kind: 'text',
        id: 'collabspace-limitations',
        title: 'Current Limitations',
        paragraphs: [
          'Frontend Prototype: the implemented scope is a responsive, navigable collaboration UI using browser-side demo data.',
        ],
        items: [
          'No backend API integration, real authentication, server-side permissions or real-time messaging server.',
          'Messages, tasks, files and workspace changes are not durably persisted and reset on reload. A session flag, theme and recent searches may use browser storage.',
          'Uploads, replies, read receipts and notification events are simulated. Search uses a static in-browser index.',
          'The offline queue lives in memory and can be lost on reload. There is no IndexedDB queue or background synchronization.',
        ],
      },
      {
        kind: 'text',
        id: 'collabspace-roadmap',
        title: 'Future Roadmap',
        paragraphs: ['Planned / Not Yet Implemented'],
        items: [
          'REST API and real authentication.',
          'Server-side permissions and persistent application storage.',
          'Actual real-time messaging and file storage.',
          'Durable offline synchronization and end-to-end testing.',
        ],
      },
    ],
    links: [
      { label: 'Live Demo', url: 'https://collab-space-frontend-tau.vercel.app/login' },
      { label: 'GitHub Source', url: 'https://github.com/ak-ak-k/CollabSpace-Frontend' },
    ],
    sourceNotes: [
      'Published CollabSpace-Frontend commit 9bd66517a2faef27795ca46dec047075e258a5e8, fetched 22 October 2026. README.md, docs/ARCHITECTURE.md, docs/FEATURES.md and package.json verified; no changes made to the source repository.',
      'FEATURES.md records the 22 October audit against implementation commit 355e2f1, 600 passing tests across 166 specs. This is a cited historical snapshot; the portfolio does not rerun or certify that repository.',
      'Genuine source screenshots: docs/screenshots/02-dashboard.webp, 03-messages-thread.webp, 05-tasks-board.webp, 06-task-details.webp, 10-roles-permissions.webp, 14-mobile-messages.webp. Original WebP bytes and dimensions preserved; screenshots use fictional demo data.',
    ],
  },
  {
    slug: 'nexbuy',
    overview:
      'NexBuy is a personal e-commerce application with an Angular frontend and a separately deployed Express/MongoDB API. Its public repository documents product discovery, cart persistence, account workflows, and Razorpay checkout integration.',
    features: [
      {
        title: 'Product discovery',
        description: 'Search, filters, and paginated catalog browsing.',
      },
      {
        title: 'Shopping workflows',
        description: 'Local cart state, authenticated wishlist, addresses, and orders.',
      },
      {
        title: 'Checkout integration',
        description: 'Razorpay hand-off with payment verification handled by the API.',
      },
    ],
    engineering: [
      {
        title: 'State ownership',
        description: 'Signals and RxJS connect UI state to focused services and the REST API.',
      },
      {
        title: 'Session continuity',
        description: 'An HTTP interceptor coordinates token refresh and request retry.',
      },
    ],
    links: [
      { label: 'View source', url: 'https://github.com/ak-ak-k/ShoppingFrontend' },
      { label: 'Visit live project', url: 'https://shoppingfrontend-topaz.vercel.app/' },
    ],
    sourceNotes: [
      'ShoppingFrontend README, package.json, source tree, and genuine desktop-home.jpg verified 22 October 2026. Live homepage responds HTTP 200. No purchase, backend security audit, production usage, or roadmap capability is claimed.',
    ],
  },
  {
    slug: 'ak-portfolio',
    overview: PORTFOLIO_PROJECT.shortDescription,
    engineering: [
      {
        title: 'Feature boundaries',
        description:
          'Standalone Angular features load through lazy routes; shared project data powers reusable case studies.',
      },
      {
        title: 'Predictable state',
        description:
          'Signals and computed values derive UI state from the active route and typed local data.',
      },
      {
        title: 'Scoped motion',
        description:
          'GSAP and ScrollTrigger run inside a motion context that restores owned work on route destruction or reduced-motion changes.',
      },
      {
        title: 'Accessible delivery',
        description:
          'Semantic headings, keyboard focus, responsive layouts, and Vitest coverage support a usable portfolio.',
      },
    ],
    architecture: [
      { title: 'Angular Router', description: 'Lazy feature routes and a shared detail renderer.' },
      { title: 'Signals', description: 'Route-derived state and computed view data.' },
      {
        title: 'SCSS design tokens',
        description: 'Shared color, type, spacing, and control primitives.',
      },
      {
        title: 'GSAP motion context',
        description: 'Owned animations with cleanup and reduced-motion support.',
      },
    ],
    links: [{ label: 'View source', url: 'https://github.com/ak-ak-k/aditya-kirtane-portfolio' }],
    sourceNotes: [
      PORTFOLIO_PROJECT.sourceNote,
      'Source repository and live portfolio homepage both respond successfully on 22 October 2026. No Lighthouse score, fictional metric, or deployment action is introduced.',
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
    previous: index >= 0 ? (PROJECTS[index - 1] ?? null) : null,
    next: index >= 0 ? (PROJECTS[index + 1] ?? null) : null,
  };
}
