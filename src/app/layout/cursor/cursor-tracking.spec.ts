let startTracking: typeof import('./cursor-tracking').startCursorTracking;

describe('Scoped cursor tracking', () => {
  let scope: HTMLElement;
  let control: HTMLAnchorElement;
  let cleanup: (() => void) | undefined;
  const mode = vi.fn();
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
    startTracking = (await import('./cursor-tracking')).startCursorTracking;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.clearAllMocks();
    scope = document.createElement('div');
    scope.innerHTML = '<span data-cursor-dot></span><span data-cursor-ring></span>';
    control = document.createElement('a');
    control.href = '/projects';
    control.dataset['cursor'] = 'project';
    document.body.append(scope, control);
    cleanup = startTracking(scope, mode);
  });
  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    scope.remove();
    control.remove();
    vi.restoreAllMocks();
  });
  function pointer(type: string, target: EventTarget, pointerType = 'mouse') {
    const event = new Event(type, { bubbles: true });
    Object.defineProperties(event, {
      pointerType: { value: pointerType },
      clientX: { value: 120 },
      clientY: { value: 80 },
      relatedTarget: { value: null },
    });
    target.dispatchEvent(event);
  }
  it('updates transforms without writing shared state on every movement', () => {
    pointer('pointermove', control);
    pointer('pointermove', control);
    expect(scope.hasAttribute('data-visible')).toBe(true);
    expect(scope.querySelector<HTMLElement>('[data-cursor-dot]')?.style.transform).toContain('120');
    expect(mode).not.toHaveBeenCalled();
  });
  it('uses existing interactive/view modes and the download mode on control boundaries', () => {
    pointer('pointerover', control);
    expect(mode).toHaveBeenLastCalledWith('project');
    control.dataset['cursor'] = 'open';
    pointer('pointerover', control);
    expect(mode).toHaveBeenLastCalledWith('open');
    control.removeAttribute('data-cursor');
    pointer('pointerover', control);
    expect(mode).toHaveBeenLastCalledWith('pointer');
    control.setAttribute('aria-disabled', 'true');
    pointer('pointerover', control);
    expect(mode).toHaveBeenLastCalledWith('default');
  });
  it('hides for keyboard input, touch events, and window exit', () => {
    pointer('pointermove', control);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(scope.hasAttribute('data-visible')).toBe(false);
    pointer('pointermove', control);
    pointer('pointermove', control, 'touch');
    expect(scope.hasAttribute('data-visible')).toBe(false);
    pointer('pointermove', control);
    pointer('pointerout', control);
    expect(scope.hasAttribute('data-visible')).toBe(false);
  });
  it('removes all native listeners and prevents post-cleanup pointer changes', () => {
    const remove = vi.spyOn(document, 'removeEventListener');
    const removeWindow = vi.spyOn(window, 'removeEventListener');
    pointer('pointermove', control);
    cleanup?.();
    cleanup = undefined;
    mode.mockClear();
    for (const name of ['pointermove', 'pointerover', 'pointerout', 'keydown'])
      expect(remove).toHaveBeenCalledWith(name, expect.any(Function));
    expect(removeWindow).toHaveBeenCalledWith('blur', expect.any(Function));
    pointer('pointermove', control);
    pointer('pointerover', control);
    expect(scope.hasAttribute('data-visible')).toBe(false);
    expect(mode).not.toHaveBeenCalled();
  });
});
