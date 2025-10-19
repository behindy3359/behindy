export interface AboutPage {
  slug: string;
  title: string;
  description: string;
  icon?: string;
}

export type AboutPageSlug =
  | 'overview'
  | 'backend'
  | 'frontend'
  | 'aiserver'
  | 'devops'
  | 'development';

export interface AboutNavigationItem {
  slug: AboutPageSlug;
  label: string;
  path: string;
}

// ProjectStructureDiagram types
export interface TreeItem {
  name: string;
  type: 'folder' | 'file';
  comment?: string;
  badge?: string;
  children?: TreeItem[];
  isLast?: boolean;
}
