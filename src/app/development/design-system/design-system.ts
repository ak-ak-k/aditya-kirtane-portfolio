import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { PORTFOLIO } from '../../core/constants/portfolio';

@Component({
  selector: 'app-design-system',
  imports: [NgOptimizedImage],
  templateUrl: './design-system.html',
  styleUrl: './design-system.scss',
})
export class DesignSystem {
  protected readonly portfolio = PORTFOLIO;
  protected readonly actionMessage = signal('Try a button to inspect its interaction state.');
  protected readonly selectedCategory = signal('All');
  protected readonly categories = ['All', 'Engineering', 'Product'];
  protected readonly technologies = ['Angular', 'TypeScript', 'RxJS', 'Node.js'];

  protected readonly colors = [
    { name: 'Background', token: '--color-bg', value: '#070709' },
    { name: 'Elevated', token: '--color-bg-elevated', value: 'Surface + 3% text' },
    { name: 'Surface', token: '--color-surface', value: '#101014' },
    { name: 'Hover surface', token: '--color-surface-hover', value: 'Surface + 4% text' },
    { name: 'Text', token: '--color-text', value: '#f3f4f6' },
    { name: 'Muted text', token: '--color-text-muted', value: '#9ca3af' },
    { name: 'Accent', token: '--color-accent', value: '#ff2038' },
    { name: 'Hover accent', token: '--color-accent-hover', value: 'Accent + 15% text' },
    { name: 'Dark accent', token: '--color-accent-dark', value: '#c80f28' },
    { name: 'Border', token: '--color-border', value: 'Muted at 22%' },
    { name: 'Accent border', token: '--color-border-accent', value: 'Accent at 35%' },
    { name: 'Success', token: '--color-success', value: '#86d7ac' },
  ];

  protected readonly typeScale = [
    { name: 'Display XL', className: 'text-display-xl', sample: 'Precision', range: '52–144 px' },
    { name: 'Display', className: 'text-display', sample: 'Built with intent', range: '44–104 px' },
    {
      name: 'Heading 1',
      className: 'text-heading-1',
      sample: 'Ideas into interfaces',
      range: '36–72 px',
    },
    {
      name: 'Heading 2',
      className: 'text-heading-2',
      sample: 'Thoughtful by design',
      range: '28–48 px',
    },
    {
      name: 'Heading 3',
      className: 'text-heading-3',
      sample: 'Make the details matter',
      range: '22–32 px',
    },
    {
      name: 'Heading 4',
      className: 'text-heading-4',
      sample: 'Clear. Considered. Useful.',
      range: '18–22 px',
    },
    {
      name: 'Body large',
      className: 'text-body-lg',
      sample: 'A clear interface gives good work room to speak.',
      range: '18–20 px',
    },
    {
      name: 'Body',
      className: 'text-body',
      sample: 'Strong hierarchy. Comfortable reading. A little cinematic edge.',
      range: '16–17 px',
    },
    {
      name: 'Body small',
      className: 'text-body-sm',
      sample: 'Supporting detail stays quiet, never invisible.',
      range: '14–15 px',
    },
    {
      name: 'Eyebrow / label',
      className: 'text-label',
      sample: 'Designed with purpose',
      range: '12–13 px',
    },
    {
      name: 'Code / meta',
      className: 'text-meta',
      sample: 'const intent = signal("build");',
      range: '13–14 px',
    },
  ];

  protected readonly backgrounds = [
    { name: 'Dark base', className: 'bg-dark', token: '.bg-dark' },
    { name: 'Radial glow', className: 'bg-red-glow', token: '.bg-red-glow' },
    { name: 'Technical grid', className: 'bg-grid', token: '.bg-grid' },
    { name: 'Quiet grain', className: 'bg-noise', token: '.bg-noise' },
    { name: 'Smoke', className: 'bg-smoke', token: '.bg-smoke' },
    { name: 'Halo', className: 'bg-halo', token: '.bg-halo' },
    { name: 'Light streak', className: 'bg-light-streak', token: '.bg-light-streak' },
    { name: 'Particles', className: 'bg-particles', token: '.bg-particles' },
  ];

  protected readonly portraits = [
    { name: 'Base', className: '', token: '.portrait' },
    { name: 'Hero fade', className: 'portrait--hero', token: '.portrait--hero' },
    { name: 'Card crop', className: 'portrait--card', token: '.portrait--card' },
    { name: 'Ghost', className: 'portrait--ghost', token: '.portrait--ghost' },
    {
      name: 'Red treatment',
      className: 'portrait--red-treatment',
      token: '.portrait--red-treatment',
    },
  ];

  protected readonly iconSizes = [
    { name: 'Small', className: 'icon--sm', size: '16 px' },
    { name: 'Medium', className: 'icon--md', size: '20 px' },
    { name: 'Large', className: 'icon--lg', size: '24 px' },
    { name: 'Extra large', className: 'icon--xl', size: '32 px' },
  ];

  protected previewAction(label: string): void {
    this.actionMessage.set(`${label} preview activated. No portfolio action is performed.`);
  }
}
