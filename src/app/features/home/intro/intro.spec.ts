import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UiState } from '../../../core/services/ui-state';
import type { Home } from '../home';
import { INTRO_ASSETS } from './intro.config';

type IntroEffects = {
  createMotionContext: typeof import('../../../animations/create-motion-context').createMotionContext;
  waitForCriticalImages: typeof import('./critical-images').waitForCriticalImages;
  playIntroReveal: typeof import('./intro-animation').playIntroReveal;
  playIntroExit: typeof import('./intro-animation').playIntroExit;
};
type MotionContext = Parameters<Parameters<IntroEffects['createMotionContext']>[1]>[0];

let HomeComponent: typeof import('../home').Home;
let effectsToken: typeof import('./intro-effects').INTRO_EFFECTS;
const control = {
  motion: true,
  ready: undefined as (() => void) | undefined,
  reveal: undefined as (() => void) | undefined,
  exit: undefined as (() => void) | undefined,
  mediaCleanup: undefined as (() => void) | undefined,
  cleanup: vi.fn(),
};
const effects: IntroEffects = {
  createMotionContext: vi.fn((_scope, animate) => {
    const context = { add: (callback: () => void) => callback() } as unknown as MotionContext;
    const cleanup = control.motion ? animate(context) : undefined;
    control.mediaCleanup = cleanup ?? undefined;
    return control.cleanup;
  }),
  waitForCriticalImages: vi.fn(
    () =>
      new Promise<void>((resolve) => {
        control.ready = resolve;
      }),
  ),
  playIntroReveal: vi.fn((_scope, onComplete) => {
    control.reveal = onComplete;
  }),
  playIntroExit: vi.fn((_scope, onComplete) => {
    control.exit = onComplete;
  }),
};

