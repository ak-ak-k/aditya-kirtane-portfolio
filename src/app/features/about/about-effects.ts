import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../animations/create-motion-context';
import { animateAbout } from './about-animation';

export const ABOUT_EFFECTS = new InjectionToken('About effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, animateAbout }),
});
