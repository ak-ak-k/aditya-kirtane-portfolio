import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PORTFOLIO_PROJECT } from '../projects.config';

@Component({
  selector: 'app-portfolio-showcase',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './portfolio-showcase.html',
  styleUrl: './portfolio-showcase.scss',
})
export class PortfolioShowcase {
  protected readonly project = PORTFOLIO_PROJECT;
}
