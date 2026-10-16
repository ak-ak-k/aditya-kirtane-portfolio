import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVIGATION, PORTFOLIO } from '../../core/constants/portfolio';
import { UiState } from '../../core/services/ui-state';

export const DESKTOP_NAV_QUERY = '(min-width: 64rem)';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  host: {
    '(keydown.escape)': 'closeMenu($event)',
    '(focusout)': 'onFocusOut($event)',
    '[class.is-scrolled]': 'scrolled()',
  },
})
export class Navbar {
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');
  protected readonly state = inject(UiState);
  protected readonly portfolio = PORTFOLIO;
  protected readonly navigation = NAVIGATION;
  protected readonly scrolled = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.state.setMenuOpen(false));
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 24);
      const desktop = window.matchMedia(DESKTOP_NAV_QUERY);
      const onResize = () => {
        if (desktop.matches) this.state.setMenuOpen(false);
      };
      onScroll();
      onResize();
      window.addEventListener('scroll', onScroll, { passive: true });
      desktop.addEventListener('change', onResize);
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        desktop.removeEventListener('change', onResize);
      });
    });
  }

  protected closeMenu(event: Event): void {
    if (!this.state.menuOpen()) return;
    event.preventDefault();
    this.state.setMenuOpen(false);
    this.menuToggle()?.nativeElement.focus({ preventScroll: true });
  }

  protected onFocusOut(event: FocusEvent): void {
    if (
      !(event.relatedTarget instanceof Node) ||
      !this.element.nativeElement.contains(event.relatedTarget)
    ) {
      this.state.setMenuOpen(false);
    }
  }
}
