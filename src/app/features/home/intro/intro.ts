import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { PORTFOLIO } from '../../../core/constants/portfolio';
import { UiState } from '../../../core/services/ui-state';
import { INTRO_EFFECTS } from './intro-effects';
import { INTRO_ASSETS, INTRO_TIMING } from './intro.config';

@Component({
  selector: 'app-intro',
  imports: [NgOptimizedImage],
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro {
  private readonly state = inject(UiState);
  private readonly effects = inject(INTRO_EFFECTS);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly assetCancellation = new AbortController();
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private motionCleanup: (() => void) | undefined;
  private exitAnimation: (() => void) | undefined;
  private revealFinished = false;
  private exitStarted = false;
  private finished = false;

  protected readonly portfolio = PORTFOLIO;
  protected readonly nameWords = PORTFOLIO.name.split(' ');
  protected readonly assets = INTRO_ASSETS;
  protected readonly assetsReady = signal(false);
  protected readonly portraitUnavailable = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.finished = true;
      this.assetCancellation.abort();
      this.clearTimers();
      this.cleanupMotion();
    });
    afterNextRender(() => this.start());
  }

  protected skip(): void {
    this.finish();
  }

  private start(): void {
    if (this.finished || this.destroyRef.destroyed) return;
    const scope = this.element.nativeElement;
    this.schedule(() => this.finish(), INTRO_TIMING.safetyMs);
    const images = Array.from(scope.querySelectorAll<HTMLImageElement>('[data-intro-critical]'));
    void this.effects.waitForCriticalImages(images, this.assetCancellation.signal).then(() => {
      if (this.finished) return;
      this.assetsReady.set(true);
      this.tryExit();
    });

    let cinematicStarted = false;
    this.motionCleanup = this.effects.createMotionContext(scope, (context) => {
      if (this.finished || cinematicStarted) return;
      cinematicStarted = true;
      this.revealFinished = false;
      this.exitAnimation = () => {
        // Readiness resolves asynchronously; add the exit to the same scoped context.
        context.add(() => this.effects.playIntroExit(scope, () => this.finish()));
      };
      this.effects.playIntroReveal(scope, () => {
        this.revealFinished = true;
        this.tryExit();
      });
      return () => {
        this.exitAnimation = undefined;
        if (!this.finished && !this.destroyRef.destroyed) this.startReducedMotion();
      };
    });
    if (!cinematicStarted) {
      cinematicStarted = true;
      this.startReducedMotion();
    }
  }

  private startReducedMotion(): void {
    // The existing matchMedia helper owns the preference. Base styles are fully visible.
    this.exitStarted = false;
    this.schedule(() => {
      this.revealFinished = true;
      this.tryExit();
    }, INTRO_TIMING.reducedHoldMs);
    this.schedule(() => this.finish(), INTRO_TIMING.reducedSafetyMs);
  }

  private tryExit(): void {
    if (this.finished || this.exitStarted || !this.revealFinished || !this.assetsReady()) return;
    this.exitStarted = true;
    if (this.exitAnimation) this.exitAnimation();
    else this.finish();
  }

  private finish(): void {
    if (this.finished || this.destroyRef.destroyed) return;
    this.finished = true;
    this.clearTimers();
    this.assetCancellation.abort();
    this.cleanupMotion();
    this.state.completeIntro();
  }

  private schedule(callback: () => void, delay: number): void {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (!this.finished) callback();
    }, delay);
    this.timers.add(timer);
  }

  private clearTimers(): void {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
  }

  private cleanupMotion(): void {
    const cleanup = this.motionCleanup;
    this.motionCleanup = undefined;
    cleanup?.();
  }
}
