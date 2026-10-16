import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../../animations/create-motion-context';
import { waitForCriticalImages } from './critical-images';
import { playIntroExit, playIntroReveal } from './intro-animation';

// Keep browser/GSAP effects separate from orchestration; TestBed can replace this boundary.
export const INTRO_EFFECTS = new InjectionToken('Intro effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, waitForCriticalImages, playIntroReveal, playIntroExit }),
});
