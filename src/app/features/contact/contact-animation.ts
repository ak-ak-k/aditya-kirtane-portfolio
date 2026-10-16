import { gsap } from '../../animations/gsap';

export function animateContact(scope: HTMLElement): void {
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .fromTo(
      scope.querySelector('[data-contact-heading]'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.65 },
      0,
    )
    .fromTo(
      scope.querySelector('[data-contact-portrait]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.65 },
      0.12,
    )
    .fromTo(
      scope.querySelector('[data-contact-actions]'),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45 },
      0.2,
    )
    .fromTo(
      scope.querySelectorAll('[data-contact-card]'),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
      0.28,
    );
}
