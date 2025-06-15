// Personal Information Types
export interface PersonalInfo {
  name: string;
  title: string;
  affiliation: string;
  email: string;
  social_links: SocialLinks;
  research_areas: string[];
  skills: SkillCategories;
}

export interface SkillCategories {
  [category: string]: string[];
}



export interface SocialLinks {
  mastodon?: string;
  linkedin?: string;
  email?: string;
  google_scholar?: string;
  github?: string;
  twitter?: string;
  orcid?: string;
  bluesky?: string;
}

// Content Types
export interface ProjectData {
  slug: string;
  title: string;
  date: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  link?: string;
  demo?: string;
  content: string;
  exclude?: boolean;
  thumbnail?: string;
  descriptionOnly?: boolean;
}

export interface WritingData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: WritingCategory;
  content: string;
  tags?: string[];
  readingTime?: number;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  url?: string;
  doi?: string;
  pdf?: string;
  abstract?: string;
  type: PublicationType;
  status?: PublicationStatus;
  hide?: boolean;
  publisher?: string;
  editor?: string[];
  chapter?: string;
  school?: string;
  note?: string;
  thumbnail?: string;
}

// Enums
export type ProjectStatus = 'Active' | 'Completed' | 'In Progress' | 'On Hold';
export type WritingCategory = 'Research' | 'Opinion' | 'Tutorial' | 'Review' | 'News';
export type PublicationType = 'Journal Article' | 'Conference Paper' | 'Book Chapter' | 'Preprint' | 'Ph.D. Thesis' | 'Other';
export type PublicationStatus = 'Published' | 'In Press' | 'Under Review' | 'In Preparation';

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'link' | 'nav-link' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onclick?: () => void;
  class?: string;
  disabled?: boolean;
}

export interface MarkdownContentProps {
  content: string;
  class?: string;
}

// Page Data Types
export interface HomePageData {
  projects: ProjectData[];
  writings: WritingData[];
  publications?: Publication[];
}

export interface ProjectPageData {
  project: ProjectData;
  relatedProjects?: ProjectData[];
}

export interface WritingPageData {
  writing: WritingData;
  relatedWritings?: WritingData[];
}

// Configuration Types
export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author: PersonalInfo;
  navigation: NavigationItem[];
  features: SiteFeatures;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SiteFeatures {
  projects: boolean;
  writing: boolean;
  publications: boolean;
  cv: boolean;
  contact: boolean;
}

// Utility Types
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
} 