import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appConfig } from './app.config';
import { UiState } from './core/services/ui-state';
import { PROJECTS, ALL_PROJECTS } from './features/projects/projects.config';

let ProjectDetail: typeof import('./features/projects/project-detail/project-detail').ProjectDetail;

describe('Portfolio routing', () => {
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
    ProjectDetail = (await import('./features/projects/project-detail/project-detail'))
      .ProjectDetail;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    TestBed.inject(UiState).completeIntro();
  });

  it.each([
    ['/', 'Aditya Kirtane', 'home', 'Aditya Kirtane'],
    ['/about', 'The full story', 'about', 'About | Aditya Kirtane'],
    ['/experience', 'Top moments', 'experience', 'Experience | Aditya Kirtane'],
    ['/skills', 'My skill universe', 'skills', 'Skills | Aditya Kirtane'],
    ['/projects', 'AK Originals', 'projects', 'Projects | Aditya Kirtane'],
    ...ALL_PROJECTS.map((project) => [
      project.detailRoute,
      project.name,
      'projects',
      `${project.name} | Aditya Kirtane`,
    ]),
    ['/contact', 'Let’s build something great', 'contact', 'Contact | Aditya Kirtane'],
  ])('loads %s and synchronizes route state', async (url, heading, section, title) => {
    const state = TestBed.inject(UiState);
    const harness = await RouterTestingHarness.create(url);

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toBe(heading);
    expect(state.activeSection()).toBe(section);
    expect(TestBed.inject(Title).getTitle()).toBe(title);
    expect(harness.routeNativeElement?.textContent).not.toMatch(/product builder/i);
  });

  it('updates the signal input when a project slug changes on the reused component', async () => {
    const state = TestBed.inject(UiState);
    const harness = await RouterTestingHarness.create();
    const first = await harness.navigateByUrl('/projects/ready-inventory', ProjectDetail);
    expect(first.slug()).toBe('ready-inventory');
    expect(state.selectedProject()).toBe('ready-inventory');

    const second = await harness.navigateByUrl('/projects/customer-portal', ProjectDetail);
    expect(second).toBe(first);
    expect(second.slug()).toBe('customer-portal');
    expect(state.selectedProject()).toBe('customer-portal');
    expect(harness.routeNativeElement?.textContent).toContain('Customer Portal');

    await harness.navigateByUrl('/contact');
    expect(state.selectedProject()).toBeNull();
  });

  it.each(PROJECTS)(
    'renders the $name case study through its actual route and resolves its title',
    async (project) => {
      const harness = await RouterTestingHarness.create(project.detailRoute);
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toBe(
        project.name,
      );
      expect(harness.routeNativeElement?.textContent).not.toMatch(/product builder/i);
      expect(TestBed.inject(Title).getTitle()).toBe(`${project.name} | Aditya Kirtane`);
      expect(TestBed.inject(UiState).activeSection()).toBe('projects');
      expect(TestBed.inject(UiState).selectedProject()).toBe(project.slug);
    },
  );

  it('handles unknown project slugs without showing the detail placeholder and recovers on a valid slug', async () => {
    const harness = await RouterTestingHarness.create('/projects/not-in-showcase');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Project not found');
    expect(harness.routeNativeElement?.querySelector('app-route-placeholder')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('a')?.getAttribute('href')).toBe('/projects');
    await harness.navigateByUrl('/projects/ready-inventory');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Ready Inventory');
  });

  it.each(['/missing', '/projects/example/extra'])(
    'redirects unknown URL %s to home',
    async (url) => {
      const harness = await RouterTestingHarness.create(url);
      expect(TestBed.inject(Router).url).toBe('/');
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toBe(
        'Aditya Kirtane',
      );
    },
  );
});
