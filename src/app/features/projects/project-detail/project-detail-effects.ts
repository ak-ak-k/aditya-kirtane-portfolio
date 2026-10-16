import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../../animations/create-motion-context';
import { animateProjectDetail } from './project-detail-animation';

export const PROJECT_DETAIL_EFFECTS = new InjectionToken('Project detail effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, animateProjectDetail }),
});
