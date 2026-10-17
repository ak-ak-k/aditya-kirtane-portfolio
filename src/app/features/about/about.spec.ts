import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  ABOUT_ASSETS,
  ABOUT_DOMAINS,
  ABOUT_INTRO,
  ABOUT_STATS,
  ABOUT_STRENGTHS,
  ABOUT_TECH,
} from './about.config';
import { UiState } from '../../core/services/ui-state';
import type { About } from './about';

let AboutComponent: typeof import('./about').About;
let effectsToken: typeof import('./about-effects').ABOUT_EFFECTS;
const cleanup = vi.fn(),
  animate = vi.fn();
let motion = false;
describe('The full story', () => {
  let fixture: ComponentFixture<About>;
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
    AboutComponent = (await import('./about')).About;
    effectsToken = (await import('./about-effects')).ABOUT_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.clearAllMocks();
    motion = false;
    TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        provideRouter([]),
        {
          provide: effectsToken,
          useValue: {
            createMotionContext: (_scope: HTMLElement, callback: () => void) => {
              if (motion) callback();
              return cleanup;
            },
            animateAbout: animate,
          },
        },
      ],
    });
  });
  afterEach(() => fixture?.destroy());
  function render(): HTMLElement {
    fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  it('renders one real H1 and the verified introduction instead of a placeholder', () => {
    const el = render();
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('The full story');
    expect(el.querySelector('app-route-placeholder')).toBeNull();
    for (const paragraph of ABOUT_INTRO) expect(el.textContent).toContain(paragraph);
  });
  it('uses only the approved real head/chest portrait with meaningful alt and reserved fill frame', () => {
    const el = render();
    const images = el.querySelectorAll('img');
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute('src')).toBe(ABOUT_ASSETS.portrait);
    expect(images[0].alt).toContain('head-and-chest');
    expect(images[0].hasAttribute('ng-img')).toBe(true);
    expect(images[0].parentElement?.classList.contains('portrait')).toBe(true);
    expect(
      el.querySelector('img[src*="original"],img[src*="upper"],img[src*="references"]'),
    ).toBeNull();
  });
  it('links Projects and the verified PDF through native anchors without automatic actions', () => {
    const el = render();
    expect(el.querySelector('.btn--primary')?.getAttribute('href')).toBe('/projects');
    const resume = el.querySelector('a[download]');
    expect(resume?.getAttribute('href')).toBe('assets/resume/aditya-kirtane-resume.pdf');
    expect(resume?.textContent).toContain('PDF');
    expect(el.querySelector('iframe,embed,button,[role="button"]')).toBeNull();
  });
  it('renders the seven technologies from config with native list semantics', () => {
    const el = render();
    expect(Array.from(el.querySelectorAll('.about-tech > li'), (li) => li.textContent)).toEqual([
      ...ABOUT_TECH,
    ]);
    expect([...ABOUT_TECH]).toEqual([
      'Angular',
      'TypeScript',
      'RxJS',
      'Node.js',
      'MongoDB',
      'React Native',
      'Ionic',
    ]);
  });
  it('publishes supported metrics and provenance without a fabricated project count', () => {
    const el = render();
    expect(ABOUT_STATS.map((s) => s.value)).toEqual(['4+', 'Production', 'Web · Mobile', 'Mumbai']);
    expect(ABOUT_STATS.every((s) => s.source.startsWith('Resume p1'))).toBe(true);
    expect(el.textContent).not.toMatch(/20\+|Projects delivered/);
    expect(el.querySelectorAll('dl > div')).toHaveLength(4);
    expect(el.querySelectorAll('[aria-live], [role="status"]')).toHaveLength(0);
    expect(el.textContent).not.toContain('Resume p1');
  });
  it('limits domains to resume-backed professional work', () => {
    const el = render();
    expect(ABOUT_DOMAINS.map((d) => d.id)).toEqual([
      'healthcare',
      'finance',
      'crm',
      'inventory',
      'customer-platforms',
      'field-sales',
    ]);
    expect(ABOUT_DOMAINS.every((d) => d.source.startsWith('Resume p1'))).toBe(true);
    expect(el.querySelectorAll('.domain-card')).toHaveLength(6);
    for (const domain of ABOUT_DOMAINS) {
      expect(el.textContent).toContain(domain.title);
      expect(el.textContent).toContain(domain.description);
    }
    expect(el.textContent).not.toMatch(/Travel|Hospitality|Media & Entertainment/);
  });
  it('has logical section/card headings and non-interactive strength cards without ratings', () => {
    const el = render();
    expect(el.querySelectorAll('h2')).toHaveLength(4);
    expect(el.querySelectorAll('h3')).toHaveLength(6);
    expect(
      Array.from(el.querySelectorAll('.strength-list li'), (li) => li.textContent?.trim()),
    ).toEqual([...ABOUT_STRENGTHS]);
    expect(
      el.querySelector(
        'meter,progress,[role="slider"],.domain-card[tabindex],.strength-card[tabindex]',
      ),
    ).toBeNull();
    expect(el.querySelector('.bg-layer')?.getAttribute('aria-hidden')).toBe('true');
  });
  it('leaves intro completion intact while rendering the story', () => {
    const state = TestBed.inject(UiState);
    state.completeIntro();
    const el = render();
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('The full story');
    expect(state.introCompleted()).toBe(true);
  });
  it('shows all semantic content without animation in reduced motion', () => {
    const el = render();
    expect(animate).not.toHaveBeenCalled();
    expect(el.querySelectorAll('[data-about-reveal]')).toHaveLength(18);
    expect(el.querySelector('.about-stat dd')?.textContent).toBe('4+');
  });
  it('scopes normal-motion setup and releases it once on destruction', () => {
    motion = true;
    const el = render();
    expect(animate).toHaveBeenCalledWith(el);
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
