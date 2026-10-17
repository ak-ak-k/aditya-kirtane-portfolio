export type PortfolioSection = 'home' | 'about' | 'experience' | 'skills' | 'projects' | 'contact';

export type CursorMode = 'default' | 'pointer' | 'project' | 'open';

export interface PortfolioSectionConfig {
  readonly id: PortfolioSection;
  readonly path: string;
  readonly label: string;
}
