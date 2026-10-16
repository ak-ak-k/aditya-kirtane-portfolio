import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ABOUT_ASSETS,
  ABOUT_DOMAINS,
  ABOUT_INTRO,
  ABOUT_PHILOSOPHY,
  ABOUT_STATS,
  ABOUT_STRENGTHS,
  ABOUT_TECH,
} from './about.config';
import { ABOUT_EFFECTS } from './about-effects';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly effects = inject(ABOUT_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly assets = ABOUT_ASSETS;
  protected readonly intro = ABOUT_INTRO;
  protected readonly tech = ABOUT_TECH;
  protected readonly stats = ABOUT_STATS;
  protected readonly domains = ABOUT_DOMAINS;
  protected readonly strengths = ABOUT_STRENGTHS;
  protected readonly philosophy = ABOUT_PHILOSOPHY;

  constructor() {
    afterNextRender(() => {
      const scope = this.element.nativeElement;
      const cleanup = this.effects.createMotionContext(scope, () =>
        this.effects.animateAbout(scope),
      );
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
