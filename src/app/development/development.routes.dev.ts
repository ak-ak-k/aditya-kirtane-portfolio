import { Routes } from '@angular/router';

// Angular's development build replaces development.routes.ts with this file.
export const DEVELOPMENT_ROUTES: Routes = [
  {
    path: 'design-system',
    title: 'Design system · Development preview',
    loadComponent: () =>
      import('./design-system/design-system').then((module) => module.DesignSystem),
  },
];
