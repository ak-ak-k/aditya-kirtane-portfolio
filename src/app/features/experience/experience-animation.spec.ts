export {};
let animateExperience: typeof import('./experience-animation').animateExperience;
let runtime: typeof import('../../animations/gsap');
describe('Experience animation ownership', () => {
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
    ({ animateExperience } = await import('./experience-animation'));
  });
  afterAll(() => vi.unstubAllGlobals());
  it('cleans its three triggers and timelines without global kills or late DOM mutation', () => {
    const scope = document.createElement('div');
    scope.innerHTML = '<header data-career-heading>Top moments</header>';
    for (let i = 0; i < 3; i++) {
      const entry = document.createElement('div');
      entry.setAttribute('data-career-entry', '');
      entry.innerHTML =
        '<span data-career-node></span><article data-career-card>Final role information</article>' +
        (i < 2 ? '<span data-career-line></span>' : '');
      entry.getBoundingClientRect = () => new DOMRect(0, 1500 + i * 600, 500, 500);
      scope.append(entry);
    }
    const other = document.createElement('div');
    document.body.append(scope, other);
    const unrelated = runtime.ScrollTrigger.create({ trigger: other, start: 4000, end: 5000 });
    const before = new Set(runtime.ScrollTrigger.getAll());
    const context = runtime.gsap.context(() => animateExperience(scope), scope);
    try {
      expect(runtime.ScrollTrigger.getAll().filter((t) => !before.has(t))).toHaveLength(3);
      context.revert();
      expect(runtime.ScrollTrigger.getAll().filter((t) => !before.has(t))).toHaveLength(0);
      expect(runtime.ScrollTrigger.getAll()).toContain(unrelated);
      const markup = scope.innerHTML;
      window.dispatchEvent(new Event('scroll'));
      runtime.ScrollTrigger.update();
      runtime.gsap.ticker.tick();
      expect(scope.innerHTML).toBe(markup);
      expect(scope.querySelector('[data-career-card]')?.textContent).toBe('Final role information');
      expect(scope.querySelector<HTMLElement>('[data-career-line]')?.style.transform).toBe('');
    } finally {
      context.revert();
      unrelated.kill();
      scope.remove();
      other.remove();
    }
  });
});
