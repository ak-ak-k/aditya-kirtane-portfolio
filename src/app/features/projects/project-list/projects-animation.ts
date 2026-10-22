import { gsap } from '../../../animations/gsap';

export function animateProjects(scope: HTMLElement): void {
  gsap.fromTo(
    scope.querySelector('[data-projects-heading]'),
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
  );
  for (const entry of scope.querySelectorAll<HTMLElement>('[data-project-entry]')) {
    gsap.fromTo(
      entry,
      { opacity: 0, y: 24, scale: 0.99 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: { trigger: entry, start: 'top 85%', once: true },
      },
    );
  }

  for (const heading of scope.querySelectorAll('[data-project-section-heading]')) {
    gsap.fromTo(
      heading,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
      },
    );
  }
  const showcase = scope.querySelector('[data-project-showcase]');
  if (showcase) {
    gsap.fromTo(
      showcase.querySelectorAll('[data-showcase-reveal]'),
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.055,
        ease: 'power2.out',
        scrollTrigger: { trigger: showcase, start: 'top 80%', once: true },
      },
    );
  }
}
