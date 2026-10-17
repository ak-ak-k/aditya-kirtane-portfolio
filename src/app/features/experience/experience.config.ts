interface CareerDate {
  readonly value: `${number}-${number}`;
  readonly label: string;
}
interface CareerHighlight {
  readonly journeyLabel?: string;
  readonly text: string;
  readonly source: string;
}
interface CareerMetric {
  readonly value: string;
  readonly label: string;
  readonly source: string;
}
export interface CareerRole {
  readonly id: 'onelife' | 'refr' | 'the-contrast';
  readonly sequenceNumber: '01' | '02' | '03';
  readonly initials: string;
  readonly company: string;
  readonly role: string;
  readonly startDate: CareerDate;
  readonly endDate: CareerDate | null;
  readonly summary: string;
  readonly highlights: readonly CareerHighlight[];
  readonly technologies: readonly string[];
  readonly projects: readonly string[];
  readonly metrics: readonly CareerMetric[];
  readonly source: string;
}

export const EXPERIENCE_INTRO =
  'A timeline of the roles, products, and milestones that shaped my journey.';
export const CAREER_SUMMARY =
  'From reusable Angular components to production products, my work has grown across frontend architecture, connected systems, and mobile experiences.';

// Verified against the supplied aditya-kirtane-resume.pdf, Professional Experience (p1).
// Project labels are corroborated by Key Projects (p1–2). No reference-image dates/logos.
export const EXPERIENCE_ROLES = [
  {
    id: 'onelife',
    sequenceNumber: '01',
    initials: 'OL',
    company: 'Onelife Capital Advisors Limited',
    role: 'Angular Developer — MEAN Stack',
    startDate: { value: '2023-05', label: 'May 2023' },
    endDate: null,
    summary:
      'Building and maintaining production applications across inventory, customer services, and healthcare, with Angular and the MEAN stack.',
    highlights: [
      {
        journeyLabel: 'Production Angular SPAs',
        text: 'Architected and maintained Ready Inventory, Customer Portal, and 911Care (App & Admin) as production Angular SPAs.',
        source: 'Resume p1, Onelife bullet 1.',
      },
      {
        text: 'Developed nursing, inventory, billing, and IPD/OPD modules for a Hospital Management System.',
        source: 'Resume p1, Onelife bullet 2.',
      },
      {
        journeyLabel: 'Real-time dashboards',
        text: 'Built real-time sales and inventory analytics dashboards with Angular Material and RxJS.',
        source: 'Resume p1, Onelife bullet 3.',
      },
      {
        journeyLabel: 'Payments & WebRTC',
        text: 'Integrated Razorpay and Paytm payments, plus WebRTC communication between admin, customer, and vendor roles.',
        source: 'Resume p1, Onelife bullet 4.',
      },
      {
        text: 'Developed a cross-platform Ionic app with biometric login, push notifications, and in-app payments.',
        source: 'Resume p1, Onelife bullet 5.',
      },
    ],
    technologies: ['Angular', 'RxJS', 'Node.js', 'MongoDB', 'Ionic', 'WebRTC'],
    projects: ['Ready Inventory', 'Customer Portal', '911Care', 'Hospital Management System'],
    metrics: [
      {
        value: '3',
        label: 'Production Angular SPAs',
        source: 'Resume p1, Onelife bullet 1: 3 production Angular SPAs.',
      },
      {
        value: '500+',
        label: 'Active users',
        source: 'Resume p1, Onelife bullet 1: serving 500+ active users.',
      },
    ],
    source: 'Resume p1, Onelife professional experience, May 2023–Present.',
  },
  {
    id: 'refr',
    sequenceNumber: '02',
    initials: 'R',
    company: 'Refr',
    role: 'Frontend Developer — Angular',
    startDate: { value: '2022-04', label: 'April 2022' },
    endDate: { value: '2023-05', label: 'May 2023' },
    summary:
      'Developing responsive Angular interfaces for CRM workflows and reusable frontend features backed by Firebase.',
    highlights: [
      {
        journeyLabel: 'CRM workflows',
        text: 'Built CRM workflows covering Store, Cart, Wallet, and Rewards, integrated with Firebase Firestore.',
        source: 'Resume p1, Refr bullet 1.',
      },
      {
        journeyLabel: 'Reusable components',
        text: 'Developed a reusable Angular component library to support cross-team development.',
        source: 'Resume p1, Refr bullet 2.',
      },
      {
        journeyLabel: 'Firebase integration',
        text: 'Managed Firebase CRUD operations and real-time synchronization with AngularFire, with cross-browser checks and component API documentation.',
        source: 'Resume p1, Refr bullet 3.',
      },
    ],
    technologies: ['Angular', 'Firebase', 'AngularFire'],
    projects: ['Refr CRM Platform'],
    metrics: [
      {
        value: '15%',
        label: 'Reduction in cross-team development time',
        source:
          'Resume p1, Refr bullet 2: reusable component library reducing cross-team development time by 15%.',
      },
    ],
    source: 'Resume p1, Refr professional experience, April 2022–May 2023.',
  },
  {
    id: 'the-contrast',
    sequenceNumber: '03',
    initials: 'TC',
    company: 'The Contrast',
    role: 'Angular Developer Intern',
    startDate: { value: '2021-10', label: 'October 2021' },
    endDate: { value: '2022-04', label: 'April 2022' },
    summary:
      'Establishing a professional frontend foundation through reusable Angular UI, responsive design, and collaboration with senior developers.',
    highlights: [
      {
        journeyLabel: 'Responsive Angular UI',
        text: 'Developed reusable Angular UI components using component-driven architecture and responsive design principles.',
        source: 'Resume p1, The Contrast bullet 1.',
      },
      {
        journeyLabel: 'Frontend architecture',
        text: 'Implemented CRUD operations and contributed to frontend architecture improvements.',
        source: 'Resume p1, The Contrast bullet 2.',
      },
      {
        journeyLabel: 'Team collaboration',
        text: 'Collaborated with senior developers using Git and GitLab.',
        source: 'Resume p1, The Contrast bullet 2.',
      },
    ],
    technologies: ['Angular', 'Git', 'GitLab'],
    projects: [],
    metrics: [],
    source: 'Resume p1, The Contrast professional experience, October 2021–April 2022.',
  },
] as const satisfies readonly CareerRole[];
