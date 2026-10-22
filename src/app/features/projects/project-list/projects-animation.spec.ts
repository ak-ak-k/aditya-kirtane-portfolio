export {};
let animateProjects: typeof import('./projects-animation').animateProjects;
let runtime: typeof import('../../../animations/gsap');
describe('Projects animation ownership', () => {
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
    ({ animateProjects } = await import('./projects-animation'));
  });
  afterAll(() => vi.unstubAllGlobals());
  it('cleans ten owned once-only reveals, preserves unrelated triggers, and prevents late writes', () => {
    const scope = document.createElement('div');
    scope.innerHTML = '<header data-projects-heading>AK Originals</header>';
    for (let i = 0; i < 7; i++) {
      const article = document.createElement('article');
      article.setAttribute('data-project-entry', '');
      article.innerHTML = '<a href="/projects/ready-inventory">View Project</a>';
      article.getBoundingClientRect = () => new DOMRect(0, 1500 + i * 600, 500, 500);
      scope.append(article);
    }
    for (let i = 0; i < 2; i++) {
      const heading = document.createElement('header');
      heading.setAttribute('data-project-section-heading', '');
      heading.getBoundingClientRect = () => new DOMRect(0, 2000 + i * 600, 500, 100);
      scope.append(heading);
    }
    const showcase = document.createElement('section');
    showcase.setAttribute('data-project-showcase', '');
    showcase.innerHTML =
      '<h2 data-showcase-reveal>Engineering</h2><figure data-showcase-reveal>Real screenshot</figure>';
    showcase.getBoundingClientRect = () => new DOMRect(0, 6000, 500, 600);
    scope.append(showcase);
    const other = document.createElement('div');
    document.body.append(scope, other);
    const unrelated = runtime.ScrollTrigger.create({ trigger: other, start: 5000, end: 6000 });
    const before = new Set(runtime.ScrollTrigger.getAll());
    const context = runtime.gsap.context(() => animateProjects(scope), scope);
    try {
      const owned = runtime.ScrollTrigger.getAll().filter((t) => !before.has(t));
      expect(owned).toHaveLength(10);
      expect(owned.every((t) => t.vars.once && !t.vars.pin && !t.vars.scrub)).toBe(true);
      context.revert();
      expect(runtime.ScrollTrigger.getAll().filter((t) => !before.has(t))).toHaveLength(0);
      expect(runtime.ScrollTrigger.getAll()).toContain(unrelated);
      const markup = scope.innerHTML;
      window.dispatchEvent(new Event('scroll'));
      runtime.ScrollTrigger.update();
      runtime.gsap.ticker.tick();
      expect(scope.innerHTML).toBe(markup);
      expect(scope.querySelector<HTMLElement>('article')?.style.transform).toBe('');
      expect(scope.querySelector('a')?.getAttribute('href')).toBe('/projects/ready-inventory');
    } finally {
      context.revert();
      unrelated.kill();
      scope.remove();
      other.remove();
    }
  });
});
