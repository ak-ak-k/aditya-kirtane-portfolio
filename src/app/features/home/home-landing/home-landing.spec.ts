import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UiState } from '../../../core/services/ui-state';
import type { Home } from '../home';
import { HOME_ASSETS, HOME_CONTENT } from './home-landing.config';

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
  it('renders canonical engineering content with no profile-selection UI', () => {
    const element = render();
    expect(element.querySelector('app-home-landing')).not.toBeNull();
    expect(element.querySelector('app-intro,app-explorer')).toBeNull();
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Aditya Kirtane');
    expect(element.textContent).toContain(HOME_CONTENT.eyebrow);
    expect(element.textContent).toContain(HOME_CONTENT.headlineAccent);
    expect(element.textContent).toContain(HOME_CONTENT.supportingText);
    expect(element.querySelector('.hero-subtitle')?.textContent).toBe('Angular Developer');
    expect(element.textContent).toContain(
      '4+ years building scalable web, mobile, and product experiences.',
    );
    expect(element.textContent).not.toMatch(
      /who.s exploring|switch profile|exploring as|product builder/i,
    );
    expect(element.querySelector('.profile-controls,[data-profile-panel]')).toBeNull();
  });
  it('uses existing routes, one approved portrait, and a deliberate PDF download', () => {
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
    const element = render();
    expect(element.querySelector('h1')).not.toBeNull();
    expect(revealHome).not.toHaveBeenCalled();
  });
  it('scopes entrance animation and releases it when destroyed', () => {
    motion = true;
    const element = render();
    expect(revealHome).toHaveBeenCalledWith(element.querySelector('app-home-landing'));
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
