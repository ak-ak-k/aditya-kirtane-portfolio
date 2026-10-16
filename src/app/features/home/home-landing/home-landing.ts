import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXPLORER_PROFILES } from '../../../core/constants/explorer-profiles';
import { PORTFOLIO } from '../../../core/constants/portfolio';
import { ExplorerProfile } from '../../../core/models/ui-state';
import { UiState } from '../../../core/services/ui-state';
import { HOME_ASSETS, HOME_LAUNCHERS, HOME_PROFILE_CONTENT } from './home-landing.config';
import { HOME_LANDING_EFFECTS } from './home-landing-effects';

@Component({
  selector: 'app-home-landing',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './home-landing.html',
  styleUrl: './home-landing.scss',
})
export class HomeLanding {
  readonly profile = input.required<ExplorerProfile>();
  private readonly state = inject(UiState);
  private readonly effects = inject(HOME_LANDING_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly portfolio = PORTFOLIO;
  protected readonly assets = HOME_ASSETS;
  protected readonly launchers = HOME_LAUNCHERS;
  protected readonly content = computed(() => HOME_PROFILE_CONTENT[this.profile()]);
  protected readonly profileTitle = computed(
    () => EXPLORER_PROFILES.find((p) => p.id === this.profile())?.title,
  );

  constructor() {
    afterNextRender(() => {
      const scope = this.element.nativeElement;
      const cleanup = this.effects.createMotionContext(scope, () => this.effects.revealHome(scope));
      this.destroyRef.onDestroy(cleanup);
    });
  }

  protected switchProfile(): void {
    this.state.setMenuOpen(false);
    this.state.setCursorMode('default');
    this.state.selectProfile(null);
  }
}
