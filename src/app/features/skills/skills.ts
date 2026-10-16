import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { ANGULAR_TOPICS, SKILL_CATEGORIES, SKILLS_INTRO, SkillCategory } from './skills.config';
import { SKILLS_EFFECTS } from './skills-effects';

@Component({
  selector: 'app-skills',
  imports: [NgOptimizedImage],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  private readonly effects = inject(SKILLS_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly categories: readonly SkillCategory[] = SKILL_CATEGORIES;
  protected readonly angularTopics = ANGULAR_TOPICS;
  protected readonly intro = SKILLS_INTRO;

  constructor() {
    afterNextRender(() => {
      const scope = this.element.nativeElement;
      const cleanup = this.effects.createMotionContext(scope, () =>
        this.effects.animateSkills(scope),
      );
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
