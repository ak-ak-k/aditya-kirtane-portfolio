import { PortfolioSection, PortfolioSectionConfig } from '../models/ui-state';

export const PORTFOLIO = {
  name: 'Aditya Kirtane',
  headline: 'Angular Developer • Product Builder',
  projectDetailTitle: 'Project details',
} as const;

export const SECTIONS = {
  home: { id: 'home', path: '', label: 'Home' },
  about: { id: 'about', path: 'about', label: 'About' },
  experience: { id: 'experience', path: 'experience', label: 'Experience' },
  skills: { id: 'skills', path: 'skills', label: 'Skills' },
  projects: { id: 'projects', path: 'projects', label: 'Projects' },
  contact: { id: 'contact', path: 'contact', label: 'Contact' },
} as const satisfies Record<PortfolioSection, PortfolioSectionConfig>;

export const NAVIGATION = Object.values(SECTIONS);
