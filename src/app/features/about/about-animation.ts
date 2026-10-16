import { gsap } from '../../animations/gsap';

export function animateAbout(scope: HTMLElement): void {
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .fromTo(
      scope.querySelector('[data-about-heading]'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6 },
      0,
    )
    .fromTo(
      scope.querySelector('[data-about-portrait]'),
      { opacity: 0, y: 20, scale: 1.025 },
      { opacity: 1, y: 0, scale: 1, duration: 0.75 },
      0.1,
    )
    .fromTo(
      scope.querySelector('[data-about-story]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.55 },
      0.25,
    )
    .fromTo(
      scope.querySelectorAll('[data-about-badge]'),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 },
      0.5,
    );

  for (const group of scope.querySelectorAll<HTMLElement>('[data-about-reveal-group]')) {
    gsap.fromTo(
      group.querySelectorAll('[data-about-reveal]'),
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: group, start: 'top 90%', once: true },
      },
    );
  }
}
