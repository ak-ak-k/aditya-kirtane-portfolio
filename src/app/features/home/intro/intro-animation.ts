import { gsap } from '../../../animations/gsap';

export function playIntroReveal(scope: HTMLElement, onComplete: () => void): void {
  const timeline = gsap.timeline({ onComplete, defaults: { ease: 'power3.out' } });
  timeline
    .fromTo(
      scope.querySelector('[data-intro-logo]'),
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.6 },
      0.3,
    )
    .fromTo(
      scope.querySelector('[data-intro-portrait]'),
      { opacity: 0, scale: 1.04, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.75 },
      0.65,
    )
    .fromTo(
      scope.querySelectorAll('[data-intro-word]'),
      { opacity: 0, yPercent: 105 },
      { opacity: 1, yPercent: 0, stagger: 0.12, duration: 0.7 },
      1,
    )
    .fromTo(
      scope.querySelector('[data-intro-subtitle]'),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5 },
      1.4,
    )
    .fromTo(
      scope.querySelector('[data-intro-loading]'),
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      1.7,
    )
    .fromTo(
      scope.querySelector('[data-intro-progress]'),
      { scaleX: 0 },
      { scaleX: 0.86, duration: 1.1, ease: 'power2.out' },
      1.7,
    );
}

export function playIntroExit(scope: HTMLElement, onComplete: () => void): void {
  gsap
    .timeline({ onComplete })
    .to(scope.querySelector('[data-intro-progress]'), { scaleX: 1, duration: 0.15 })
    .to(scope, { opacity: 0, duration: 0.35, ease: 'power2.inOut' });
}
