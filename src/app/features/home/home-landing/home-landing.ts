import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PORTFOLIO } from '../../../core/constants/portfolio';
import { HOME_ASSETS, HOME_CONTENT, HOME_LAUNCHERS } from './home-landing.config';
import { HOME_LANDING_EFFECTS } from './home-landing-effects';

@Component({
  selector: 'app-home-landing',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './home-landing.html',
  styleUrl: './home-landing.scss',
})
export class HomeLanding {
  private readonly effects = inject(HOME_LANDING_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly portfolio = PORTFOLIO;
  protected readonly assets = HOME_ASSETS;
  protected readonly launchers = HOME_LAUNCHERS;
  protected readonly content = HOME_CONTENT;

  constructor() {
    afterNextRender(() => {
      const scope = this.element.nativeElement;
      const cleanup = this.effects.createMotionContext(scope, () => this.effects.revealHome(scope));
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
