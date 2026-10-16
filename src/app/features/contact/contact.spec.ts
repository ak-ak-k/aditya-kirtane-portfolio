import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CONTACT, CONTACT_CARDS } from './contact.config';
import type { Contact } from './contact';
let ContactComponent: typeof import('./contact').Contact;
let effectsToken: typeof import('./contact-effects').CONTACT_EFFECTS;
const animate = vi.fn(),
  cleanup = vi.fn();
let motion = false;
describe('Contact page', () => {
  let fixture: ComponentFixture<Contact>;
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
    ContactComponent = (await import('./contact')).Contact;
    effectsToken = (await import('./contact-effects')).CONTACT_EFFECTS;
  });
  afterAll(() => vi.unstubAllGlobals());
  beforeEach(() => {
    vi.clearAllMocks();
    motion = false;
    TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        {
          provide: effectsToken,
          useValue: {
            createMotionContext: (_scope: HTMLElement, callback: () => void) => {
              if (motion) callback();
              return cleanup;
            },
            animateContact: animate,
          },
        },
      ],
    });
  });
  afterEach(() => fixture?.destroy());
  function render(): HTMLElement {
    fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    TestBed.tick();
    return fixture.nativeElement as HTMLElement;
  }
  it('replaces the placeholder with the requested H1 and concise contact copy', () => {
    const el = render();
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Let’s build something great');
    expect(el.querySelector('.eyebrow')?.textContent).toBe('Contact me');
    expect(el.textContent).toContain(CONTACT.supportingCopy);
    expect(el.querySelector('app-route-placeholder')).toBeNull();
  });
  it('publishes only the exact resume-verified contact values', () => {
    expect([
      CONTACT.email,
      CONTACT.phone,
      CONTACT.linkedin,
      CONTACT.location,
      CONTACT.resumePath,
    ]).toEqual([
      'adityakirtane27@gmail.com',
      '+91 88797 51140',
      'https://linkedin.com/in/adityakirtane',
      'Mumbai, India',
      'assets/resume/aditya-kirtane-resume.pdf',
    ]);
    expect(CONTACT.phoneHref.replace('tel:', '')).toBe(CONTACT.phone.replaceAll(' ', ''));
    expect(new Set(CONTACT_CARDS.map((c) => c.id)).size).toBe(4);
    const el = render();
    for (const card of CONTACT_CARDS)
      expect(el.querySelector('address')?.textContent).toContain(card.value);
  });
  it('provides native, understandable email and phone actions without a fake submission', () => {
    const el = render();
    expect(el.querySelector('.contact-actions a')?.getAttribute('href')).toBe(
      'mailto:adityakirtane27@gmail.com',
    );
    expect(el.querySelector('#email-value')?.getAttribute('href')).toBe('mailto:' + CONTACT.email);
    expect(el.querySelector('#phone-value')?.getAttribute('href')).toBe('tel:+918879751140');
    expect(el.querySelector('form,input,textarea,button,[role="status"],[aria-live]')).toBeNull();
    expect(el.textContent).not.toMatch(
      /message sent|available immediately|available for work|open to opportunities|whatsapp|calendly|github/i,
    );
  });
  it('uses LinkedIn external context and safe attributes on both relevant links', () => {
    const el = render();
    const links = el.querySelectorAll(`a[href="${CONTACT.linkedin}"]`);
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.getAttribute('data-cursor')).toBe('open');
      expect(link.textContent).toContain('opens in a new tab');
    }
    expect(el.querySelectorAll('a[href^="https"]')).toHaveLength(2);
  });
  it('uses the existing PDF as a deliberate native download', () => {
    const link = render().querySelector('a[download]')!;
    expect(link.getAttribute('href')).toBe(CONTACT.resumePath);
    expect(link.getAttribute('download')).toBe('Aditya-Kirtane-Resume.pdf');
    expect(link.getAttribute('data-cursor')).toBe('open');
    expect(link.textContent).toContain('PDF');
  });
  it('keeps contact semantics and the location informational without fake map links', () => {
    const el = render();
    expect(el.querySelectorAll('address dl > div')).toHaveLength(4);
    expect(el.querySelectorAll('dt')).toHaveLength(4);
    expect(el.querySelectorAll('dd')).toHaveLength(4);
    const location = el.querySelector('#location-label')?.parentElement!;
    expect(location.querySelector('a,button,[tabindex]')).toBeNull();
    expect(location.classList.contains('contact-card--interactive')).toBe(false);
    expect(el.querySelector('a a,[role="button"]')).toBeNull();
  });
  it('uses one approved reserved head-and-chest portrait and local decorative icons', () => {
    const el = render();
    const image = el.querySelector<HTMLImageElement>('.portrait img')!;
    expect(image.getAttribute('src')).toBe('assets/images/aditya/portrait-headshot.webp');
    expect(image.alt).toContain('head-and-chest');
    expect(el.querySelectorAll('.portrait img')).toHaveLength(1);
    expect(el.querySelector('.bg-layer')?.getAttribute('aria-hidden')).toBe('true');
    for (const icon of el.querySelectorAll<HTMLImageElement>('dt img')) {
      expect(icon.alt).toBe('');
      expect(icon.width).toBe(28);
      expect(icon.height).toBe(28);
      expect(icon.getAttribute('src')).toMatch(
        /^assets\/icons\/ui\/(mail|phone|linkedin|location)\.svg$/,
      );
    }
    expect(el.querySelector('video,iframe,canvas')).toBeNull();
    expect(el.innerHTML).not.toMatch(/references\/|portrait-original|portrait-upper/);
  });
  it('shows all final contact content without animation under reduced motion', () => {
    const el = render();
    expect(animate).not.toHaveBeenCalled();
    expect(el.querySelectorAll('[data-contact-card]')).toHaveLength(4);
    expect(el.querySelector('[style*="opacity"]')).toBeNull();
  });
  it('owns one scoped entrance and disposes it once', () => {
    motion = true;
    const el = render();
    expect(animate).toHaveBeenCalledWith(el);
    fixture.destroy();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
