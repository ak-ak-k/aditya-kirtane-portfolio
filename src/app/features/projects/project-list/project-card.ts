import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatProjectIndex, ProjectSummary } from '../projects.config';

@Component({
  selector: 'app-project-card',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<ProjectSummary>();
  readonly index = input.required<number>();
  protected readonly formatProjectIndex = formatProjectIndex;
}
