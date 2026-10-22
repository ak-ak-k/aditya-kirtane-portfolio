import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import type { CaseStudySection as SectionData } from './project-detail.config';

@Component({
  selector: 'app-case-study-section',
  imports: [NgOptimizedImage],
  templateUrl: './case-study-section.html',
  styleUrl: './case-study-section.scss',
})
export class CaseStudySection {
  readonly section = input.required<SectionData>();
}
