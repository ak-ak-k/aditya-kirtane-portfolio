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

  const journey = scope.querySelector('[data-journey]');
  if (!journey) return;
  const progression = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: { trigger: journey, start: 'top 82%', once: true },
  });
  progression
    .fromTo(
      journey.querySelector('[data-journey-heading]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5 },
      0,
    )
    .fromTo(
      journey.querySelector('[data-journey-landscape]'),
      { opacity: 0, scale: 1.02 },
      { opacity: 1, scale: 1, duration: 0.7 },
      0.1,
    )
    .fromTo(
      journey.querySelector('[data-journey-path]'),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' },
      0.4,
    );
  const milestones = Array.from(journey.querySelectorAll('[data-journey-milestone]')).reverse();
  milestones.forEach((milestone, index) => {
    const at = 0.7 + index * 0.4;
    progression
      .fromTo(
        milestone.querySelector('[data-journey-node]'),
        { opacity: 0.2, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.3 },
        at,
      )
      .fromTo(
        milestone.querySelector('[data-journey-caption]'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        at + 0.1,
      );
  });
}
