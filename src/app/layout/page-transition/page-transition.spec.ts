import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';
import { Subject } from 'rxjs';
import { UiState } from '../../core/services/ui-state';
import { PageTransition } from './page-transition';
import { PAGE_TRANSITION_EFFECTS } from './page-transition-effects';

describe('Global route transitions', () => {
  let fixture: ComponentFixture<PageTransition>;
  let events: Subject<RouterEvent>;
  let motion = true;
  let preferenceChanged: (() => void) | undefined;
  let complete: (() => void) | undefined;
  const animator = { start: vi.fn(), finish: vi.fn(), reset: vi.fn(), destroy: vi.fn() };
  const create = vi.fn((_scope: HTMLElement, done: () => void) => {
    complete = done;
    return animator;
  });
  const load = vi.fn(() => Promise.resolve(create));
  const removeListener = vi.fn();
  const state = {
    introCompleted: signal(true),
    setCursorMode: vi.fn(),
  };
  const router = { navigated: true, url: '/about', events: new Subject<RouterEvent>() };
  beforeEach(() => {
    vi.clearAllMocks();
    motion = true;
    complete = undefined;
    preferenceChanged = undefined;
    events = new Subject<RouterEvent>();
    router.events = events;
    router.navigated = true;
    router.url = '/about';
    state.introCompleted.set(true);
    load.mockImplementation(() => Promise.resolve(create));
    vi.stubGlobal(
      'matchMedia',
      vi.fn((media: string) => ({
        get matches() {
          return motion;
        },
        media,
        addEventListener: (_name: string, listener: () => void) => (preferenceChanged = listener),
        removeEventListener: removeListener,
      })),
    );
    TestBed.configureTestingModule({
      imports: [PageTransition],
      providers: [
        { provide: Router, useValue: router },
        { provide: UiState, useValue: state },
        { provide: PAGE_TRANSITION_EFFECTS, useValue: { loadAnimator: load } },
      ],
    });
  });
  afterEach(() => {
    fixture?.destroy();
    vi.unstubAllGlobals();
  });
  function render(): HTMLElement {
    fixture = TestBed.createComponent(PageTransition);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  function emit(event: RouterEvent) {
    if (event instanceof NavigationEnd) router.url = event.urlAfterRedirects;
    events.next(event);
    TestBed.tick();
  }
  async function flush() {
    await Promise.resolve();
    TestBed.tick();
    await Promise.resolve();
    TestBed.tick();
  }
  function active() {
    return !!(fixture.nativeElement as HTMLElement).querySelector('.is-active');
  }
  it('does not animate the initial direct app load', async () => {
    router.navigated = false;
    router.url = '/';
    render();
    emit(new NavigationStart(1, '/about'));
    emit(new NavigationEnd(1, '/about', '/about'));
    await flush();
    expect(load).not.toHaveBeenCalled();
    expect(active()).toBe(false);
    emit(new NavigationStart(2, '/experience'));
    await flush();
    expect(animator.start).toHaveBeenCalledTimes(1);
  });
  it('starts normal client navigation and resets after its successful exit animation', async () => {
    const el = render();
    emit(new NavigationStart(2, '/experience'));
    expect(active()).toBe(true);
    await flush();
    expect(create).toHaveBeenCalledWith(el, expect.any(Function));
    expect(animator.start).toHaveBeenCalledTimes(1);
    expect(state.setCursorMode).toHaveBeenCalledWith('default');
    emit(new NavigationEnd(2, '/experience', '/experience'));
    expect(animator.finish).toHaveBeenCalledTimes(1);
    complete?.();
    TestBed.tick();
    expect(active()).toBe(false);
  });
  it('handles a fast completed navigation before its lazy animator resolves', async () => {
    let resolve: ((value: typeof create) => void) | undefined;
    load.mockImplementation(() => new Promise((r) => (resolve = r)));
    render();
    emit(new NavigationStart(3, '/contact'));
    emit(new NavigationEnd(3, '/contact', '/contact'));
    expect(active()).toBe(true);
    resolve?.(create);
    await flush();
    expect(animator.start).toHaveBeenCalledTimes(1);
    expect(animator.finish).toHaveBeenCalledTimes(1);
    complete?.();
    TestBed.tick();
    expect(active()).toBe(false);
  });
  it('bypasses motion entirely when reduced motion or forced colors disallow it', async () => {
    motion = false;
    render();
    emit(new NavigationStart(2, '/contact'));
    emit(new NavigationEnd(2, '/contact', '/contact'));
    await flush();
    expect(load).not.toHaveBeenCalled();
    expect(active()).toBe(false);
  });
  it.each(['cancel', 'error', 'skip'])('recovers immediately from navigation %s', async (kind) => {
    render();
    emit(new NavigationStart(2, '/skills'));
    await flush();
    if (kind === 'cancel') emit(new NavigationCancel(2, '/skills', 'Guard rejected'));
    if (kind === 'error') emit(new NavigationError(2, '/skills', new Error('Failed navigation')));
    if (kind === 'skip') emit(new NavigationSkipped(2, '/skills', 'Skipped'));
    expect(active()).toBe(false);
    expect(animator.reset).toHaveBeenCalled();
  });
  it('ignores stale cancellation and prevents outdated lazy imports from creating animators', async () => {
    const resolvers: ((value: typeof create) => void)[] = [];
    load.mockImplementation(() => new Promise((r) => resolvers.push(r)));
    render();
    emit(new NavigationStart(2, '/skills'));
    emit(new NavigationStart(3, '/contact'));
    emit(new NavigationCancel(2, '/skills', 'Superseded'));
    resolvers[0]?.(create);
    await flush();
    expect(create).not.toHaveBeenCalled();
    expect(active()).toBe(true);
    resolvers[1]?.(create);
    await flush();
    expect(create).toHaveBeenCalledTimes(1);
    emit(new NavigationEnd(3, '/contact', '/contact'));
    expect(animator.finish).toHaveBeenCalledTimes(1);
  });
  it('resets safely if lazy loading fails', async () => {
    load.mockRejectedValue(new Error('Chunk failed'));
    render();
    emit(new NavigationStart(2, '/contact'));
    await flush();
    expect(active()).toBe(false);
    expect(create).not.toHaveBeenCalled();
  });
  it('cancels an active sweep when motion preference changes', async () => {
    render();
    emit(new NavigationStart(2, '/skills'));
    await flush();
    motion = false;
    preferenceChanged?.();
    TestBed.tick();
    expect(active()).toBe(false);
    expect(animator.reset).toHaveBeenCalled();
  });
  it('does not animate same-path fragment/query changes or development-only routes', async () => {
    render();
    emit(new NavigationStart(2, '/about#strengths'));
    emit(new NavigationEnd(2, '/about#strengths', '/about#strengths'));
    emit(new NavigationStart(3, '/about?view=full'));
    emit(new NavigationEnd(3, '/about?view=full', '/about?view=full'));
    emit(new NavigationStart(4, '/design-system'));
    await flush();
    expect(load).not.toHaveBeenCalled();
  });
  it('does not respond to internal Home intro state changes or entering its special flow', async () => {
    router.url = '/';
    render();
    state.introCompleted.set(false);
    TestBed.tick();
    expect(load).not.toHaveBeenCalled();
    emit(new NavigationStart(2, '/about'));
    await flush();
    expect(load).not.toHaveBeenCalled();
  });
  it('keeps Intro-to-Home internal, then enables ordinary Home navigation without profile state', async () => {
    router.url = '/';
    state.introCompleted.set(false);
    render();
    state.introCompleted.set(true);
    TestBed.tick();
    expect(load).not.toHaveBeenCalled();
    expect(active()).toBe(false);
    emit(new NavigationStart(2, '/about'));
    await flush();
    expect(animator.start).toHaveBeenCalledTimes(1);
  });
  it('supports popstate Back/Forward and same-component project slug navigation', async () => {
    router.url = '/projects/slingsip';
    render();
    emit(new NavigationStart(2, '/projects/ready-inventory'));
    await flush();
    emit(new NavigationEnd(2, '/projects/ready-inventory', '/projects/ready-inventory'));
    complete?.();
    emit(new NavigationStart(3, '/projects/slingsip', 'popstate', { navigationId: 1 }));
    await flush();
    emit(new NavigationEnd(3, '/projects/slingsip', '/projects/slingsip'));
    complete?.();
    expect(animator.start).toHaveBeenCalledTimes(2);
    expect(animator.finish).toHaveBeenCalledTimes(2);
    TestBed.tick();
    expect(active()).toBe(false);
  });
  it('keeps its decoration unfocusable and never moves the current focus', async () => {
    const button = document.createElement('button');
    document.body.append(button);
    const el = render();
    button.focus();
    emit(new NavigationStart(2, '/skills'));
    await flush();
    expect(el.querySelector('.route-transition')?.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelector('[tabindex],button,a,[aria-live]')).toBeNull();
    expect(document.activeElement).toBe(button);
    button.remove();
  });
  it('unsubscribes, clears pending work and rejects imports after destruction', async () => {
    let resolve: ((value: typeof create) => void) | undefined;
    load.mockImplementation(() => new Promise((r) => (resolve = r)));
    render();
    emit(new NavigationStart(2, '/contact'));
    fixture.destroy();
    resolve?.(create);
    await flush();
    expect(create).not.toHaveBeenCalled();
    expect(removeListener).toHaveBeenCalledWith('change', expect.any(Function));
    events.next(new NavigationStart(3, '/skills'));
    expect(load).toHaveBeenCalledTimes(1);
  });
  it('destroys the loaded animator with the layout component', async () => {
    render();
    emit(new NavigationStart(2, '/contact'));
    await flush();
    fixture.destroy();
    expect(animator.destroy).toHaveBeenCalledTimes(1);
  });

  it('clears the decoration if navigation or its animator never completes', async () => {
    render();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      emit(new NavigationStart(2, '/contact'));
      await flush();
      expect(active()).toBe(true);
      vi.runOnlyPendingTimers();
      TestBed.tick();
      expect(active()).toBe(false);
      expect(animator.reset).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
