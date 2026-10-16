import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../../animations/create-motion-context';
import { animateProjects } from './projects-animation';

export const PROJECTS_EFFECTS = new InjectionToken('Projects effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, animateProjects }),
});
