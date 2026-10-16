import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../../animations/create-motion-context';
import { revealHome } from './home-landing-animation';

export const HOME_LANDING_EFFECTS = new InjectionToken('Home landing effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, revealHome }),
});
