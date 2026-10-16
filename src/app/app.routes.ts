import { Routes } from '@angular/router';
import { PORTFOLIO, SECTIONS } from './core/constants/portfolio';
import { DEVELOPMENT_ROUTES } from './development/development.routes';

export const routes: Routes = [
  {
    path: SECTIONS.home.path,
    pathMatch: 'full',
    title: PORTFOLIO.name,
    data: { section: SECTIONS.home.id },
    loadComponent: () => import('./features/home/home').then((module) => module.Home),
  },
  {
    path: SECTIONS.about.path,
    title: `${SECTIONS.about.label} | ${PORTFOLIO.name}`,
    data: { section: SECTIONS.about.id },
    loadComponent: () => import('./features/about/about').then((module) => module.About),
  },
  {
    path: SECTIONS.experience.path,
    title: `${SECTIONS.experience.label} | ${PORTFOLIO.name}`,
    data: { section: SECTIONS.experience.id },
    loadComponent: () =>
      import('./features/experience/experience').then((module) => module.Experience),
  },
  {
    path: SECTIONS.skills.path,
    title: `${SECTIONS.skills.label} | ${PORTFOLIO.name}`,
    data: { section: SECTIONS.skills.id },
    loadComponent: () => import('./features/skills/skills').then((module) => module.Skills),
  },
  {
    path: SECTIONS.projects.path,
    data: { section: SECTIONS.projects.id },
    loadChildren: () =>
      import('./features/projects/projects.routes').then((module) => module.PROJECT_ROUTES),
  },
  {
    path: SECTIONS.contact.path,
    title: `${SECTIONS.contact.label} | ${PORTFOLIO.name}`,
    data: { section: SECTIONS.contact.id },
    loadComponent: () => import('./features/contact/contact').then((module) => module.Contact),
  },
  ...DEVELOPMENT_ROUTES,
  { path: '**', redirectTo: SECTIONS.home.path },
];
