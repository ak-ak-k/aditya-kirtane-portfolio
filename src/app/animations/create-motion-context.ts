import { gsap } from './gsap';

export const MOTION_ALLOWED_QUERY = '(prefers-reduced-motion: no-preference)';

/** Call after rendering, then register the returned cleanup with DestroyRef.onDestroy. */
export function createMotionContext(
  scope: Element,
  animate: (context: gsap.Context) => void | (() => void),
): () => void {
  const media = gsap.matchMedia();
  media.add(MOTION_ALLOWED_QUERY, animate, scope);
  return () => media.revert();
}
