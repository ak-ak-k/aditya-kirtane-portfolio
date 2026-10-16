import { ExplorerProfile } from '../../../core/models/ui-state';

interface HomeProfileContent {
  readonly eyebrow: string;
  readonly headlineAccent: string;
  readonly supportingText: string;
}

export const HOME_PROFILE_CONTENT = {
  'angular-engineer': {
    eyebrow: 'Angular engineering',
    headlineAccent: 'Scalable frontend experiences built with Angular.',
    supportingText:
      'Angular, TypeScript, RxJS, Signals, performance, and maintainable architecture.',
  },
  'full-stack-builder': {
    eyebrow: 'End-to-end builder',
    headlineAccent: 'From interface to APIs and data.',
    supportingText:
      'Angular on the frontend. Node.js, APIs, realtime features, and databases behind it.',
  },
  'product-thinker': {
    eyebrow: 'Product thinking',
    headlineAccent: 'Turning real problems into useful digital products.',
    supportingText: 'Balancing engineering quality, usability, and real-world product impact.',
  },
  'resume-viewer': {
    eyebrow: 'Professional overview',
    headlineAccent: '4+ years of products, teams, and engineering experience.',
    supportingText: 'Explore experience, skills, projects, and measurable impact.',
  },
} as const satisfies Record<ExplorerProfile, HomeProfileContent>;

export const HOME_ASSETS = {
  portrait: 'assets/images/aditya/portrait-headshot.webp',
  resume: 'assets/resume/aditya-kirtane-resume.pdf',
} as const;

export const HOME_LAUNCHERS = [
  { path: '/about', label: 'The full story', title: 'About', icon: 'user' },
  { path: '/experience', label: 'Top moments', title: 'Experience', icon: 'server' },
  { path: '/skills', label: 'My skill universe', title: 'Skills', icon: 'skills' },
  { path: '/projects', label: 'AK originals', title: 'Projects', icon: 'projects' },
] as const;
