import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS, ALL_PROJECTS, PORTFOLIO_PROJECT } from '../projects.config';
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
  it('maps seven standard and one special uniquely identified case studies to the catalog in its curated order', () => {
    expect(PROJECTS.map((p) => p.slug)).toEqual([
      'slingsip',
      'nexbuy',
      'collabspace',
      'ready-inventory',
      'ready-salesman',
      'customer-portal',
      '911care',
    ]);
    expect(new Set(CASE_STUDIES.map((p) => p.slug))).toEqual(
      new Set(ALL_PROJECTS.map((p) => p.slug)),
    );
    expect(new Set(CASE_STUDIES.map((p) => p.slug)).size).toBe(8);
    expect(CASE_STUDIES.every((p) => p.sourceNotes.length > 0)).toBe(true);
    expect(getProjectDetail('unknown')).toBeNull();
    expect(getProjectDetail('__proto__')).toBeNull();
  });
  it.each(ALL_PROJECTS)(
    'renders the $name case study with one H1 and only its current artwork',
    (project) => {
      const el = render(project.slug);
      const view = getProjectDetail(project.slug)!;
      expect(el.querySelectorAll('h1')).toHaveLength(1);
      expect(el.querySelector('h1')?.textContent).toBe(project.name);
      expect(el.textContent).toContain(view.study.overview);
      expect(el.textContent).toContain(project.type);
      expect(el.querySelector('app-route-placeholder,video,iframe,canvas')).toBeNull();
      const gallery = view.study.followUpSections?.find((section) => section.kind === 'gallery');
      expect(el.querySelectorAll('img')).toHaveLength(
        1 + (gallery?.kind === 'gallery' ? gallery.images.length : 0),
      );
      const image = el.querySelector('img')!;
      expect(image.getAttribute('src')).toBe(project.coverAsset);
      expect(image.alt).toBe(project.visual?.alt ?? project.name + ' project cover artwork');
      expect(image.width).toBe(project.visual?.width ?? 1600);
      expect(image.height).toBe(project.visual?.height ?? 900);
      expect(el.querySelector('figcaption')?.textContent?.trim()).toBe(
        project.visual ? 'Application screenshot' : 'Project artwork',
      );
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
  it('publishes the verified frontend prototype with a complete semantic case study', () => {
    const view = getProjectDetail('collabspace')!;
    const el = render('collabspace');
    expect(view.summary.ownership).toBe('personal');
    expect(view.summary.status).toBe('prototype');
    expect(view.summary.statusLabel).toBe('Frontend Prototype');
    expect(el.querySelector('h1')?.textContent).toBe('CollabSpace');
    expect(el.textContent).toContain('Angular Collaboration Workspace Prototype');
    expect(Array.from(el.querySelectorAll('h2'), (e) => e.textContent?.trim())).toEqual([
      'Overview',
      'The Problem',
      'The Approach',
      'Independent Engineering Project',
      'Core Features',
      'Engineering With Modern Angular',
      'Application Architecture',
      'UI Screenshot Gallery',
      'PWA and Offline Experience',
      'Testing and Quality',
      'Current Limitations',
      'Future Roadmap',
    ]);
    expect(el.querySelectorAll('.case-point')).toHaveLength(6);
    expect(el.querySelectorAll('[data-case-section]')).toHaveLength(13);
    expect(el.textContent).toContain('zoneless change detection');
    expect(el.textContent).toContain('Signal Forms');
    expect(view.study.metric).toBeUndefined();
    expect(view.study.outcome).toBeUndefined();
  });
  it('separates the implemented browser architecture from a planned backend', () => {
    const el = render('collabspace');
    expect(Array.from(el.querySelectorAll('.flow-list h3'), (e) => e.textContent)).toEqual([
      'Angular Router',
      'Feature Components',
      'State Services',
      'Mock Data Services',
      'Built-in Demo Data',
    ]);
    expect(el.querySelector('.flow-note')?.textContent).toContain('Simulated RxJS events');
    expect(el.querySelector('.flow-note--planned')?.textContent).toContain(
      'Future Backend Integration',
    );
    expect(el.querySelector('.flow-note--planned')?.textContent).toContain(
      'Planned / Not Yet Implemented',
    );
    expect(el.querySelector('[data-study-section="collabspace-approach"]')?.textContent).toContain(
      'browser-side',
    );
  });
  it('renders six local lazy gallery images with dimensions, captions and full-size links', () => {
    const el = render('collabspace');
    const figures = Array.from(el.querySelectorAll('.gallery-grid figure'));
    expect(figures).toHaveLength(6);
    expect(figures.map((f) => f.querySelector('img')?.getAttribute('src'))).toEqual([
      'assets/projects/screenshots/collabspace/02-dashboard.webp',
      'assets/projects/screenshots/collabspace/03-messages-thread.webp',
      'assets/projects/screenshots/collabspace/05-tasks-board.webp',
      'assets/projects/screenshots/collabspace/06-task-details.webp',
      'assets/projects/screenshots/collabspace/10-roles-permissions.webp',
      'assets/projects/screenshots/collabspace/14-mobile-messages.webp',
    ]);
    for (const f of figures) {
      const img = f.querySelector('img')!,
        link = f.querySelector('a')!;
      expect(img.alt.length).toBeGreaterThan(20);
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.width).toBeGreaterThan(0);
      expect(img.height).toBeGreaterThan(0);
      expect(f.querySelector('figcaption')?.textContent?.length).toBeGreaterThan(30);
      expect(link.getAttribute('href')).toBe(img.getAttribute('src'));
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
    expect(el.querySelector('.case-artwork--screenshot')).not.toBeNull();
    expect(el.querySelector('.case-artwork--identity')).toBeNull();
    expect(el.querySelector('a a,button,iframe,video,canvas')).toBeNull();
  });
  it('qualifies simulations, offline limits and the dated testing snapshot', () => {
    const el = render('collabspace');
    const pwa = el.querySelector('[data-study-section="collabspace-pwa"]')!.textContent!;
    expect(pwa).toContain('in-memory');
    expect(pwa).toContain('Reloading can discard');
    expect(pwa).toContain('not been verified on a physical device');
    const testing = el.querySelector('[data-study-section="collabspace-testing"]')!.textContent!;
    expect(testing).toContain('22 October 2026');
    expect(testing).toContain('600 unit tests across 166 spec files');
    expect(testing).toContain('There is no E2E suite or coverage reporting');
    const limits = el.querySelector('[data-study-section="collabspace-limitations"]')!.textContent!;
    expect(limits).toContain(
      'No backend API integration, real authentication, server-side permissions or real-time messaging server',
    );
    expect(limits).toContain('not durably persisted');
    expect(limits).toContain('static in-browser index');
    expect(el.querySelector('[data-study-section="collabspace-roadmap"]')?.textContent).toContain(
      'Planned / Not Yet Implemented',
    );
    const messaging = Array.from(el.querySelectorAll('.case-point')).find((card) =>
      card.textContent?.includes('Messaging and Threads'),
    )!;
    expect(messaging.textContent).toContain('simulated with timers');
  });
  it('keeps CollabSpace actions and neighbors correct with static reduced-motion content', () => {
    const el = render('collabspace');
    expect(animate).not.toHaveBeenCalled();
    expect(el.querySelector('[style*="opacity"]')).toBeNull();
    expect(Array.from(el.querySelectorAll('.case-intro a'), (a) => a.getAttribute('href'))).toEqual(
      [
        'https://collab-space-frontend-tau.vercel.app/login',
        'https://github.com/ak-ak-k/CollabSpace-Frontend',
      ],
    );
    for (const a of el.querySelectorAll('.case-intro a')) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    }
    expect(
      Array.from(el.querySelectorAll('.case-navigation a'), (a) => a.getAttribute('href')),
    ).toEqual(['/projects/nexbuy', '/projects/ready-inventory']);
  });
  it('keeps the CollabSpace gallery off unrelated project routes', () => {
    const el = render('nexbuy');
    expect(el.querySelector('.gallery-grid,app-case-study-section')).toBeNull();
    expect(el.querySelector('img[src*="screenshots/collabspace"]')).toBeNull();
  });
  it('provides the special architecture case study without standard previous/next navigation', () => {
    const view = getProjectDetail('ak-portfolio')!;
    expect(view.summary).toBe(PORTFOLIO_PROJECT);
    expect(view.previous).toBeNull();
    expect(view.next).toBeNull();
    const el = render('ak-portfolio');
    expect(el.querySelector('.case-navigation,.project-number')).toBeNull();
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/projects');
    expect(el.textContent).toContain('Scoped motion');
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
    expect(Array.from(el.querySelectorAll('h2'), (e) => e.textContent?.trim())).toEqual([
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
  it('uses only verified HTTPS destinations with safe external attributes', () => {
    const studies: readonly ProjectCaseStudy[] = CASE_STUDIES;
    const links = studies.flatMap((p) => p.links?.map((l) => l.url) ?? []);
    expect(links).toContain('https://github.com/ak-ak-k/ShoppingFrontend');
    expect(links).toContain('https://shoppingfrontend-topaz.vercel.app/');
    expect(links).toContain('https://github.com/ak-ak-k/aditya-kirtane-portfolio');
    expect(links.every((url) => url.startsWith('https://'))).toBe(true);
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
