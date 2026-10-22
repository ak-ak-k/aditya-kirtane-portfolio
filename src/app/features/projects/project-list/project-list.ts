import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../projects.config';
import { ProjectCard } from './project-card';
import { PortfolioShowcase } from './portfolio-showcase';
import { PROJECTS_EFFECTS } from './projects-effects';

@Component({
  selector: 'app-project-list',
  imports: [RouterLink, ProjectCard, PortfolioShowcase],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  private readonly effects = inject(PROJECTS_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly projects = PROJECTS;
  private readonly entries = PROJECTS.map((project, index) => ({ project, index }));
  protected readonly independentProjects = this.entries.filter(
    ({ project }) => project.ownership === 'personal',
  );
  protected readonly professionalProjects = this.entries.filter(
    ({ project }) => project.ownership === 'professional',
  );
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
