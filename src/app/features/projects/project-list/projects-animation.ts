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
}
