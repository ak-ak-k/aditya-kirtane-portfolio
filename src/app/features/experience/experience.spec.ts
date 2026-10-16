import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Experience } from './experience';
import { CareerRole, EXPERIENCE_ROLES } from './experience.config';

let ExperienceComponent: typeof import('./experience').Experience;
let effectsToken: typeof import('./experience-effects').EXPERIENCE_EFFECTS;
const cleanup = vi.fn(),
  animate = vi.fn();
let motion = false;
describe('Top moments', () => {
  let fixture: ComponentFixture<Experience>;
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
    ExperienceComponent = (await import('./experience')).Experience;
    effectsToken = (await import('./experience-effects')).EXPERIENCE_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.clearAllMocks();
    motion = false;
    TestBed.configureTestingModule({
      imports: [ExperienceComponent],
      providers: [
        {
          provide: effectsToken,
          useValue: {
            createMotionContext: (_scope: HTMLElement, callback: () => void) => {
              if (motion) callback();
              return cleanup;
            },
            animateExperience: animate,
          },
        },
      ],
    });
  });
  afterEach(() => fixture?.destroy());
  function render(): HTMLElement {
    fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  it('replaces the placeholder with one real title and a concise introduction', () => {
    const el = render();
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Top moments');
    expect(el.querySelector('app-route-placeholder')).toBeNull();
    expect(el.textContent).toContain(
      'A timeline of the roles, products, and milestones that shaped my journey.',
    );
  });
  it('defines exactly the three resume-verified companies, roles, and newest-first order', () => {
    expect(EXPERIENCE_ROLES.map((e) => [e.sequenceNumber, e.company, e.role])).toEqual([
      ['01', 'Onelife Capital Advisors Limited', 'Angular Developer — MEAN Stack'],
      ['02', 'Refr', 'Frontend Developer — Angular'],
      ['03', 'The Contrast', 'Angular Developer Intern'],
    ]);
    const el = render();
    expect(el.querySelectorAll('article')).toHaveLength(3);
    expect(
      Array.from(el.querySelectorAll('[data-career-entry]'), (e) =>
        e.getAttribute('data-career-entry'),
      ),
    ).toEqual(['onelife', 'refr', 'the-contrast']);
  });
  it('publishes resume dates, not reference-image dates, using valid month values', () => {
    const roles: readonly CareerRole[] = EXPERIENCE_ROLES;
    expect(roles.map((e) => [e.startDate.label, e.endDate?.label ?? 'Present'])).toEqual([
      ['May 2023', 'Present'],
      ['April 2022', 'May 2023'],
      ['October 2021', 'April 2022'],
    ]);
    const el = render();
    expect(Array.from(el.querySelectorAll('time'), (e) => e.getAttribute('datetime'))).toEqual([
      '2023-05',
      '2022-04',
      '2023-05',
      '2021-10',
      '2022-04',
    ]);
    expect(el.querySelector('time[datetime="Present"]')).toBeNull();
    expect(el.textContent).not.toMatch(/December 2021|August 2024|September 2024/);
  });
  it('renders a semantic ordered timeline with company/role headings and hidden decoration', () => {
    const el = render();
    expect(el.querySelector('ol')?.getAttribute('aria-label')).toContain('most recent first');
    expect(el.querySelectorAll('article h2')).toHaveLength(3);
    for (const e of EXPERIENCE_ROLES)
      expect(el.querySelector(`#${e.id}-company`)?.textContent).toContain(e.role);
    const decoration = el.querySelectorAll(
      '.timeline-node,.timeline-line,.career-index,.company-initials',
    );
    expect(decoration.length).toBe(11);
    expect(Array.from(decoration).every((e) => e.getAttribute('aria-hidden') === 'true')).toBe(
      true,
    );
    expect(el.querySelector('article[tabindex],article[role="button"],button,a')).toBeNull();
  });
  it('uses plain initials without presenting placeholder or invented logos as official', () => {
    const el = render();
    expect(Array.from(el.querySelectorAll('.company-initials'), (e) => e.textContent)).toEqual([
      'OL',
      'R',
      'TC',
    ]);
    expect(el.querySelector('img,svg,canvas,video')).toBeNull();
    expect(el.innerHTML).not.toContain('placeholder.svg');
    expect(el.innerHTML).not.toContain('references/');
  });
  it.each(EXPERIENCE_ROLES)(
    'renders the supported highlights and compact tags for $company',
    (entry) => {
      const el = render();
      const article = el.querySelector(`[data-career-entry="${entry.id}"] article`)!;
      expect(
        Array.from(article.querySelectorAll('.career-highlights li'), (e) => e.textContent),
      ).toEqual(entry.highlights.map((h) => h.text));
      expect(entry.highlights.length).toBeGreaterThanOrEqual(3);
      expect(entry.highlights.length).toBeLessThanOrEqual(5);
      expect(
        Array.from(article.querySelectorAll('ul[aria-label] li'), (e) => e.textContent),
      ).toEqual([...entry.technologies]);
      expect(entry.technologies.length).toBeGreaterThanOrEqual(3);
      expect(entry.technologies.length).toBeLessThanOrEqual(6);
      expect(entry.highlights.every((h) => h.source.startsWith('Resume p1'))).toBe(true);
      for (const project of entry.projects) expect(article.textContent).toContain(project);
    },
  );
  it('attributes metrics only to the supported role and avoids ambiguous performance claims', () => {
    const el = render();
    const onelife = el.querySelector('[data-career-entry="onelife"]')!,
      refr = el.querySelector('[data-career-entry="refr"]')!,
      intern = el.querySelector('[data-career-entry="the-contrast"]')!;
    expect(Array.from(onelife.querySelectorAll('dd'), (e) => e.textContent)).toEqual(['3', '500+']);
    expect(Array.from(refr.querySelectorAll('dd'), (e) => e.textContent)).toEqual(['15%']);
    expect(intern.querySelector('dl')).toBeNull();
    expect(onelife.textContent).not.toContain('15%');
    expect(refr.textContent).not.toContain('500+');
    expect(el.textContent).not.toMatch(/25%|35%|20\+/);
    expect(el.textContent).not.toContain('Resume p1');
    expect(el.querySelector('[aria-live],[role="status"]')).toBeNull();
  });
  it('keeps all final information and decorations in the reduced-motion path', () => {
    const el = render();
    expect(animate).not.toHaveBeenCalled();
    expect(el.querySelectorAll('[data-career-node]')).toHaveLength(3);
    expect(el.querySelectorAll('[data-career-line]')).toHaveLength(2);
    expect(el.querySelectorAll('[data-career-card]')).toHaveLength(3);
  });
  it('scopes animation setup and cleans it once on component destruction', () => {
    motion = true;
    const el = render();
    expect(animate).toHaveBeenCalledWith(el);
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
