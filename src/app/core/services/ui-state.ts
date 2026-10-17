import { computed, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NAVIGATION } from '../constants/portfolio';
import { CursorMode, PortfolioSection } from '../models/ui-state';

@Service()
export class UiState {
  private readonly router = inject(Router);
  private readonly route = signal<ActivatedRouteSnapshot | null>(null);
  private readonly intro = signal(false);
  private readonly menu = signal(false);
  private readonly cursor = signal<CursorMode>('default');

  readonly introCompleted = this.intro.asReadonly();
  readonly menuOpen = this.menu.asReadonly();
  readonly cursorMode = this.cursor.asReadonly();

  readonly activeSection = computed<PortfolioSection>(() => {
    const section: unknown = this.route()?.data['section'];
    return NAVIGATION.find((item) => item.id === section)?.id ?? 'home';
  });

  // The route owns project selection. Full project data belongs to the projects feature.
  readonly selectedProject = computed(() =>
    this.activeSection() === 'projects' ? (this.route()?.paramMap.get('slug') ?? null) : null,
  );

  constructor() {
    this.syncRoute();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.syncRoute();
        this.menu.set(false);
        this.cursor.set('default');
      });
  }

  completeIntro(): void {
    this.intro.set(true);
  }

  setMenuOpen(open: boolean): void {
    this.menu.set(open);
  }

  toggleMenu(): void {
    this.menu.update((open) => !open);
  }

  setCursorMode(mode: CursorMode): void {
    this.cursor.set(mode);
  }

  private syncRoute(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    this.route.set(route);
  }
}
