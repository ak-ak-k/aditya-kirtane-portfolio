import { InjectionToken } from '@angular/core';
import { createMotionContext } from '../../../animations/create-motion-context';
import { playExplorerEntrance, playExplorerSelection } from './explorer-animation';

export const EXPLORER_EFFECTS = new InjectionToken('Explorer effects', {
  providedIn: 'root',
  factory: () => ({ createMotionContext, playExplorerEntrance, playExplorerSelection }),
});
