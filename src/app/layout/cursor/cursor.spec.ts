import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CursorMode } from '../../core/models/ui-state';
import { UiState } from '../../core/services/ui-state';
import { Cursor } from './cursor';
import { CURSOR_EFFECTS, CURSOR_QUERY } from './cursor-effects';

describe('Cursor enhancement eligibility', () => {
  let fixture: ComponentFixture<Cursor>;
  let eligible = true;
  let change: (() => void) | undefined;
  let onMode: ((mode: CursorMode) => void) | undefined;
  let touchDescriptor: PropertyDescriptor | undefined;
  const cleanup = vi.fn();
  const removeMedia = vi.fn();
  const start = vi.fn((_scope: HTMLElement, update: (mode: CursorMode) => void) => {
    onMode = update;
    return cleanup;
  });
  const loadTracking = vi.fn(async () => start);
  beforeEach(() => {
    vi.clearAllMocks();
    eligible = true;
    change = undefined;
    onMode = undefined;
    touchDescriptor = Object.getOwnPropertyDescriptor(navigator, 'maxTouchPoints');
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
    vi.stubGlobal(
      'matchMedia',
      vi.fn((media: string) => ({
        get matches() {
          return eligible;
        },
        media,
        addEventListener: (_event: string, cb: () => void) => (change = cb),
        removeEventListener: removeMedia,
      })),
    );
    TestBed.configureTestingModule({
      imports: [Cursor],
      providers: [provideRouter([]), { provide: CURSOR_EFFECTS, useValue: { loadTracking } }],
    });
  });
  afterEach(() => {
    fixture?.destroy();
    vi.unstubAllGlobals();
    if (touchDescriptor) Object.defineProperty(navigator, 'maxTouchPoints', touchDescriptor);
    else Reflect.deleteProperty(navigator, 'maxTouchPoints');
  });
  async function render(): Promise<HTMLElement> {
    fixture = TestBed.createComponent(Cursor);
    fixture.detectChanges();
    TestBed.tick();
    await fixture.whenStable();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  it('loads tracking only for the desktop fine-pointer hover/no-reduced-motion query', async () => {
    const element = await render();
    expect(window.matchMedia).toHaveBeenCalledWith(CURSOR_QUERY);
    expect(CURSOR_QUERY).toContain('(pointer: fine)');
    expect(CURSOR_QUERY).toContain('(hover: hover)');
    expect(CURSOR_QUERY).toContain('(prefers-reduced-motion: no-preference)');
    expect(CURSOR_QUERY).toContain('(min-width: 64rem)');
    expect(start).toHaveBeenCalledTimes(1);
    expect(element.querySelector('.is-active')).not.toBeNull();
    expect(element.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(document.documentElement.style.cursor).not.toBe('none');
    expect(document.body.style.cursor).not.toBe('none');
  });
  it.each(['reduced motion', 'coarse pointer', 'mobile viewport'])(
    'does not load tracking with %s',
    async () => {
      eligible = false;
      const element = await render();
      expect(loadTracking).not.toHaveBeenCalled();
      expect(element.querySelector('.is-active')).toBeNull();
    },
  );
  it('disables the enhancement for a touch-capable environment', async () => {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 1, configurable: true });
    await render();
    expect(loadTracking).not.toHaveBeenCalled();
  });
  it('reflects shared cursor mode without replacing native controls', async () => {
    const element = await render();
    onMode?.('project');
    TestBed.tick();
    expect(TestBed.inject(UiState).cursorMode()).toBe('project');
    expect(element.querySelector('[data-mode="project"]')?.textContent).toContain('VIEW');
    onMode?.('open');
    TestBed.tick();
    expect(element.querySelector('[data-mode="open"]')?.textContent).toContain('OPEN');
  });
  it('cleans tracking and state when reduced motion or eligibility changes', async () => {
    const element = await render();
    onMode?.('project');
    eligible = false;
    change?.();
    TestBed.tick();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(element.querySelector('.is-active')).toBeNull();
    expect(TestBed.inject(UiState).cursorMode()).toBe('default');
  });
  it('cleans tracking and the media listener on destruction', async () => {
    await render();
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(removeMedia).toHaveBeenCalledWith('change', expect.any(Function));
  });
  it('does not initialize from a late module result after destruction', async () => {
    let resolve: ((value: typeof start) => void) | undefined;
    loadTracking.mockReturnValueOnce(new Promise((r) => (resolve = r)));
    await render();
    fixture.destroy();
    resolve?.(start);
    await Promise.resolve();
    expect(start).not.toHaveBeenCalled();
  });
  it('leaves the native cursor available if lazy initialization fails', async () => {
    loadTracking.mockRejectedValueOnce(new Error('Unavailable enhancement'));
    const element = await render();
    expect(element.querySelector('.is-active')).toBeNull();
    expect(document.documentElement.style.cursor).not.toBe('none');
  });
});
