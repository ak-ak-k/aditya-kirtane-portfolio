export {};
let runtime: typeof import('../../animations/gsap');
let animate: typeof import('./contact-animation').animateContact;
describe('Contact entrance ownership', () => {
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
    animate = (await import('./contact-animation')).animateContact;
  });
  afterAll(() => vi.unstubAllGlobals());
  it('uses no ScrollTriggers and restores its entrance without affecting unrelated animation', () => {
    const scope = document.createElement('div');
    scope.innerHTML =
      '<header data-contact-heading>Contact</header><figure data-contact-portrait>Portrait</figure><div data-contact-actions>Links</div>' +
      Array.from({ length: 4 }, () => '<div data-contact-card>Verified contact</div>').join('');
    const other = document.createElement('div');
    document.body.append(scope, other);
    const unrelated = runtime.gsap.to(other, { opacity: 0.5, duration: 1, paused: true });
    const triggers = runtime.ScrollTrigger.getAll();
    const context = runtime.gsap.context(() => animate(scope), scope);
    try {
      expect(runtime.ScrollTrigger.getAll()).toEqual(triggers);
      context.revert();
      expect(unrelated.parent).not.toBeNull();
      const markup = scope.innerHTML;
      runtime.gsap.ticker.tick();
      expect(scope.innerHTML).toBe(markup);
      expect(scope.querySelector<HTMLElement>('header')?.style.opacity).toBe('');
    } finally {
      context.revert();
      unrelated.kill();
      scope.remove();
      other.remove();
    }
  });
});
