import { gsap } from '../../../animations/gsap';
import { ExplorerProfile } from '../../../core/models/ui-state';

export function playExplorerEntrance(scope: HTMLElement): { kill: () => void } {
  return gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .fromTo(
      scope.querySelector('[data-explorer-heading]'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45 },
    )
    .fromTo(
      scope.querySelectorAll('[data-profile-panel]'),
      { opacity: 0, y: 48, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
      0.2,
    );
}

export function playExplorerSelection(
  scope: HTMLElement,
  profile: ExplorerProfile,
  onComplete: () => void,
): void {
  const panels = Array.from(scope.querySelectorAll<HTMLElement>('[data-profile-panel]'));
  const selected = panels.find((panel) => panel.dataset['profilePanel'] === profile);
  const others = panels.filter((panel) => panel !== selected);
  gsap.set(scope.querySelector('[data-explorer-heading]'), { opacity: 1, y: 0 });
  gsap.set(panels, { opacity: 1, y: 0, scale: 1 });

  gsap
    .timeline({ onComplete, defaults: { ease: 'power2.out' } })
    .to(others, { opacity: 0.78, y: 12, scale: 0.97, duration: 0.4 }, 0)
    .to(selected ?? [], { scale: 1.045, y: -6, duration: 0.55 }, 0)
    .fromTo(
      selected?.querySelector('[data-profile-sweep]') ?? [],
      { xPercent: -110, opacity: 0 },
      { xPercent: 110, opacity: 0.45, duration: 0.6, ease: 'power1.inOut' },
      0,
    )
    .to(selected?.querySelector('[data-profile-sweep]') ?? [], { opacity: 0, duration: 0.15 }, 0.5);
}
