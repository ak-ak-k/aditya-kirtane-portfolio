import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../animations/create-motion-context';
import { animateSkills } from './skills-animation';

export const SKILLS_EFFECTS = new InjectionToken('Skills effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, animateSkills }),
});
