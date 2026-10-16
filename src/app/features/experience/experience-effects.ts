import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../animations/create-motion-context';
import { animateExperience } from './experience-animation';

export const EXPERIENCE_EFFECTS = new InjectionToken('Experience effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, animateExperience }),
});
