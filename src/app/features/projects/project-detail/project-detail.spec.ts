import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../projects.config';
import { CASE_STUDIES, getProjectDetail, ProjectCaseStudy } from './project-detail.config';
import type { ProjectDetail } from './project-detail';

let DetailComponent: typeof import('./project-detail').ProjectDetail;
let effectsToken: typeof import('./project-detail-effects').PROJECT_DETAIL_EFFECTS;
const animate = vi.fn(),
  cleanup = vi.fn();
let motion = false;
describe('Project case studies', () => {
  let fixture: ComponentFixture<ProjectDetail>;
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
    DetailComponent = (await import('./project-detail')).ProjectDetail;
    effectsToken = (await import('./project-detail-effects')).PROJECT_DETAIL_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.clearAllMocks();
    motion = false;
    TestBed.configureTestingModule({
      imports: [DetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: effectsToken,
          useValue: {
            createMotionContext: (_scope: HTMLElement, callback: () => void) => {
              if (motion) callback();
              return cleanup;
            },
            animateProjectDetail: animate,
          },
        },
      ],
    });
  });
  afterEach(() => fixture?.destroy());
  function render(slug: string): HTMLElement {
    fixture = TestBed.createComponent(DetailComponent);
    fixture.componentRef.setInput('slug', slug);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  it('maps exactly six uniquely identified case studies to the catalog in its curated order', () => {
    expect(PROJECTS.map((p) => p.slug)).toEqual([
      'slingsip',
      'ready-inventory',
      'ready-salesman',
      'customer-portal',
      '911care',
      'collabspace',
    ]);
    expect(CASE_STUDIES.map((p) => p.slug)).toEqual(PROJECTS.map((p) => p.slug));
    expect(new Set(CASE_STUDIES.map((p) => p.slug)).size).toBe(6);
    expect(CASE_STUDIES.every((p) => p.sourceNotes.length > 0)).toBe(true);
    expect(getProjectDetail('unknown')).toBeNull();
    expect(getProjectDetail('__proto__')).toBeNull();
  });
  it.each(PROJECTS)(
    'renders the $name case study with one H1 and only its current artwork',
    (project) => {
      const el = render(project.slug);
      const view = getProjectDetail(project.slug)!;
      expect(el.querySelectorAll('h1')).toHaveLength(1);
      expect(el.querySelector('h1')?.textContent).toBe(project.name);
      expect(el.textContent).toContain(view.study.overview);
      expect(el.textContent).toContain(project.type);
      expect(el.querySelector('app-route-placeholder,video,iframe,canvas')).toBeNull();
      expect(el.querySelectorAll('img')).toHaveLength(1);
      const image = el.querySelector('img')!;
      expect(image.getAttribute('src')).toBe(project.coverAsset);
      expect(image.alt).toBe(project.name + ' project cover artwork');
      expect(image.width).toBe(1600);
      expect(image.height).toBe(900);
      expect(el.querySelector('figcaption')?.textContent).toBe('Project artwork');
      expect(Array.from(el.querySelectorAll('.case-tags li'), (e) => e.textContent)).toEqual([
        ...project.technologies,
      ]);
      expect(el.querySelector('a')?.getAttribute('href')).toBe('/projects');
      expect(el.querySelector('a a,button,[role="button"],.case-point[tabindex]')).toBeNull();
      for (const other of PROJECTS.filter((p) => p.slug !== project.slug))
        expect(el.querySelector(`img[src="${other.coverAsset}"]`)).toBeNull();
    },
  );
  it('derives previous and next routes from the catalog with no invented neighbors at its ends', () => {
    for (const [index, p] of PROJECTS.entries()) {
      const view = getProjectDetail(p.slug)!;
      expect(view.previous?.slug ?? null).toBe(PROJECTS[index - 1]?.slug ?? null);
      expect(view.next?.slug ?? null).toBe(PROJECTS[index + 1]?.slug ?? null);
    }
    const el = render('ready-salesman');
    expect(
      Array.from(el.querySelectorAll('.case-navigation a'), (a) => a.getAttribute('href')),
    ).toEqual(['/projects/ready-inventory', '/projects/customer-portal']);
  });
  it('omits unverified technical sections and classifications from identity-only entries', () => {
    for (const slug of ['slingsip', 'collabspace']) {
      const view = getProjectDetail(slug)!;
      expect(view.summary.type).toBe('Portfolio entry');
      expect(view.summary.technologies).toHaveLength(0);
      expect(view.study.role).toBeUndefined();
      expect(view.study.architecture).toBeUndefined();
      expect(view.study.metric).toBeUndefined();
      expect(view.study.links).toBeUndefined();
    }
    const el = render('slingsip');
    expect(Array.from(el.querySelectorAll('h2'), (e) => e.textContent)).toEqual(['Overview']);
    expect(el.textContent).not.toMatch(
      /Electron|scheduler|IPC|Windows|Prototype|production|hydration/i,
    );
  });
  it('keeps metrics attributed only to Customer Portal and avoids unsupported challenge stories', () => {
    const studies: readonly ProjectCaseStudy[] = CASE_STUDIES;
    expect(studies.filter((p) => p.metric).map((p) => p.slug)).toEqual(['customer-portal']);
    expect(getProjectDetail('customer-portal')?.study.metric?.title).toBe('35%');
    const el = render('customer-portal');
    expect(el.querySelector('dd')?.textContent).toBe('35%');
    expect(el.textContent).not.toMatch(/500\+|25%|15%|10K|99%|Challenges|increased revenue/i);
    expect(getProjectDetail('ready-salesman')?.study.architecture).toHaveLength(4);
  });
  it('renders conditional professional sections with semantic H2/H3 structure and normal cards', () => {
    const el = render('ready-salesman');
    expect(Array.from(el.querySelectorAll('h2'), (e) => e.textContent)).toEqual([
      'Overview',
      'My role',
      'Key features',
      'Engineering highlights',
      'System components',
      'Outcome',
    ]);
    expect(el.querySelectorAll('.case-point')).toHaveLength(4);
    expect(el.querySelectorAll('.architecture-map li')).toHaveLength(4);
    expect(el.querySelector('.architecture-map')?.getAttribute('role')).toBe('list');
    expect(el.querySelector('[aria-live],.case-point[tabindex]')).toBeNull();
  });
  it('uses only the three source-verified HTTPS destinations with safe external attributes', () => {
    const studies: readonly ProjectCaseStudy[] = CASE_STUDIES;
    expect(studies.flatMap((p) => p.links?.map((l) => l.url) ?? [])).toEqual([
      'https://readybusiness.in/',
      'https://customerportal.readybusiness.in',
      'https://play.google.com/store/apps/details?id=com.fch.care911&hl=en_IN',
    ]);
    const el = render('911care');
    const link = el.querySelector('a[href^="https"]')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('data-cursor')).toBe('open');
    expect(link.textContent).toContain('opens in a new tab');
    expect(el.querySelector('a[href*="github"],a[href="#"],[disabled],[aria-disabled]')).toBeNull();
  });
  it('renders a safe unknown state without loading another project image', () => {
    const el = render('missing');
    expect(el.querySelector('h1')?.textContent).toBe('Project not found');
    expect(el.querySelector('img,app-route-placeholder')).toBeNull();
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/projects');
    expect(animate).not.toHaveBeenCalled();
  });
  it('leaves all final content available on the reduced-motion path', () => {
    const el = render('ready-inventory');
    expect(animate).not.toHaveBeenCalled();
    expect(el.querySelectorAll('[data-case-section]').length).toBeGreaterThan(4);
    expect(el.querySelector('[style*="opacity"]')).toBeNull();
  });
  it('cleans motion on slug reuse, unknown navigation, and destruction without retaining old content', () => {
    motion = true;
    const el = render('ready-inventory');
    expect(animate).toHaveBeenCalledWith(el);
    fixture.componentRef.setInput('slug', 'ready-salesman');
    fixture.detectChanges();
    TestBed.tick();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(animate).toHaveBeenCalledTimes(2);
    expect(el.querySelector('h1')?.textContent).toBe('Ready Salesman');
    fixture.componentRef.setInput('slug', 'unknown');
    fixture.detectChanges();
    TestBed.tick();
    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(el.querySelector('h1')?.textContent).toBe('Project not found');
    fixture.componentRef.setInput('slug', '911care');
    fixture.detectChanges();
    TestBed.tick();
    expect(animate).toHaveBeenCalledTimes(3);
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(3);
  });
});
