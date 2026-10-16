import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ANGULAR_TOPICS, SKILL_CATEGORIES, SkillCategory } from './skills.config';
import type { Skills } from './skills';

let SkillsComponent: typeof import('./skills').Skills;
let effectsToken: typeof import('./skills-effects').SKILLS_EFFECTS;
const animate = vi.fn(),
  cleanup = vi.fn();
let motion = false;
const expected = [
  [
    'Angular',
    'TypeScript',
    'JavaScript',
    'RxJS',
    'NgRx',
    'HTML',
    'CSS',
    'SCSS',
    'Angular Material',
    'Bootstrap',
    'Tailwind CSS',
    'PrimeNG',
  ],
  [
    'React Native',
    'Expo',
    'Expo Router',
    'EAS Build',
    'React Navigation',
    'Ionic',
    'Capacitor',
    'FCM',
    'Background Geolocation',
    'Offline-first Sync',
    'Biometric Authentication',
  ],
  ['Node.js', 'Express.js', 'REST APIs', 'Socket.IO', 'WebRTC', 'JWT Authentication'],
  ['MongoDB', 'Firebase Firestore', 'Firebase Realtime Database', 'AngularFire'],
  [
    'Git',
    'GitHub',
    'GitLab',
    'GitHub Actions',
    'GitLab CI/CD',
    'Azure DevOps',
    'Docker',
    'NGINX',
    'Postman',
    'Jira',
  ],
];

describe('My skill universe', () => {
  let fixture: ComponentFixture<Skills>;
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
    SkillsComponent = (await import('./skills')).Skills;
    effectsToken = (await import('./skills-effects')).SKILLS_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.clearAllMocks();
    motion = false;
    TestBed.configureTestingModule({
      imports: [SkillsComponent],
      providers: [
        {
          provide: effectsToken,
          useValue: {
            createMotionContext: (_scope: HTMLElement, callback: () => void) => {
              if (motion) callback();
              return cleanup;
            },
            animateSkills: animate,
          },
        },
      ],
    });
  });
  afterEach(() => fixture?.destroy());
  function render(): HTMLElement {
    fixture = TestBed.createComponent(SkillsComponent);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  it('replaces the placeholder with one H1 and the requested capabilities introduction', () => {
    const el = render();
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('My skill universe');
    expect(el.querySelector('.eyebrow')?.textContent).toBe('My capabilities');
    expect(el.textContent).toContain(
      'Technologies, tools, and engineering areas I use to build scalable, maintainable products across web and mobile.',
    );
    expect(el.querySelector('app-route-placeholder')).toBeNull();
  });
  it('keeps the five verified categories in reading order with unique identifiers', () => {
    const categories: readonly SkillCategory[] = SKILL_CATEGORIES;
    expect(categories.map((c) => c.title)).toEqual([
      'Frontend',
      'Mobile',
      'Backend & APIs',
      'Database & Data',
      'DevOps / Tools',
    ]);
    expect(new Set(categories.map((c) => c.id)).size).toBe(categories.length);
    expect(Array.from(render().querySelectorAll('h2'), (e) => e.textContent)).toEqual(
      categories.map((c) => c.title),
    );
    for (const c of categories) {
      expect(new Set(c.skills.map((s) => s.name)).size).toBe(c.skills.length);
      expect(c.skills.every((s) => s.source.startsWith('Resume '))).toBe(true);
    }
  });
  it.each(SKILL_CATEGORIES.map((c, index) => ({ ...c, expected: expected[index] })))(
    'publishes only the verified $title skills',
    (category) => {
      const el = render();
      const section = el.querySelector(`[data-skill-category="${category.id}"]`)!;
      expect(category.skills.map((s) => s.name)).toEqual(category.expected);
      const list = section.querySelector('ul.skill-list')!;
      expect(list.getAttribute('aria-label')).toBe(category.title + ' skills');
      expect(list.children.length).toBe(category.expected?.length);
      for (const name of category.expected ?? []) expect(list.textContent).toContain(name);
      expect(section.getAttribute('aria-labelledby')).toBe(category.id + '-title');
      expect(section.querySelector('h2')?.id).toBe(category.id + '-title');
    },
  );
  it('features Angular once and supports every engineering topic with resume or project evidence', () => {
    const el = render();
    expect(el.querySelectorAll('.skill-category--featured')).toHaveLength(1);
    expect(el.querySelector('.skill-category--featured')?.getAttribute('data-skill-category')).toBe(
      'frontend',
    );
    expect(el.querySelectorAll('.skill-feature')).toHaveLength(1);
    expect(el.querySelector('.skill-feature h3')?.textContent).toBe('Angular');
    expect(Array.from(el.querySelectorAll('.angular-topics li'), (e) => e.textContent)).toEqual([
      'Standalone components',
      'Signals',
      'Routing',
      'Reactive Forms',
      'Reusable components',
      'Lazy loading',
      'Testing',
    ]);
    expect(ANGULAR_TOPICS.every((t) => /^(Resume|Portfolio) /.test(t.source))).toBe(true);
    expect(el.querySelector('[data-skill-category="backend"]')?.textContent).toContain(
      'Peer communication',
    );
  });
  it('uses only existing closed local category icons with decorative alternatives and reserved dimensions', () => {
    const el = render();
    const icons = ['code', 'mobile', 'server', 'database', 'gear'];
    expect(SKILL_CATEGORIES.map((c) => c.icon)).toEqual(
      icons.map((i) => `assets/icons/ui/${i}.svg`),
    );
    expect(el.querySelectorAll('img')).toHaveLength(5);
    for (const image of el.querySelectorAll('img')) {
      expect(image.alt).toBe('');
      expect(image.width).toBe(28);
      expect(image.height).toBe(28);
      expect(image.parentElement?.getAttribute('aria-hidden')).toBe('true');
    }
    expect(el.querySelector('.skill-orbits')?.getAttribute('aria-hidden')).toBe('true');
    expect(el.innerHTML).not.toMatch(/references\/|companies\/|projects\/|images\/aditya\//);
  });
  it('keeps cards and badges informational with no scores, versions, guessed years, or unsupported claims', () => {
    const el = render();
    expect(
      el.querySelector(
        'button,a,[role="button"],progress,meter,[role="progressbar"],.skill-category[tabindex],.badge[tabindex]',
      ),
    ).toBeNull();
    expect(el.textContent).not.toMatch(
      /\d\s*%|[★☆]|\d+\s*\/\s*10|\d+\+?\s*years|\bv\d|SDK\s*\d|expert|beginner|intermediate|SSR|GraphQL|Kubernetes|Next\.js|Python|AWS/i,
    );
    expect(el.textContent).not.toMatch(/Resume p\d|Portfolio app\.routes/);
  });
  it('keeps all categories and skill names present without motion in the reduced-motion path', () => {
    const el = render();
    expect(animate).not.toHaveBeenCalled();
    expect(el.querySelectorAll('[data-skill-category]')).toHaveLength(5);
    expect(el.querySelectorAll('.skill-list > li')).toHaveLength(43);
    expect(el.querySelector('[style*="opacity"]')).toBeNull();
  });
  it('scopes motion to its host and disposes it once on destruction', () => {
    motion = true;
    const el = render();
    expect(animate).toHaveBeenCalledWith(el);
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
