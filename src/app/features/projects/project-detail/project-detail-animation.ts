import { gsap } from '../../../animations/gsap';

export function animateProjectDetail(scope: HTMLElement): void {
  gsap.fromTo(
    scope.querySelector('[data-case-heading]'),
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
  );
  for (const section of scope.querySelectorAll<HTMLElement>('[data-case-section]')) {
    gsap.fromTo(
      section,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      },
    );
  }
}
