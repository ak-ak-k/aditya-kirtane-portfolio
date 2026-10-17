import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS, findProject, ProjectSummary } from '../projects.config';
import type { ProjectList } from './project-list';

let ListComponent: typeof import('./project-list').ProjectList;
let effectsToken: typeof import('./projects-effects').PROJECTS_EFFECTS;
const animate = vi.fn(),
  cleanup = vi.fn();
let motion = false;
describe('AK Originals showcase', () => {
  let fixture: ComponentFixture<ProjectList>;
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
    ListComponent = (await import('./project-list')).ProjectList;
    effectsToken = (await import('./projects-effects')).PROJECTS_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.clearAllMocks();
    motion = false;
    TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        provideRouter([]),
        {
          provide: effectsToken,
          useValue: {
            createMotionContext: (_scope: HTMLElement, callback: () => void) => {
              if (motion) callback();
              return cleanup;
            },
            animateProjects: animate,
          },
        },
      ],
    });
  });
  afterEach(() => fixture?.destroy());
  function render(): HTMLElement {
    fixture = TestBed.createComponent(ListComponent);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  it('renders the real page with one H1 and honest artwork disclosure', () => {
    const el = render();
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('AK Originals');
    expect(el.querySelector('.eyebrow')?.textContent).toBe('Featured builds');
    expect(el.querySelector('app-route-placeholder')).toBeNull();
    expect(el.querySelector('.artwork-note')?.textContent).toContain(
      'project artwork, not product screenshots',
    );
    expect(el.querySelector('.projects-count')?.textContent).toContain(String(PROJECTS.length));
  });
  it('renders one decorative two-digit cover index per project in the unchanged catalog order', () => {
    const cards = Array.from(render().querySelectorAll('[data-project-entry]'));
    expect(cards).toHaveLength(6);
    expect(
      cards.map((card) => [
        card.querySelector('h2')?.textContent,
        card.getAttribute('data-project-entry'),
        card.querySelector('.project-number')?.textContent,
      ]),
    ).toEqual([
      ['SlingSip', 'slingsip', '01'],
      ['Ready Inventory', 'ready-inventory', '02'],
      ['Ready Salesman', 'ready-salesman', '03'],
      ['Customer Portal', 'customer-portal', '04'],
      ['911Care', '911care', '05'],
      ['CollabSpace', 'collabspace', '06'],
    ]);
    for (const card of cards) {
      expect(card.querySelectorAll('.project-number')).toHaveLength(1);
      const number = card.querySelector('.project-artwork .project-number')!;
      expect(number.getAttribute('aria-hidden')).toBe('true');
      expect(number.hasAttribute('tabindex')).toBe(false);
      expect(card.querySelector('.project-body .project-number')).toBeNull();
      // Index remains real text even when cover artwork cannot load.
      card.querySelector('.cover-image')?.remove();
      expect(number.textContent).toMatch(/^\d{2}$/);
      expect(card.querySelector('a')?.getAttribute('href')).toBe(
        '/projects/' + card.getAttribute('data-project-entry'),
      );
    }
  });
  it('formats array indices without a duplicate sequence configuration', async () => {
    const { formatProjectIndex } = await import('./project-list');
    expect([0, 1, 5, 8, 9, 10].map(formatProjectIndex)).toEqual([
      '01',
      '02',
      '06',
      '09',
      '10',
      '11',
    ]);
  });
  it('keeps catalog slugs unique, closed asset paths aligned, and compact tags/highlights sourced', () => {
    const catalog: readonly ProjectSummary[] = PROJECTS;
    expect(new Set(catalog.map((p) => p.slug)).size).toBe(catalog.length);
    for (const p of catalog) {
      expect(p.detailRoute).toBe('/projects/' + p.slug);
      expect(p.coverAsset).toBe(`assets/projects/covers/${p.slug}-cover.webp`);
      expect(p.iconAsset).toBe(`assets/projects/${p.slug}.svg`);
      expect(p.technologies.length).toBeGreaterThanOrEqual(p.type === 'Portfolio entry' ? 0 : 3);
      expect(p.technologies.length).toBeLessThanOrEqual(5);
      expect(new Set(p.technologies).size).toBe(p.technologies.length);
      expect(p.highlights.length).toBeGreaterThanOrEqual(p.type === 'Portfolio entry' ? 0 : 1);
      expect(p.highlights.length).toBeLessThanOrEqual(2);
      expect(p.sourceNote.length).toBeGreaterThan(20);
      expect(findProject(p.slug)).toBe(p);
    }
    expect(findProject('unknown')).toBeUndefined();
    expect(findProject('toString')).toBeUndefined();
    expect(findProject('../ready-inventory')).toBeUndefined();
    expect(findProject('Ready-Inventory')).toBeUndefined();
  });
  it.each(PROJECTS)('renders the supported $name summary and one primary internal link', (p) => {
    const article = render().querySelector(`[data-project-entry="${p.slug}"]`)!;
    expect(article.querySelector('h2')?.textContent).toBe(p.name);
    expect(article.textContent).toContain(p.shortDescription);
    expect(article.textContent).toContain(p.type);
    expect(
      Array.from(article.querySelectorAll('.project-highlights li'), (e) => e.textContent),
    ).toEqual([...p.highlights]);
    expect(Array.from(article.querySelectorAll('.project-tags li'), (e) => e.textContent)).toEqual([
      ...p.technologies,
    ]);
    expect(article.querySelectorAll('a')).toHaveLength(1);
    const link = article.querySelector('a')!;
    expect(link.getAttribute('href')).toBe(p.detailRoute);
    expect(link.getAttribute('data-cursor')).toBe('project');
    expect(link.getAttribute('aria-labelledby')).toBe(`${p.slug}-title ${p.slug}-action`);
    expect(article.querySelector('a a,button,[role="button"]')).toBeNull();
  });
  it('uses reserved, lazy artwork with meaningful alts and decorative project icons', () => {
    const el = render();
    for (const p of PROJECTS) {
      const article = el.querySelector(`[data-project-entry="${p.slug}"]`)!;
      const cover = article.querySelector<HTMLImageElement>('.cover-image')!;
      expect(cover.alt).toBe(p.name + ' project cover artwork');
      expect(cover.alt).not.toMatch(/screenshot/i);
      expect(cover.width).toBe(1600);
      expect(cover.height).toBe(900);
      expect(cover.getAttribute('loading')).toBe(
        PROJECTS.findIndex((entry) => entry.slug === p.slug) < 2 ? 'eager' : 'lazy',
      );
      expect(article.querySelector<HTMLImageElement>('.project-icon')?.alt).toBe('');
      expect(article.querySelector('.artwork-label')?.getAttribute('aria-hidden')).toBe('true');
    }
    expect(el.innerHTML).not.toMatch(/references\/|images\/aditya\/|companies\//);
  });
  it('omits invented URLs and achievement numbers and exposes only genuine route actions', () => {
    const el = render();
    expect(
      el.querySelector('a[href^="http"],a[href="#"],[disabled],[aria-disabled],progress,meter'),
    ).toBeNull();
    expect(el.textContent).not.toMatch(/\d+\s*%|500\+|20\+|6\+|Resume p\d/);
    expect(el.querySelectorAll('.projects-contact a')).toHaveLength(1);
    expect(el.querySelector('.projects-contact a')?.getAttribute('href')).toBe('/contact');
  });
  it('keeps final cards present without starting animation in the reduced-motion path', () => {
    const el = render();
    expect(animate).not.toHaveBeenCalled();
    expect(el.querySelectorAll('article')).toHaveLength(PROJECTS.length);
    expect(el.querySelector('[style*="opacity"]')).toBeNull();
  });
  it('scopes motion to the host and disposes owned work exactly once', () => {
    motion = true;
    const el = render();
    expect(animate).toHaveBeenCalledWith(el);
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
