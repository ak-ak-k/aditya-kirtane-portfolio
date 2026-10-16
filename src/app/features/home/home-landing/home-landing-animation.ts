import { gsap } from '../../../animations/gsap';

export function revealHome(scope: HTMLElement): void {
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .fromTo(
      scope.querySelector('[data-home-halo]'),
      { opacity: 0 },
      { opacity: 0.2, duration: 0.6 },
      0,
    )
    .fromTo(
      scope.querySelector('[data-home-portrait]'),
      { opacity: 0, y: 20, scale: 1.03 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7 },
      0.1,
    )
    .fromTo(
      scope.querySelectorAll('[data-home-copy]'),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 },
      0.15,
    )
    .fromTo(
      scope.querySelector('[data-home-actions]'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45 },
      0.55,
    )
    .fromTo(
      scope.querySelectorAll('[data-home-launcher]'),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
      0.75,
    );
}
