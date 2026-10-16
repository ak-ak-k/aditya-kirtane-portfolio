import { InjectionToken } from '@angular/core';

export interface RouteTransitionAnimator {
  start(): void;
  finish(): void;
  reset(): void;
  destroy(): void;
}
export const ROUTE_MOTION_QUERY =
  '(prefers-reduced-motion: no-preference) and (forced-colors: none)';
export const PAGE_TRANSITION_EFFECTS = new InjectionToken('Page transition effects', {
  providedIn: 'root',
  factory: () => ({
    loadAnimator: () =>
      import('./page-transition-animation').then((module) => module.createRouteTransition),
  }),
});
