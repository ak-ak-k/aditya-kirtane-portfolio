export {};

let animateAbout: typeof import('./about-animation').animateAbout;
let gsap: typeof import('../../animations/gsap').gsap;
let ScrollTrigger: typeof import('../../animations/gsap').ScrollTrigger;

describe('About ScrollTrigger ownership', () => {
  beforeAll(async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((media: string) => ({
        matches: false,
        media,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );
    ({ gsap, ScrollTrigger } = await import('../../animations/gsap'));
    ({ animateAbout } = await import('./about-animation'));
  });
  afterAll(() => vi.unstubAllGlobals());
  it('reverts its three reveal triggers without killing unrelated triggers or permitting late writes', () => {
    const scope = document.createElement('div');
    scope.innerHTML =
      '<h1 data-about-heading>Story</h1><div data-about-portrait></div><div data-about-story></div><span data-about-badge>Angular</span>';
    for (let i = 0; i < 3; i++) {
      const group = document.createElement('div');
      group.setAttribute('data-about-reveal-group', '');
      group.innerHTML = '<div data-about-reveal>Final value</div>';
      group.getBoundingClientRect = () => new DOMRect(0, 1500, 300, 200);
      scope.append(group);
    }
    const other = document.createElement('div');
    document.body.append(scope, other);
    const unrelated = ScrollTrigger.create({ trigger: other, start: 2500, end: 3000 });
    const before = new Set(ScrollTrigger.getAll());
    const context = gsap.context(() => animateAbout(scope), scope);
    expect(ScrollTrigger.getAll().filter((trigger) => !before.has(trigger))).toHaveLength(3);
    context.revert();
    expect(ScrollTrigger.getAll().filter((trigger) => !before.has(trigger))).toHaveLength(0);
    expect(ScrollTrigger.getAll()).toContain(unrelated);
    const markup = scope.innerHTML;
    window.dispatchEvent(new Event('scroll'));
    ScrollTrigger.update();
    gsap.ticker.tick();
    expect(scope.innerHTML).toBe(markup);
    expect(scope.querySelector('[data-about-reveal]')?.textContent).toBe('Final value');
    unrelated.kill();
    scope.remove();
    other.remove();
  });
});
