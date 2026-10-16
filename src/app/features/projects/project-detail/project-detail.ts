import { NgOptimizedImage } from '@angular/common';
import { afterRenderEffect, Component, computed, ElementRef, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getProjectDetail } from './project-detail.config';
import { PROJECT_DETAIL_EFFECTS } from './project-detail-effects';

@Component({
  selector: 'app-project-detail',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  readonly slug = input.required<string>();
  protected readonly detail = computed(() => getProjectDetail(this.slug()));
  private readonly effects = inject(PROJECT_DETAIL_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterRenderEffect((onCleanup) => {
      const detail = this.detail();
      if (!detail) return;
      const scope = this.element.nativeElement;
      onCleanup(
        this.effects.createMotionContext(scope, () => this.effects.animateProjectDetail(scope)),
      );
    });
  }
}
