import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { EXPLORER_PROFILES } from '../../../core/constants/explorer-profiles';
import { PORTFOLIO } from '../../../core/constants/portfolio';
import { ExplorerProfile } from '../../../core/models/ui-state';
import { UiState } from '../../../core/services/ui-state';
import { EXPLORER_ASSETS, EXPLORER_SELECTION_SAFETY_MS } from './explorer.config';
import { EXPLORER_EFFECTS } from './explorer-effects';

@Component({
  selector: 'app-explorer',
  imports: [NgOptimizedImage],
  templateUrl: './explorer.html',
  styleUrl: './explorer.scss',
})
export class Explorer {
  private readonly state = inject(UiState);
  private readonly effects = inject(EXPLORER_EFFECTS);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private motionCleanup: (() => void) | undefined;
  private entrance: { kill: () => void } | undefined;
  private selectionAnimation: ((profile: ExplorerProfile) => void) | undefined;
  private safetyTimer: ReturnType<typeof setTimeout> | undefined;
  private entrancePlayed = false;
  private disposed = false;
  private committed = false;

  protected readonly profiles = EXPLORER_PROFILES;
  protected readonly portfolio = PORTFOLIO;
  protected readonly assets = EXPLORER_ASSETS;
  protected readonly pendingSelection = signal<ExplorerProfile | null>(null);
  protected readonly pendingProfile = computed(() =>
    this.profiles.find((profile) => profile.id === this.pendingSelection()),
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.disposed = true;
      this.clearSafetyTimer();
      this.motionCleanup?.();
    });
    afterNextRender(() => this.startMotion());
  }

  protected select(profile: ExplorerProfile): void {
    if (this.disposed || this.pendingSelection() || this.state.selectedProfile()) return;
    this.pendingSelection.set(profile);
    if (!this.selectionAnimation) {
      this.commitSelection();
      return;
    }

    this.entrance?.kill();
    this.safetyTimer = setTimeout(() => this.commitSelection(), EXPLORER_SELECTION_SAFETY_MS);
    this.selectionAnimation(profile);
  }

  private startMotion(): void {
    if (this.disposed) return;
    const scope = this.element.nativeElement;
    this.motionCleanup = this.effects.createMotionContext(scope, (context) => {
      if (this.disposed) return;
      if (!this.entrancePlayed) this.entrance = this.effects.playExplorerEntrance(scope);
      this.entrancePlayed = true;
      this.selectionAnimation = (profile) => {
        context.add(() =>
          this.effects.playExplorerSelection(scope, profile, () => this.commitSelection()),
        );
      };
      return () => {
        this.selectionAnimation = undefined;
        this.entrance = undefined;
        if (!this.disposed && this.pendingSelection()) this.commitSelection();
      };
    });
    // A later preference change may enable selection motion, but never replay entrance.
    this.entrancePlayed = true;
  }

  private commitSelection(): void {
    const profile = this.pendingSelection();
    if (!profile || this.disposed || this.destroyRef.destroyed || this.committed) return;
    this.committed = true;
    this.clearSafetyTimer();
    if (!this.state.selectedProfile()) this.state.selectProfile(profile);
  }

  private clearSafetyTimer(): void {
    if (this.safetyTimer !== undefined) clearTimeout(this.safetyTimer);
    this.safetyTimer = undefined;
  }
}
