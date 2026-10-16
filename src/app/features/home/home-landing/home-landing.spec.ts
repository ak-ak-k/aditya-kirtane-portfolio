import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UiState } from '../../../core/services/ui-state';
import { EXPLORER_PROFILES } from '../../../core/constants/explorer-profiles';
import type { Home } from '../home';
import { HOME_ASSETS, HOME_PROFILE_CONTENT } from './home-landing.config';

let HomeComponent: typeof import('../home').Home;
let effectsToken: typeof import('./home-landing-effects').HOME_LANDING_EFFECTS;
const cleanup = vi.fn();
const revealHome = vi.fn();
let motion = false;

describe('Main Home', () => {
  let fixture: ComponentFixture<Home>;
  beforeAll(async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((media: string) => ({
        matches: false,
        media,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );
    HomeComponent = (await import('../home')).Home;
    effectsToken = (await import('./home-landing-effects')).HOME_LANDING_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.clearAllMocks();
    motion = false;
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: effectsToken,
          useValue: {
            createMotionContext: (_scope: HTMLElement, animate: () => void) => {
              if (motion) animate();
              return cleanup;
            },
            revealHome,
          },
        },
      ],
    });
    TestBed.inject(UiState).completeIntro();
  });
  afterEach(() => fixture?.destroy());
  function render(): HTMLElement {
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  it.each(EXPLORER_PROFILES)(
    'resolves the $title perspective with one semantic hero',
    (profile) => {
      TestBed.inject(UiState).selectProfile(profile.id);
      const element = render();
      const content = HOME_PROFILE_CONTENT[profile.id];
      expect(element.querySelector('app-home-landing')).not.toBeNull();
      expect(element.querySelector('app-explorer')).toBeNull();
      expect(element.querySelectorAll('h1')).toHaveLength(1);
      expect(element.querySelector('h1')?.textContent?.trim()).toBe('Aditya Kirtane');
      expect(element.textContent).toContain(content.eyebrow);
      expect(element.textContent).toContain(content.headlineAccent);
      expect(element.textContent).toContain(content.supportingText);
      expect(element.querySelector('.profile-controls')?.textContent).toContain(profile.title);
    },
  );
  it('keeps Main Home hidden while the profile is null', () => {
    const element = render();
    expect(element.querySelector('app-home-landing')).toBeNull();
    expect(element.querySelector('app-explorer')).not.toBeNull();
  });
  it('switches back to Explorer without replaying Intro or retaining transient state', () => {
    const state = TestBed.inject(UiState);
    state.selectProfile('angular-engineer');
    const element = render();
    state.setMenuOpen(true);
    state.setCursorMode('project');
    const button = element.querySelector<HTMLButtonElement>('.profile-controls button');
    expect(button?.type).toBe('button');
    expect(button?.tabIndex).toBe(0);
    button?.click();
    TestBed.tick();
    expect(state.selectedProfile()).toBeNull();
    expect(state.introCompleted()).toBe(true);
    expect(state.menuOpen()).toBe(false);
    expect(state.cursorMode()).toBe('default');
    expect(element.querySelector('app-explorer')).not.toBeNull();
    expect(element.querySelector('app-intro')).toBeNull();
  });
  it('uses existing routes, one approved portrait, and a deliberate PDF download', () => {
    TestBed.inject(UiState).selectProfile('resume-viewer');
    const element = render();
    expect(element.querySelector('img')?.getAttribute('src')).toBe(HOME_ASSETS.portrait);
    expect(element.querySelector('img')?.getAttribute('alt')).toContain('head-and-chest');
    expect(
      Array.from(element.querySelectorAll('.launcher-grid a:not([download])'), (a) =>
        a.getAttribute('href'),
      ),
    ).toEqual(['/about', '/experience', '/skills', '/projects']);
    expect(element.querySelector('a.btn--primary')?.getAttribute('href')).toBe('/projects');
    expect(element.querySelector('a.btn--secondary')?.getAttribute('href')).toBe('/about');
    const downloads = Array.from(element.querySelectorAll('a[download]'));
    expect(downloads).toHaveLength(2);
    expect(downloads.every((a) => a.getAttribute('href') === HOME_ASSETS.resume)).toBe(true);
    expect(element.querySelector('iframe,embed')).toBeNull();
  });
  it('shows reduced-motion content without invoking the entrance animation', () => {
    TestBed.inject(UiState).selectProfile('product-thinker');
    const element = render();
    expect(element.querySelector('h1')).not.toBeNull();
    expect(revealHome).not.toHaveBeenCalled();
  });
  it('scopes entrance animation and releases it when destroyed', () => {
    motion = true;
    TestBed.inject(UiState).selectProfile('full-stack-builder');
    const element = render();
    expect(revealHome).toHaveBeenCalledWith(element.querySelector('app-home-landing'));
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
