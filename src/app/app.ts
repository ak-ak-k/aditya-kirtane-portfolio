import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UiState } from './core/services/ui-state';
import { Navbar } from './layout/navbar/navbar';
import { Cursor } from './layout/cursor/cursor';
import { PageTransition } from './layout/page-transition/page-transition';

@Component({
  imports: [Navbar, RouterOutlet, Cursor, PageTransition, RouterLink],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly uiState = inject(UiState);
  private readonly router = inject(Router);
  private readonly mainContent = viewChild<ElementRef<HTMLElement>>('mainContent');
  private lastHomeView: 'intro' | 'explorer' | 'landing' | undefined;
  protected readonly routeActivated = signal<unknown>(null);
  protected focusMainContent(): void {
    this.mainContent()?.nativeElement.focus({ preventScroll: true });
  }
  private readonly homeActive = computed(() => {
    this.routeActivated();
    this.uiState.activeSection();
    return this.router.url.split(/[?#]/)[0] === '/';
  });
  protected readonly introActive = computed(
    () => this.homeActive() && !this.uiState.introCompleted(),
  );
  protected readonly explorerActive = computed(
    () => this.homeActive() && this.uiState.introCompleted() && !this.uiState.selectedProfile(),
  );
  protected readonly landingActive = computed(
    () => this.homeActive() && this.uiState.introCompleted() && !!this.uiState.selectedProfile(),
  );

  constructor() {
    afterRenderEffect(() => {
      if (!this.routeActivated()) {
        return;
      }

      this.uiState.activeSection();
      this.uiState.selectedProject();
      this.introActive();
      this.explorerActive();
      this.uiState.selectedProfile();

      if (this.homeActive()) {
        const view = this.introActive() ? 'intro' : this.explorerActive() ? 'explorer' : 'landing';
        // Internal Home views share a URL, so router scroll restoration does not run.
        if (this.lastHomeView && this.lastHomeView !== view) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        this.lastHomeView = view;
      }

      const main = this.mainContent()?.nativeElement;
      const target = main?.querySelector<HTMLElement>('h1') ?? main;
      target?.focus({ preventScroll: true });
    });
  }
}
