import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import {
  CAREER_SUMMARY,
  EXPERIENCE_INTRO,
  EXPERIENCE_ROLES,
  CareerRole,
} from './experience.config';
import { JourneyOverview } from './journey-overview';
import { EXPERIENCE_EFFECTS } from './experience-effects';

@Component({
  selector: 'app-experience',
  imports: [JourneyOverview],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  private readonly effects = inject(EXPERIENCE_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly intro = EXPERIENCE_INTRO;
  protected readonly summary = CAREER_SUMMARY;
  protected readonly roles: readonly CareerRole[] = EXPERIENCE_ROLES;

  constructor() {
    afterNextRender(() => {
      const scope = this.element.nativeElement;
      const cleanup = this.effects.createMotionContext(scope, () =>
        this.effects.animateExperience(scope),
      );
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
