import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS, ProjectSummary } from '../projects.config';
import { PROJECTS_EFFECTS } from './projects-effects';

@Component({
  selector: 'app-project-list',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  private readonly effects = inject(PROJECTS_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly projects: readonly ProjectSummary[] = PROJECTS;

  constructor() {
    afterNextRender(() => {
      const scope = this.element.nativeElement;
      const cleanup = this.effects.createMotionContext(scope, () =>
        this.effects.animateProjects(scope),
      );
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
