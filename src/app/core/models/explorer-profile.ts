import { ExplorerProfile } from './ui-state';

export interface ExplorerProfileDefinition {
  readonly id: ExplorerProfile;
  readonly title: string;
  readonly description: string;
  readonly icon: `assets/icons/ui/${'code' | 'server' | 'skills' | 'download'}.svg`;
  readonly visualTheme: 'angular' | 'stack' | 'product' | 'resume';
  readonly decorativeLabels: readonly string[];
}
