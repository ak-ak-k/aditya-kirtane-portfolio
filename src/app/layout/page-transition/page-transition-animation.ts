import { gsap } from '../../animations/gsap';
import type { RouteTransitionAnimator } from './page-transition-effects';

export function createRouteTransition(
  scope: HTMLElement,
  complete: () => void,
): RouteTransitionAnimator {
  const veil = scope.querySelector('[data-transition-veil]');
  const edge = scope.querySelector('[data-transition-edge]');
  const context = gsap.context(() => undefined, scope);
  let timeline: gsap.core.Timeline | undefined;
  const reset = () => {
    timeline?.kill();
    timeline = undefined;
    context.revert();
  };
  return {
    start() {
      reset();
      context.add(() => {
        timeline = gsap
          .timeline()
          .fromTo(veil, { opacity: 0 }, { opacity: 0.12, duration: 0.15 }, 0)
          .fromTo(
            edge,
            { x: '-2vw', opacity: 0 },
            { x: '40vw', opacity: 1, duration: 0.2, ease: 'power2.in' },
            0,
          );
      });
    },
    finish() {
      timeline?.kill();
      context.add(() => {
        // A cached route can finish before the entrance has had a frame to paint.
        gsap.set(edge, { opacity: 1 });
        timeline = gsap
          .timeline({
            onComplete: () => {
              reset();
              complete();
            },
          })
          .fromTo(veil, { opacity: 0.08 }, { opacity: 0, duration: 0.3 }, 0)
          .to(edge, { x: '102vw', opacity: 0, duration: 0.35, ease: 'power2.out' }, 0);
      });
    },
    reset,
    destroy: reset,
  };
}
