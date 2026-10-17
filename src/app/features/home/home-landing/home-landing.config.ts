export const HOME_CONTENT = {
  eyebrow: 'Angular engineering',
  headlineAccent: 'Scalable frontend experiences built with Angular.',
  supportingText: 'Angular, TypeScript, RxJS, Signals, performance, and maintainable architecture.',
} as const;

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
