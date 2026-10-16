import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { App } from './app';
import { appConfig } from './app.config';
import { UiState } from './core/services/ui-state';

describe('App', () => {
  beforeAll(() => {
    vi.stubGlobal('scrollTo', vi.fn());
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
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: appConfig.providers,
    }).compileComponents();
  });

  it('renders the shell and Main Home on a return visit', async () => {
    TestBed.inject(UiState).completeIntro();
    TestBed.inject(UiState).selectProfile('angular-engineer');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('main h1')?.textContent?.trim()).toBe('Aditya Kirtane');
    expect(element.querySelector('app-home-landing')).not.toBeNull();
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('Primary');
    expect(element.querySelector('.skip-link')?.getAttribute('href')).toBe('/#main-content');
    expect(document.activeElement).toBe(element.querySelector('h1'));
  });

  it('gives the intro the full viewport and focuses Explorer after Skip', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('header')).toBeNull();
    expect(element.querySelector('main')?.classList.contains('shell-content--intro')).toBe(true);
    element.querySelector<HTMLButtonElement>('.intro-skip')?.click();
    await fixture.whenStable();
    expect(element.querySelector('header.shell-header')).toBeNull();
    expect(element.querySelector('main')?.classList.contains('shell-content--explorer')).toBe(true);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Who’s Exploring?');
    expect(document.activeElement).toBe(element.querySelector('h1'));
  });

  it('restores the navbar and focuses Main Home after profile selection', async () => {
    TestBed.inject(UiState).completeIntro();
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element
      .querySelector<HTMLButtonElement>('[data-profile-panel="resume-viewer"] > button')
      ?.click();
    await fixture.whenStable();
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Aditya Kirtane');
    expect(element.textContent).toContain('Professional overview');
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('Primary');
    expect(document.activeElement).toBe(element.querySelector('h1'));
  });

  it('updates the active navigation link and focuses content after navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/about');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('About');
    expect(document.activeElement).toBe(element.querySelector('h1'));
  });

  it('preserves Contact and reused project destination focus with the decorative transition layer', async () => {
    TestBed.inject(UiState).completeIntro();
    TestBed.inject(UiState).selectProfile('angular-engineer');
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    for (const [url, title] of [
      ['/contact', 'Let’s build something great'],
      ['/projects/ready-inventory', 'Ready Inventory'],
      ['/projects/ready-salesman', 'Ready Salesman'],
    ]) {
      await router.navigateByUrl(url);
      await fixture.whenStable();
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('main h1')?.textContent?.trim()).toBe(title);
      expect(document.activeElement).toBe(el.querySelector('main h1'));
      expect(el.querySelector('.route-transition')?.getAttribute('aria-hidden')).toBe('true');
      expect(el.querySelector('.route-transition.is-active')).toBeNull();
    }
  });

  it('keeps keyboard skip on the current inner route, preserves its query and focuses main', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/contact?source=resume');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const skip = el.querySelector<HTMLAnchorElement>('.skip-link')!;
    expect(skip.getAttribute('href')).toBe('/contact?source=resume#main-content');
    skip.click();
    await fixture.whenStable();
    expect(router.url).toBe('/contact?source=resume#main-content');
    expect(document.activeElement).toBe(el.querySelector('main'));
    expect(el.querySelector('.route-transition.is-active')).toBeNull();
  });
});
