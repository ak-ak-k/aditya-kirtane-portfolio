import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import { UiState } from '../../core/services/ui-state';
import {
  PAGE_TRANSITION_EFFECTS,
  ROUTE_MOTION_QUERY,
  RouteTransitionAnimator,
} from './page-transition-effects';

function pathname(url: string): string {
  return url.split(/[?#]/)[0];
}
function isPortfolioPath(path: string): boolean {
  return /^\/(?:about|experience|skills|contact|projects(?:\/[^/]+)?)?$/.test(path);
}

@Component({
  selector: 'app-page-transition',
  templateUrl: './page-transition.html',
  styleUrl: './page-transition.scss',
})
export class PageTransition {
  protected readonly active = signal(false);
  private readonly router = inject(Router);
  private readonly state = inject(UiState);
  private readonly effects = inject(PAGE_TRANSITION_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private animator: RouteTransitionAnimator | undefined;
  private generation = 0;
  private pendingId: number | null = null;
  private phase: 'idle' | 'loading' | 'settling' = 'idle';
  private watchdog: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    afterNextRender(() => {
      const media = window.matchMedia(ROUTE_MOTION_QUERY);
      let hasNavigated = this.router.navigated;
      let currentPath = pathname(this.router.url);
      const preferenceChanged = () => {
        if (!media.matches) this.reset();
      };
      media.addEventListener('change', preferenceChanged);
      const subscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.reset();
          const destination = pathname(event.url);
          const specialHome =
            (currentPath === '/' || destination === '/') && !this.state.introCompleted();
          if (
            !hasNavigated ||
            !media.matches ||
            currentPath === destination ||
            specialHome ||
            !isPortfolioPath(currentPath) ||
            !isPortfolioPath(destination)
          )
            return;
          this.pendingId = event.id;
          this.phase = 'loading';
          this.active.set(true);
          this.state.setCursorMode('default');
          this.watchdog = setTimeout(() => this.reset(), 1500);
          const generation = this.generation;
          if (this.animator) this.animator.start();
          else
            void this.effects
              .loadAnimator()
              .then((create) => {
                if (this.destroyRef.destroyed || generation !== this.generation || !media.matches)
                  return;
                this.animator = create(this.element.nativeElement, () => this.reset());
                this.animator.start();
                if (this.phase === 'settling') this.animator.finish();
              })
              .catch(() => {
                if (generation === this.generation) this.reset();
              });
        } else if (event instanceof NavigationEnd) {
          hasNavigated = true;
          currentPath = pathname(event.urlAfterRedirects);
          if (this.pendingId !== event.id) return;
          // Router never waits for animation. Fast navigations can finish during the lazy import.
          this.phase = 'settling';
          this.animator?.finish();
        } else if (
          event instanceof NavigationCancel ||
          event instanceof NavigationError ||
          event instanceof NavigationSkipped
        ) {
          if (this.pendingId === event.id) this.reset();
        }
      });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
        media.removeEventListener('change', preferenceChanged);
        this.reset();
        this.animator?.destroy();
        this.animator = undefined;
      });
    });
  }
  private reset(): void {
    this.generation++;
    this.pendingId = null;
    this.phase = 'idle';
    clearTimeout(this.watchdog);
    this.watchdog = undefined;
    this.animator?.reset();
    this.active.set(false);
  }
}