describe('Home introduction', () => {
  let fixture: ComponentFixture<Home>;

  beforeAll(async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((media: string) => ({
        matches: false,
        media,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    HomeComponent = (await import('../home')).Home;
    effectsToken = (await import('./intro-effects')).INTRO_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    vi.clearAllMocks();
    control.motion = true;
    control.ready = undefined;
    control.reveal = undefined;
    control.exit = undefined;
    control.mediaCleanup = undefined;
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), { provide: effectsToken, useValue: effects }],
    });
  });

  afterEach(() => {
    fixture?.destroy();
    vi.useRealTimers();
  });

  function render(): HTMLElement {
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }

  async function resolveAssets(): Promise<void> {
    control.ready?.();
    await Promise.resolve();
    TestBed.tick();
  }

  it('initially displays one meaningful intro heading with a keyboard-accessible skip button', () => {
    const element = render();
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.getAttribute('aria-label')).toBe('Aditya Kirtane');
    expect(element.querySelector<HTMLButtonElement>('.intro-skip')?.type).toBe('button');
    expect(element.querySelector('app-intro')).not.toBeNull();
    expect(element.querySelector('.intro-subtitle')?.textContent).toBe('Angular Developer');
    expect(element.querySelector('app-explorer')).toBeNull();
  });

  it('uses only the approved head/chest portrait and actual branding as critical images', () => {
    const element = render();
    const portrait = element.querySelector<HTMLImageElement>('.portrait img');
    expect(portrait?.getAttribute('src')).toBe(INTRO_ASSETS.portrait);
    expect(portrait?.getAttribute('alt')).toContain('head and chest');
    expect(element.querySelector('.intro-logo')?.getAttribute('src')).toBe(INTRO_ASSETS.logo);
    expect(vi.mocked(effects.waitForCriticalImages).mock.calls[0]?.[0]).toHaveLength(2);
  });

  it('shows Home directly when UiState already reports intro completion', () => {
    TestBed.inject(UiState).completeIntro();
    const element = render();
    expect(element.querySelector('app-intro')).toBeNull();
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Aditya Kirtane');
    expect(effects.playIntroReveal).not.toHaveBeenCalled();
  });

  it('also hides an active intro when the existing shared state changes externally', () => {
    const element = render();
    TestBed.inject(UiState).completeIntro();
    TestBed.tick();
    expect(element.querySelector('app-intro')).toBeNull();
    expect(control.cleanup).toHaveBeenCalledTimes(1);
  });

  it('Skip Intro completes immediately without waiting for images or animation', () => {
    const state = TestBed.inject(UiState);
    const complete = vi.spyOn(state, 'completeIntro');
    const element = render();
    element.querySelector<HTMLButtonElement>('.intro-skip')?.click();
    TestBed.tick();
    expect(state.introCompleted()).toBe(true);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Aditya Kirtane');
  });

  it('waits for the cinematic reveal even when assets are already ready', async () => {
    render();
    await resolveAssets();
    expect(effects.playIntroExit).not.toHaveBeenCalled();
    control.reveal?.();
    expect(effects.playIntroExit).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(UiState).introCompleted()).toBe(false);
    control.exit?.();
    expect(TestBed.inject(UiState).introCompleted()).toBe(true);
    TestBed.tick();
    expect(fixture.nativeElement.querySelector('app-home-landing')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-explorer')).toBeNull();
  });

  it('waits for real image readiness after the reveal finishes', async () => {
    const complete = vi.spyOn(TestBed.inject(UiState), 'completeIntro');
    render();
    control.reveal?.();
    expect(effects.playIntroExit).not.toHaveBeenCalled();
    await resolveAssets();
    expect(effects.playIntroExit).toHaveBeenCalledTimes(1);
    control.exit?.();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('provides native indeterminate progress until critical image checks settle', async () => {
    const element = render();
    const progress = element.querySelector('progress');
    expect(progress?.hasAttribute('value')).toBe(false);
    expect(progress?.getAttribute('aria-label')).toBe('Introduction preparation');
    expect(progress?.getAttribute('max')).toBe('1');
    await resolveAssets();
    expect(progress?.getAttribute('value')).toBe('1');
    expect(progress?.getAttribute('aria-valuetext')).toContain('Image checks complete');
  });

  it('uses a short static reduced-motion path without a cinematic or exit timeline', async () => {
    control.motion = false;
    render();
    await resolveAssets();
    expect(effects.playIntroReveal).not.toHaveBeenCalled();
    vi.advanceTimersToNextTimer();
    expect(TestBed.inject(UiState).introCompleted()).toBe(true);
    expect(effects.playIntroExit).not.toHaveBeenCalled();
  });

  it('releases the visitor at the safety timeout if images never settle', () => {
    const complete = vi.spyOn(TestBed.inject(UiState), 'completeIntro');
    render();
    vi.runAllTimers();
    expect(complete).toHaveBeenCalledTimes(1);
    expect(TestBed.inject(UiState).introCompleted()).toBe(true);
  });

  it('does not duplicate completion when exit, skip, timeout, and late readiness race', async () => {
    const complete = vi.spyOn(TestBed.inject(UiState), 'completeIntro');
    const element = render();
    await resolveAssets();
    control.reveal?.();
    control.reveal?.();
    expect(effects.playIntroExit).toHaveBeenCalledTimes(1);
    element.querySelector<HTMLButtonElement>('.intro-skip')?.click();
    control.exit?.();
    control.exit?.();
    vi.runAllTimers();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('ignores late readiness and animation callbacks after destruction', async () => {
    const complete = vi.spyOn(TestBed.inject(UiState), 'completeIntro');
    render();
    fixture.destroy();
    await resolveAssets();
    control.reveal?.();
    control.exit?.();
    vi.runAllTimers();
    expect(complete).not.toHaveBeenCalled();
    expect(control.cleanup).toHaveBeenCalledTimes(1);
  });

  it('finishes with static content if the motion context reverts after a preference change', async () => {
    render();
    await resolveAssets();
    control.mediaCleanup?.();
    vi.advanceTimersToNextTimer();
    expect(TestBed.inject(UiState).introCompleted()).toBe(true);
    expect(effects.playIntroExit).not.toHaveBeenCalled();
  });
});
