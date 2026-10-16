import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
} from '@angular/core';
import { UiState } from '../../core/services/ui-state';
import { CURSOR_EFFECTS, CURSOR_QUERY } from './cursor-effects';

@Component({
  selector: 'app-cursor',
  template: `<div
    #surface
    class="cursor-surface"
    [class.is-active]="active()"
    [attr.data-mode]="state.cursorMode()"
    aria-hidden="true"
  >
    <span class="cursor-dot" data-cursor-dot></span>
    <span class="cursor-ring" data-cursor-ring
      ><span class="cursor-ring-body"></span
      ><span class="cursor-label">{{
        state.cursorMode() === 'project' ? 'VIEW' : state.cursorMode() === 'open' ? 'OPEN' : ''
      }}</span></span
    >
  </div>`,
  styleUrl: './cursor.scss',
})
export class Cursor {
  protected readonly state = inject(UiState);
  protected readonly active = signal(false);
  private readonly effects = inject(CURSOR_EFFECTS);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly surface = viewChild.required<ElementRef<HTMLElement>>('surface');
  private stopTracking: (() => void) | undefined;
  private generation = 0;

  constructor() {
    afterNextRender(() => {
      const media = window.matchMedia(CURSOR_QUERY);
      const update = () => {
        void this.syncEligibility(media.matches && navigator.maxTouchPoints === 0);
      };
      media.addEventListener('change', update);
      this.destroyRef.onDestroy(() => {
        media.removeEventListener('change', update);
        this.disable();
      });
      update();
    });
  }

  private async syncEligibility(eligible: boolean): Promise<void> {
    this.disable();
    if (!eligible) return;
    const generation = this.generation;
    try {
      const start = await this.effects.loadTracking();
      if (this.destroyRef.destroyed || generation !== this.generation) return;
      this.zone.runOutsideAngular(() => {
        this.stopTracking = start(this.surface().nativeElement, (mode) =>
          this.state.setCursorMode(mode),
        );
      });
      this.active.set(true);
    } catch {
      // Native cursor is never hidden, including if the enhancement cannot initialize.
      if (generation === this.generation) this.disable();
    }
  }

  private disable(): void {
    this.generation++;
    this.stopTracking?.();
    this.stopTracking = undefined;
    this.active.set(false);
    this.state.setCursorMode('default');
  }
}
