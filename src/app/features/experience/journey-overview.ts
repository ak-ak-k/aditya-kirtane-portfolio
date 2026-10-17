import { Component, input } from '@angular/core';
import type { CareerRole } from './experience.config';

@Component({
  selector: 'app-journey-overview',
  templateUrl: './journey-overview.html',
  styleUrl: './journey-overview.scss',
})
export class JourneyOverview {
  readonly roles = input.required<readonly CareerRole[]>();
}
