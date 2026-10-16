interface AboutStat {
  readonly value: string;
  readonly label: string;
  readonly detail: string;
  readonly source: string;
}
interface AboutDomain {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: 'user' | 'database' | 'server' | 'projects' | 'mobile' | 'code';
  readonly source: string;
}

// Source: supplied aditya-kirtane-resume.pdf, summary (p1) and key projects (p1–2).
export const ABOUT_INTRO = [
  'Hi, I’m Aditya Kirtane — an Angular developer with 4+ years of experience building scalable web, mobile, and product experiences.',
  'I work primarily with Angular, TypeScript, RxJS, and modern frontend architecture, with hands-on experience in Node.js, MongoDB, React Native, and Ionic.',
  'My work spans healthcare, finance, CRM, inventory, customer portals, and field-sales applications.',
] as const;

export const ABOUT_TECH = [
  'Angular',
  'TypeScript',
  'RxJS',
  'Node.js',
  'MongoDB',
  'React Native',
  'Ionic',
] as const;
export const ABOUT_STATS = [
  {
    value: '4+',
    label: 'Years',
    detail: 'Professional engineering experience',
    source: 'Resume p1, Summary: 4+ years.',
  },
  {
    value: 'Production',
    label: 'Products',
    detail: 'Applications built for everyday use',
    source: 'Resume p1, Onelife: production SPAs; p1–2, Key Projects.',
  },
  {
    value: 'Web · Mobile',
    label: 'Product development',
    detail: 'Interfaces, APIs, and connected experiences',
    source: 'Resume p1 Summary; p2 Ready Salesman and 911Care.',
  },
  {
    value: 'Mumbai',
    label: 'India',
    detail: 'Based in',
    source: 'Resume p1, contact header: Mumbai, India.',
  },
] as const satisfies readonly AboutStat[];

export const ABOUT_DOMAINS = [
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Patient apps, care workflows, and hospital systems.',
    icon: 'user',
    source: 'Resume p1–2: 911Care and Hospital Management System.',
  },
  {
    id: 'finance',
    title: 'Finance & payments',
    description: 'Account statements, invoices, and payment integrations.',
    icon: 'database',
    source: 'Resume p1 Summary: finance; Customer Portal, Razorpay and Paytm integrations.',
  },
  {
    id: 'crm',
    title: 'CRM',
    description: 'Store, cart, wallet, and rewards workflows.',
    icon: 'server',
    source: 'Resume p1–2: Refr CRM Platform.',
  },
  {
    id: 'inventory',
    title: 'Inventory & operations',
    description: 'Sales, purchases, stock tracking, and analytics.',
    icon: 'projects',
    source: 'Resume p1: Ready Inventory System.',
  },
  {
    id: 'customer-platforms',
    title: 'Customer platforms',
    description: 'Customer-facing dashboards and real-time communication.',
    icon: 'code',
    source: 'Resume p1: Customer Portal System, WebRTC chat.',
  },
  {
    id: 'field-sales',
    title: 'Field sales & mobility',
    description: 'Offline-first apps, visit check-ins, and live tracking.',
    icon: 'mobile',
    source: 'Resume p1–2: Ready Salesman field-sales app.',
  },
] as const satisfies readonly AboutDomain[];

// Resume p1–2: architecture, component library, RxJS/NgRx, performance,
// REST integration, responsive UI, WebRTC/Socket.IO, React Native/Ionic.
export const ABOUT_STRENGTHS = [
  'Angular architecture',
  'Reusable components',
  'Reactive state',
  'Performance',
  'API integration',
  'Responsive UI',
  'Real-time features',
  'Mobile development',
] as const;
export const ABOUT_PHILOSOPHY =
  'I care about maintainable code, useful products, and interfaces that feel simple even when the systems behind them are complex.';

export const ABOUT_ASSETS = {
  portrait: 'assets/images/aditya/portrait-headshot.webp',
  resume: 'assets/resume/aditya-kirtane-resume.pdf',
} as const;
