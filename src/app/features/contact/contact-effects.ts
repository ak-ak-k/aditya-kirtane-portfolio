import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../animations/create-motion-context';
import { animateContact } from './contact-animation';

export const CONTACT_EFFECTS = new InjectionToken('Contact effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, animateContact }),
});
