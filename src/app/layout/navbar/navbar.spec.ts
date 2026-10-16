import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { UiState } from '../../core/services/ui-state';
import { Navbar } from './navbar';

@Component({ template: '<h1>Destination</h1>' })
class Destination {}
describe('Production navbar', () => {
  let fixture: ComponentFixture<Navbar>;
  let desktop = false;
  let resize: (() => void) | undefined;
  let removeMedia: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    desktop = false;
    resize = undefined;
    removeMedia = vi.fn();
    vi.stubGlobal(
      'matchMedia',
      vi.fn((media: string) => ({
        get matches() {
          return desktop;
        },
        media,
        addEventListener: (_type: string, cb: () => void) => (resize = cb),
        removeEventListener: removeMedia,
      })),
    );
    TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([
          { path: 'about', component: Destination },
          { path: 'contact', component: Destination },
        ]),
      ],
    });
    fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    TestBed.tick();
  });
  afterEach(() => {
    fixture.destroy();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }
  it('links the branding, six routes, and Connect CTA to existing destinations', () => {
    expect(
      Array.from(element().querySelectorAll('.nav-link'), (a) => a.getAttribute('href')),
    ).toEqual(['/', '/about', '/experience', '/skills', '/projects', '/contact']);
    expect(element().querySelector('.brand')?.getAttribute('href')).toBe('/');
    expect(element().querySelector('.btn--connect')?.getAttribute('href')).toBe('/contact');
    expect(element().querySelector('nav')?.getAttribute('aria-label')).toBe('Primary');
  });
  it('toggles the existing signal and exposes the controlled panel state', () => {
    const button = element().querySelector<HTMLButtonElement>('button')!;
    expect(button.getAttribute('aria-controls')).toBe('primary-navigation');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    TestBed.tick();
    expect(TestBed.inject(UiState).menuOpen()).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    button.click();
    TestBed.tick();
    expect(TestBed.inject(UiState).menuOpen()).toBe(false);
  });
  it('closes on Escape and restores focus to the native toggle', () => {
    const button = element().querySelector<HTMLButtonElement>('button')!;
    button.click();
    TestBed.tick();
    element().querySelector<HTMLAnchorElement>('.nav-link')?.focus();
    element().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    TestBed.tick();
    expect(TestBed.inject(UiState).menuOpen()).toBe(false);
    expect(document.activeElement).toBe(button);
  });
  it('closes after successful navigation and updates the non-color active indicator', async () => {
    TestBed.inject(UiState).setMenuOpen(true);
    await TestBed.inject(Router).navigateByUrl('/about');
    TestBed.tick();
    await fixture.whenStable();
    expect(TestBed.inject(UiState).menuOpen()).toBe(false);
    expect(element().querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('About');
    expect(element().querySelector('[aria-current="page"]')?.classList.contains('active')).toBe(
      true,
    );
  });
  it('clears mobile state when resizing to desktop', () => {
    TestBed.inject(UiState).setMenuOpen(true);
    desktop = true;
    resize?.();
    expect(TestBed.inject(UiState).menuOpen()).toBe(false);
  });

  it('closes when keyboard focus moves outside the non-modal panel', () => {
    TestBed.inject(UiState).setMenuOpen(true);
    const outside = document.createElement('button');
    document.body.append(outside);
    element().querySelector<HTMLAnchorElement>('.nav-link')?.focus();
    outside.focus();
    expect(TestBed.inject(UiState).menuOpen()).toBe(false);
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
  it('updates scroll appearance and removes native listeners on destruction', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    vi.stubGlobal('scrollY', 50);
    window.dispatchEvent(new Event('scroll'));
    TestBed.tick();
    expect(element().classList.contains('is-scrolled')).toBe(true);
    fixture.destroy();
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeMedia).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
