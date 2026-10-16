import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EXPLORER_PROFILES } from '../../../core/constants/explorer-profiles';
import { ExplorerProfile } from '../../../core/models/ui-state';
import { UiState } from '../../../core/services/ui-state';
import type { Home } from '../home';
import { EXPLORER_ASSETS } from './explorer.config';

type ExplorerEffects = {
  createMotionContext: typeof import('../../../animations/create-motion-context').createMotionContext;
  playExplorerEntrance: typeof import('./explorer-animation').playExplorerEntrance;
  playExplorerSelection: typeof import('./explorer-animation').playExplorerSelection;
};
type MotionContext = Parameters<Parameters<ExplorerEffects['createMotionContext']>[1]>[0];
let HomeComponent: typeof import('../home').Home;
let effectsToken: typeof import('./explorer-effects').EXPLORER_EFFECTS;
const control = {
  motion: true,
  finish: undefined as (() => void) | undefined,
  mediaCleanup: undefined as (() => void) | undefined,
  cleanup: vi.fn(),
  killEntrance: vi.fn(),
};
const effects: ExplorerEffects = {
  createMotionContext: vi.fn((_scope, animate) => {
    const context = { add: (callback: () => void) => callback() } as unknown as MotionContext;
    const cleanup = control.motion ? animate(context) : undefined;
    control.mediaCleanup = cleanup ?? undefined;
    return control.cleanup;
  }),
  playExplorerEntrance: vi.fn(() => ({ kill: control.killEntrance })),
  playExplorerSelection: vi.fn((_scope, _profile, onComplete) => {
    control.finish = onComplete;
  }),
};

