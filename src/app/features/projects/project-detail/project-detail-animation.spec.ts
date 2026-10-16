export {};
let animate: typeof import('./project-detail-animation').animateProjectDetail;
let runtime: typeof import('../../../animations/gsap');
describe('Case-study animation ownership', () => {
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
    runtime = await import('../../../animations/gsap');
    animate = (await import('./project-detail-animation')).animateProjectDetail;
  });
  afterAll(() => vi.unstubAllGlobals());
  it('reverts grouped sections while preserving unrelated triggers and preventing late writes', () => {
    const scope = document.createElement('div');
    scope.innerHTML = '<header data-case-heading>Case study</header>';
    for (let i = 0; i < 7; i++) {
      const section = document.createElement('section');
      section.setAttribute('data-case-section', '');
      section.textContent = 'Verified content';
      section.getBoundingClientRect = () => new DOMRect(0, 1500 + i * 500, 500, 400);
      scope.append(section);
    }
    const other = document.createElement('div');
    document.body.append(scope, other);
    const unrelated = runtime.ScrollTrigger.create({ trigger: other, start: 5000, end: 6000 });
    const before = new Set(runtime.ScrollTrigger.getAll());
    const context = runtime.gsap.context(() => animate(scope), scope);
    try {
      const owned = runtime.ScrollTrigger.getAll().filter((t) => !before.has(t));
      expect(owned).toHaveLength(7);
      expect(owned.every((t) => t.vars.once && !t.vars.pin && !t.vars.scrub)).toBe(true);
      context.revert();
      expect(runtime.ScrollTrigger.getAll().filter((t) => !before.has(t))).toHaveLength(0);
      expect(runtime.ScrollTrigger.getAll()).toContain(unrelated);
      const markup = scope.innerHTML;
      window.dispatchEvent(new Event('scroll'));
      runtime.ScrollTrigger.update();
      runtime.gsap.ticker.tick();
      expect(scope.innerHTML).toBe(markup);
    } finally {
      context.revert();
      unrelated.kill();
      scope.remove();
      other.remove();
    }
  });
});
