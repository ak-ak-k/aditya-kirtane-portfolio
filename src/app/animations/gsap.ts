import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Import this entry only from features that need animation, after the DOM renders.
export { gsap, ScrollTrigger };

// Flip is optional and stays in its own chunk until a feature needs it.
export async function loadFlip() {
  const { Flip } = await import('gsap/Flip');
  gsap.registerPlugin(Flip);
  return Flip;
}
