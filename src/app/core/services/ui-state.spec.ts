import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { appConfig } from '../../app.config';
import { UiState } from './ui-state';

describe('UiState', () => {
  beforeAll(() => {
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
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
  });

  it('starts without a profile or completed intro, with native cursor behavior', () => {
    const state = TestBed.inject(UiState);
    expect(state.selectedProfile()).toBeNull();
    expect(state.introCompleted()).toBe(false);
    expect(state.menuOpen()).toBe(false);
    expect(state.cursorMode()).toBe('default');
  });

  it('preserves exploration choices and resets transient UI on navigation', async () => {
    const state = TestBed.inject(UiState);
    state.completeIntro();
    const harness = await RouterTestingHarness.create('/');
    state.selectProfile('angular-engineer');
    state.completeIntro();
    state.toggleMenu();
    state.setCursorMode('project');
    expect(state.menuOpen()).toBe(true);

    await harness.navigateByUrl('/projects');

    expect(state.selectedProfile()).toBe('angular-engineer');
    expect(state.introCompleted()).toBe(true);
    expect(state.menuOpen()).toBe(false);
    expect(state.cursorMode()).toBe('default');
    expect(state.activeSection()).toBe('projects');
    expect(state.selectedProject()).toBeNull();
  });

  it('initializes correctly when first injected after navigation', async () => {
    await RouterTestingHarness.create('/projects/direct-link');
    const state = TestBed.inject(UiState);
    expect(state.activeSection()).toBe('projects');
    expect(state.selectedProject()).toBe('direct-link');
  });
});
