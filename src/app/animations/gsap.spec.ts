describe('GSAP foundation', () => {
  let motionAllowed = true;

  beforeAll(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: no-preference)' && motionAllowed,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('imports GSAP, registers ScrollTrigger, and loads Flip on demand', async () => {
    const { gsap, ScrollTrigger, loadFlip } = await import('./gsap');
    const Flip = await loadFlip();

    expect(typeof gsap.timeline).toBe('function');
    expect(typeof ScrollTrigger.create).toBe('function');
    expect(ScrollTrigger.version).toBe(gsap.version);
    expect(typeof Flip.getState).toBe('function');
  });

  it('restores inline styles when the animation context is destroyed', async () => {
    motionAllowed = true;
    const { gsap } = await import('./gsap');
    const { createMotionContext } = await import('./create-motion-context');
    const scope = document.createElement('div');
    document.body.append(scope);

    const cleanup = createMotionContext(scope, () => {
      gsap.set(scope, { x: 20 });
    });

    expect(scope.style.transform).toContain('20px');
    cleanup();
    expect(scope.style.transform).toBe('');
    scope.remove();
  });

  it('leaves content untouched when reduced motion is requested', async () => {
    motionAllowed = false;
    const { createMotionContext } = await import('./create-motion-context');
    const animate = vi.fn();
    const cleanup = createMotionContext(document.createElement('div'), animate);

    expect(animate).not.toHaveBeenCalled();
    cleanup();
  });
});
