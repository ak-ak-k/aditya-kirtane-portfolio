import { ExplorerProfileDefinition } from '../models/explorer-profile';

export const EXPLORER_PROFILES = [
  {
    id: 'angular-engineer',
    title: 'Angular Engineer',
    description: 'Crafting scalable, high-performance web experiences with Angular.',
    icon: 'assets/icons/ui/code.svg',
    visualTheme: 'angular',
    decorativeLabels: ['COMPONENTS', 'SIGNALS', 'PERFORMANCE'],
  },
  {
    id: 'full-stack-builder',
    title: 'Full Stack Builder',
    description: 'Bridging frontend, backend, APIs and data to build end-to-end products.',
    icon: 'assets/icons/ui/server.svg',
    visualTheme: 'stack',
    decorativeLabels: ['FRONTEND', 'APIS', 'DATA'],
  },
  {
    id: 'product-thinker',
    title: 'Product Thinker',
    description: 'Turning user needs and real problems into meaningful digital products.',
    icon: 'assets/icons/ui/skills.svg',
    visualTheme: 'product',
    decorativeLabels: ['IDEA', 'BUILD', 'GROWTH'],
  },
  {
    id: 'resume-viewer',
    title: 'Resume Viewer',
    description: 'Explore my experience, skills, impact and professional journey.',
    icon: 'assets/icons/ui/download.svg',
    visualTheme: 'resume',
    decorativeLabels: ['EXPERIENCE', 'SKILLS', 'IMPACT'],
  },
] as const satisfies readonly ExplorerProfileDefinition[];
