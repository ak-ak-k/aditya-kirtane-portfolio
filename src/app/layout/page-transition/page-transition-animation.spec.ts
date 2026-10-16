export {};
let runtime: typeof import('../../animations/gsap');
let create: typeof import('./page-transition-animation').createRouteTransition;
describe('Route sweep animation ownership', () => {
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
    runtime = await import('../../animations/gsap');
    create = (await import('./page-transition-animation')).createRouteTransition;
  });
  afterAll(() => vi.unstubAllGlobals());
  it('completes, restarts and restores only its own styles without triggers or late writes', () => {
    const scope = document.createElement('div');
    scope.innerHTML = '<span data-transition-veil></span><span data-transition-edge></span>';
    const other = document.createElement('div');
    document.body.append(scope, other);
    const unrelated = runtime.gsap.to(other, { x: 30, duration: 1, paused: true });
    const triggers = runtime.ScrollTrigger.getAll();
    const complete = vi.fn();
    const controls = create(scope, complete);
    const edge = scope.querySelector<HTMLElement>('[data-transition-edge]')!;
    try {
      controls.start();
      expect(runtime.gsap.getTweensOf(edge).length).toBeGreaterThan(0);
      controls.finish();
      expect(edge.style.opacity).toBe('1');
      expect(scope.querySelector<HTMLElement>('[data-transition-veil]')?.style.opacity).toBe(
        '0.08',
      );
      runtime.gsap.getTweensOf(edge)[0]?.parent?.progress(1);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(edge.style.transform).toBe('');
      controls.start();
      expect(runtime.gsap.getTweensOf(edge).length).toBeGreaterThan(0);
      controls.finish();
      controls.reset();
      const markup = scope.innerHTML;
      runtime.gsap.ticker.tick();
      expect(scope.innerHTML).toBe(markup);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(unrelated.parent).not.toBeNull();
      expect(runtime.ScrollTrigger.getAll()).toEqual(triggers);
    } finally {
      controls.destroy();
      unrelated.kill();
      scope.remove();
      other.remove();
    }
  });
});
