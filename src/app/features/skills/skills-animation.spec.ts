export {};
let animateSkills: typeof import('./skills-animation').animateSkills;
let runtime: typeof import('../../animations/gsap');
describe('Skills animation ownership', () => {
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
    ({ animateSkills } = await import('./skills-animation'));
  });
  afterAll(() => vi.unstubAllGlobals());
  it('reverts its five category triggers and grouped animations while preserving unrelated work', () => {
    const scope = document.createElement('div');
    scope.innerHTML = '<header data-skills-heading>My skill universe</header>';
    for (let i = 0; i < 5; i++) {
      const section = document.createElement('section');
      section.setAttribute('data-skill-category', '');
      section.innerHTML = '<h2>Category</h2><ul data-skills-group><li>Verified skill</li></ul>';
      section.getBoundingClientRect = () => new DOMRect(0, 1500 + i * 600, 500, 500);
      scope.append(section);
    }
    const other = document.createElement('div');
    document.body.append(scope, other);
    const unrelated = runtime.ScrollTrigger.create({ trigger: other, start: 5000, end: 6000 });
    const before = new Set(runtime.ScrollTrigger.getAll());
    const context = runtime.gsap.context(() => animateSkills(scope), scope);
    try {
      const owned = runtime.ScrollTrigger.getAll().filter((t) => !before.has(t));
      expect(owned).toHaveLength(5);
      expect(owned.every((t) => t.vars.once && !t.vars.pin && !t.vars.scrub)).toBe(true);
      context.revert();
      expect(runtime.ScrollTrigger.getAll().filter((t) => !before.has(t))).toHaveLength(0);
      expect(runtime.ScrollTrigger.getAll()).toContain(unrelated);
      const markup = scope.innerHTML;
      window.dispatchEvent(new Event('scroll'));
      runtime.ScrollTrigger.update();
      runtime.gsap.ticker.tick();
      expect(scope.innerHTML).toBe(markup);
      expect(scope.querySelector<HTMLElement>('[data-skills-group]')?.style.transform).toBe('');
      expect(scope.querySelector('li')?.textContent).toBe('Verified skill');
    } finally {
      context.revert();
      unrelated.kill();
      scope.remove();
      other.remove();
    }
  });
});
