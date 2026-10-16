import { gsap } from '../../animations/gsap';
import { CursorMode } from '../../core/models/ui-state';

export function startCursorTracking(
  scope: HTMLElement,
  setMode: (mode: CursorMode) => void,
): () => void {
  const dot = scope.querySelector<HTMLElement>('[data-cursor-dot]');
  const ring = scope.querySelector<HTMLElement>('[data-cursor-ring]');
  if (!dot || !ring) return () => undefined;
  const context = gsap.context(() => undefined, scope);
  let moveDotX: (value: number) => void = () => undefined;
  let moveDotY: (value: number) => void = () => undefined;
  let moveRingX: (value: number) => void = () => undefined;
  let moveRingY: (value: number) => void = () => undefined;
  let placeRingX: (value: number) => void = () => undefined;
  let placeRingY: (value: number) => void = () => undefined;
  context.add(() => {
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    moveDotX = (value) => setDotX(value);
    moveDotY = (value) => setDotY(value);
    const setRingX = gsap.quickSetter(ring, 'x', 'px');
    const setRingY = gsap.quickSetter(ring, 'y', 'px');
    placeRingX = (value) => setRingX(value);
    placeRingY = (value) => setRingY(value);
    moveRingX = gsap.quickTo(ring, 'x', { duration: 0.16, ease: 'power2.out' });
    moveRingY = gsap.quickTo(ring, 'y', { duration: 0.16, ease: 'power2.out' });
  });
  let visible = false;
  const updateMode = setMode;
  const modeFor = (target: EventTarget | null): CursorMode => {
    const control =
      target instanceof Element
        ? target.closest('a[href], button, input, textarea, select, [role="button"], [data-cursor]')
        : null;
    if (!control || control.matches(':disabled, [aria-disabled="true"]')) return 'default';
    const requested = control.getAttribute('data-cursor');
    return requested === 'project' || requested === 'open' ? requested : 'pointer';
  };
  const hide = () => {
    visible = false;
    scope.removeAttribute('data-visible');
    updateMode('default');
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') {
      hide();
      return;
    }
    moveDotX(event.clientX);
    moveDotY(event.clientY);
    if (!visible) {
      placeRingX(event.clientX);
      placeRingY(event.clientY);
      scope.setAttribute('data-visible', 'true');
      visible = true;
    }
    moveRingX(event.clientX);
    moveRingY(event.clientY);
  };
  const onOver = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') updateMode(modeFor(event.target));
  };
  const onOut = (event: PointerEvent) => {
    if (!event.relatedTarget) hide();
    else updateMode(modeFor(event.relatedTarget));
  };
  const document = scope.ownerDocument;
  const window = document.defaultView;
  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  document.addEventListener('pointerout', onOut, { passive: true });
  document.addEventListener('keydown', hide);
  window?.addEventListener('blur', hide);
  return () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    document.removeEventListener('pointerout', onOut);
    document.removeEventListener('keydown', hide);
    window?.removeEventListener('blur', hide);
    hide();
    context.revert();
  };
}
