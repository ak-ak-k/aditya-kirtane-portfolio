import { Routes } from '@angular/router';
import { PORTFOLIO, SECTIONS } from '../../core/constants/portfolio';
import { findProject } from './projects.config';

export const PROJECT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: `${SECTIONS.projects.label} | ${PORTFOLIO.name}`,
    loadComponent: () => import('./project-list/project-list').then((module) => module.ProjectList),
  },
  {
    path: ':slug',
    title: (route) =>
      `${findProject(route.paramMap.get('slug') ?? '')?.name ?? 'Project not found'} | ${PORTFOLIO.name}`,
    loadComponent: () =>
      import('./project-detail/project-detail').then((module) => module.ProjectDetail),
  },
];
