import { gsap } from '../../animations/gsap';

export function animateSkills(scope: HTMLElement): void {
  gsap.fromTo(
    scope.querySelector('[data-skills-heading]'),
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
  );
  for (const category of scope.querySelectorAll<HTMLElement>('[data-skill-category]')) {
    gsap
      .timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: category, start: 'top 85%', once: true },
      })
      .fromTo(category, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(
        category.querySelector('[data-skills-group]'),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35 },
        0.15,
      );
  }
}
