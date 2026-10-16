import { gsap } from '../../animations/gsap';

export function animateExperience(scope: HTMLElement): void {
  gsap.fromTo(
    scope.querySelector('[data-career-heading]'),
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
  );
  for (const entry of scope.querySelectorAll<HTMLElement>('[data-career-entry]')) {
    const timeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: entry, start: 'top 82%', once: true },
    });
    timeline
      .fromTo(
        entry.querySelector('[data-career-node]'),
        { opacity: 0.45, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.25 },
        0,
      )
      .fromTo(
        entry.querySelector('[data-career-card]'),
        { opacity: 0, y: 28, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65 },
        0.12,
      );
    const segment = entry.querySelector('[data-career-line]');
    if (segment)
      timeline.fromTo(
        segment,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.65, transformOrigin: 'center top' },
        0.35,
      );
  }
}
