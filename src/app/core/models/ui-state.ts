export type PortfolioSection = 'home' | 'about' | 'experience' | 'skills' | 'projects' | 'contact';

export type ExplorerProfile =
  'angular-engineer' | 'full-stack-builder' | 'product-thinker' | 'resume-viewer';

export type CursorMode = 'default' | 'pointer' | 'project' | 'open';

export interface PortfolioSectionConfig {
  readonly id: PortfolioSection;
  readonly path: string;
  readonly label: string;
}
