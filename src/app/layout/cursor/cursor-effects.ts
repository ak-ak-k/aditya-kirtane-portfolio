import { InjectionToken } from '@angular/core';

export const CURSOR_QUERY =
  '(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

// GSAP stays out of the initial shell bundle and loads only when enhancement is eligible.
export const CURSOR_EFFECTS = new InjectionToken('Cursor effects', {
  providedIn: 'root',
  factory: () => ({
    loadTracking: () => import('./cursor-tracking').then((module) => module.startCursorTracking),
  }),
});
