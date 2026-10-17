import { Component, inject } from '@angular/core';
import { UiState } from '../../core/services/ui-state';
import { Intro } from './intro/intro';
import { HomeLanding } from './home-landing/home-landing';

@Component({
  selector: 'app-home',
  imports: [Intro, HomeLanding],
  templateUrl: './home.html',
})
export class Home {
  protected readonly state = inject(UiState);
}