describe('Explorer profile selection', () => {
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
    effectsToken = (await import('./explorer-effects')).EXPLORER_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    vi.clearAllMocks();
    control.motion = true;
    control.finish = undefined;
    control.mediaCleanup = undefined;
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), { provide: effectsToken, useValue: effects }],
    });
    TestBed.inject(UiState).completeIntro();
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

  function card(element: HTMLElement, profile: ExplorerProfile): HTMLButtonElement {
    const button = element.querySelector<HTMLButtonElement>(
      `[data-profile-panel="${profile}"] > button`,
    );
    if (!button) throw new Error(`Missing profile card: ${profile}`);
    return button;
  }

  it('defines exactly the four intended profiles with stable unique IDs', () => {
    expect(EXPLORER_PROFILES.map(({ id, title }) => [id, title])).toEqual([
      ['angular-engineer', 'Angular Engineer'],
      ['full-stack-builder', 'Full Stack Builder'],
      ['product-thinker', 'Product Thinker'],
      ['resume-viewer', 'Resume Viewer'],
    ]);
    expect(new Set(EXPLORER_PROFILES.map(({ id }) => id)).size).toBe(4);
  });

  it('appears after intro completion while no completed profile is selected', () => {
    const element = render();
    expect(element.querySelector('app-intro')).toBeNull();
    expect(element.querySelector('app-explorer')).not.toBeNull();
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Who’s Exploring?');
    expect(element.querySelectorAll('button.profile-card')).toHaveLength(4);
  });

  it('exposes each title and description through one native, focusable button', () => {
    const element = render();
    for (const profile of EXPLORER_PROFILES) {
      const button = card(element, profile.id);
      expect(button.type).toBe('button');
      expect(button.tabIndex).toBe(0);
      expect(button.querySelector('button, a, input')).toBeNull();
      expect(button.querySelector('.profile-title')?.textContent?.trim()).toBe(profile.title);
      expect(button.hasAttribute('aria-label')).toBe(false);
      expect(button.hasAttribute('aria-labelledby')).toBe(false);
      expect(element.querySelector(`#${profile.id}-description`)?.textContent).toBe(
        profile.description,
      );
      button.focus();
      expect(document.activeElement).toBe(button);
    }
  });

  it('reuses the approved head/chest asset and does not introduce full-body images', () => {
    const element = render();
    const portraits = Array.from(
      element.querySelectorAll<HTMLImageElement>('.profile-portrait img'),
    );
    expect(portraits).toHaveLength(4);
    expect(new Set(portraits.map((image) => image.getAttribute('src')))).toEqual(
      new Set([EXPLORER_ASSETS.portrait]),
    );
    expect(element.querySelector('img[src*="original"], img[src*="portrait-upper"]')).toBeNull();
  });

  it.each(EXPLORER_PROFILES)('commits $title only when its transition finishes', (profile) => {
    const state = TestBed.inject(UiState);
    const select = vi.spyOn(state, 'selectProfile');
    const element = render();
    card(element, profile.id).click();
    TestBed.tick();
    expect(state.selectedProfile()).toBeNull();
    expect(card(element, profile.id).getAttribute('aria-busy')).toBe('true');
    expect(effects.playExplorerSelection).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      profile.id,
      expect.any(Function),
    );
    control.finish?.();
    TestBed.tick();
    expect(select).toHaveBeenCalledExactlyOnceWith(profile.id);
    expect(element.querySelector('app-explorer')).toBeNull();
    expect(element.querySelector('app-home-landing')).not.toBeNull();
    expect(element.querySelector('.profile-controls')?.textContent).toContain(profile.title);
  });

  it('ignores double activation and competing cards until the first choice commits', () => {
    const select = vi.spyOn(TestBed.inject(UiState), 'selectProfile');
    const element = render();
    card(element, 'angular-engineer').click();
    card(element, 'angular-engineer').click();
    card(element, 'resume-viewer').click();
    expect(control.killEntrance).toHaveBeenCalledTimes(1);
    expect(effects.playExplorerSelection).toHaveBeenCalledTimes(1);
    control.finish?.();
    control.finish?.();
    vi.runAllTimers();
    expect(select).toHaveBeenCalledExactlyOnceWith('angular-engineer');
  });

  it('selects immediately in reduced motion without depending on an animation callback', () => {
    control.motion = false;
    const element = render();
    card(element, 'product-thinker').click();
    expect(TestBed.inject(UiState).selectedProfile()).toBe('product-thinker');
    expect(effects.playExplorerEntrance).not.toHaveBeenCalled();
    expect(effects.playExplorerSelection).not.toHaveBeenCalled();
  });

  it('does not turn Resume Viewer into a download or navigation action', () => {
    control.motion = false;
    const element = render();
    const resume = card(element, 'resume-viewer');
    expect(resume.hasAttribute('download')).toBe(false);
    expect(resume.hasAttribute('href')).toBe(false);
    resume.click();
    expect(TestBed.inject(UiState).selectedProfile()).toBe('resume-viewer');
    expect(element.querySelector('a[download], iframe, embed')).toBeNull();
  });

  it('renders Main Home for a saved profile without recreating Explorer', () => {
    TestBed.inject(UiState).selectProfile('full-stack-builder');
    const element = render();
    expect(element.querySelector('app-explorer')).toBeNull();
    expect(element.querySelector('.profile-controls')?.textContent).toContain('Full Stack Builder');
    expect(effects.playExplorerEntrance).not.toHaveBeenCalled();
  });

  it('responds to an external profile choice and preserves it against a late callback', () => {
    const state = TestBed.inject(UiState);
    const element = render();
    card(element, 'angular-engineer').click();
    state.selectProfile('resume-viewer');
    TestBed.tick();
    control.finish?.();
    expect(state.selectedProfile()).toBe('resume-viewer');
    expect(element.querySelector('.profile-controls')?.textContent).toContain('Resume Viewer');
    expect(control.cleanup).toHaveBeenCalledTimes(1);
  });

  it('prevents late state mutation and clears timers when destroyed mid-selection', () => {
    const select = vi.spyOn(TestBed.inject(UiState), 'selectProfile');
    const element = render();
    card(element, 'angular-engineer').click();
    fixture.destroy();
    control.finish?.();
    vi.runAllTimers();
    expect(select).not.toHaveBeenCalled();
    expect(control.cleanup).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('commits once if the transition callback is interrupted', () => {
    const select = vi.spyOn(TestBed.inject(UiState), 'selectProfile');
    const element = render();
    card(element, 'full-stack-builder').click();
    vi.runAllTimers();
    control.finish?.();
    expect(select).toHaveBeenCalledExactlyOnceWith('full-stack-builder');
  });

  it('finishes a pending selection when reduced motion reverts its context', () => {
    const select = vi.spyOn(TestBed.inject(UiState), 'selectProfile');
    const element = render();
    card(element, 'product-thinker').click();
    control.mediaCleanup?.();
    control.finish?.();
    expect(select).toHaveBeenCalledExactlyOnceWith('product-thinker');
  });
});
