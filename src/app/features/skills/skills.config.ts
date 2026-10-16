export type CategoryIcon =
  `assets/icons/ui/${'code' | 'mobile' | 'server' | 'database' | 'gear'}.svg`;
export interface Skill {
  readonly name: string;
  readonly source: string;
  readonly emphasis?: 'primary';
  readonly description?: string;
}
export interface SkillCategory {
  readonly id: 'frontend' | 'mobile' | 'backend' | 'data' | 'tools';
  readonly title: string;
  readonly description: string;
  readonly icon: CategoryIcon;
  readonly skills: readonly Skill[];
}

export const SKILLS_INTRO =
  'Technologies, tools, and engineering areas I use to build scalable, maintainable products across web and mobile.';

// Topics supported by the existing portfolio code and resume, not inferred from framework features.
export const ANGULAR_TOPICS = [
  { name: 'Standalone components', source: 'Portfolio standalone feature components.' },
  { name: 'Signals', source: 'Portfolio core/services/ui-state.ts and Home state.' },
  { name: 'Routing', source: 'Portfolio app.routes.ts; resume production Angular SPAs.' },
  { name: 'Reactive Forms', source: 'Resume p1, Summary and Onelife HMS bullet.' },
  { name: 'Reusable components', source: 'Resume p1, Refr component library.' },
  { name: 'Lazy loading', source: 'Portfolio app.routes.ts loadComponent/loadChildren.' },
  { name: 'Testing', source: 'Portfolio Vitest component, routing, and animation tests.' },
] as const satisfies readonly Skill[];

const frontend = 'Resume p2, Technical Skills — Frontend.';
const mobile = 'Resume p2, Technical Skills — Mobile.';
const backend = 'Resume p2, Technical Skills — Backend & APIs.';
const data = 'Resume p2, Technical Skills — Database.';
const tools = 'Resume p2, Technical Skills — DevOps & CI/CD.';

export const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'assets/icons/ui/code.svg',
    description:
      'My core focus: reactive interfaces, reusable components, and maintainable Angular applications.',
    skills: [
      {
        name: 'Angular',
        emphasis: 'primary',
        description:
          'From reusable UI to production SPAs, with reactive data flows and a scalable frontend foundation.',
        source: frontend,
      },
      { name: 'TypeScript', source: frontend },
      { name: 'JavaScript', source: frontend },
      { name: 'RxJS', source: frontend },
      { name: 'NgRx', source: frontend },
      { name: 'HTML', source: frontend },
      { name: 'CSS', source: frontend },
      { name: 'SCSS', source: frontend },
      { name: 'Angular Material', source: frontend },
      { name: 'Bootstrap', source: frontend },
      { name: 'Tailwind CSS', source: frontend },
      { name: 'PrimeNG', source: frontend },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    icon: 'assets/icons/ui/mobile.svg',
    description:
      'Cross-platform products, connected device features, and workflows that work offline.',
    skills: [
      { name: 'React Native', source: mobile },
      { name: 'Expo', source: mobile },
      { name: 'Expo Router', source: mobile },
      { name: 'EAS Build', source: mobile },
      { name: 'React Navigation', source: mobile },
      { name: 'Ionic', source: mobile },
      { name: 'Capacitor', source: mobile },
      { name: 'FCM', source: mobile },
      { name: 'Background Geolocation', source: mobile },
      { name: 'Offline-first Sync', source: mobile },
      { name: 'Biometric Authentication', source: mobile },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    icon: 'assets/icons/ui/server.svg',
    description:
      'Server-side APIs and authentication, alongside real-time events and peer communication.',
    skills: [
      { name: 'Node.js', source: backend },
      { name: 'Express.js', source: backend },
      { name: 'REST APIs', source: backend },
      { name: 'Socket.IO', source: backend },
      { name: 'WebRTC', description: 'Peer communication', source: backend },
      { name: 'JWT Authentication', source: backend },
    ],
  },
  {
    id: 'data',
    title: 'Database & Data',
    icon: 'assets/icons/ui/database.svg',
    description: 'Document storage, real-time synchronization, and Angular data integrations.',
    skills: [
      { name: 'MongoDB', source: data },
      { name: 'Firebase Firestore', source: data },
      { name: 'Firebase Realtime Database', source: data },
      { name: 'AngularFire', source: data },
    ],
  },
  {
    id: 'tools',
    title: 'DevOps / Tools',
    icon: 'assets/icons/ui/gear.svg',
    description: 'Version control, automated delivery, local containers, and API testing.',
    skills: [
      { name: 'Git', source: tools },
      { name: 'GitHub', source: tools },
      { name: 'GitLab', source: tools },
      { name: 'GitHub Actions', source: tools },
      { name: 'GitLab CI/CD', source: tools },
      { name: 'Azure DevOps', source: 'Resume p1, Summary and Onelife CI/CD bullet.' },
      { name: 'Docker', source: 'Resume p1, Onelife CI/CD bullet.' },
      { name: 'NGINX', source: tools },
      { name: 'Postman', source: 'Resume p2, Integrations & Tools.' },
      { name: 'Jira', source: 'Resume p2, Integrations & Tools (JIRA).' },
    ],
  },
] as const satisfies readonly SkillCategory[];
