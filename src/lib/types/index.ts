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

// Experiment Types - MCMC Utility Estimation
export interface Lottery {
  p20: number; // Probability of £20
  p10: number; // Probability of £10
  p0: number;  // Probability of £0
}

export interface ChainState {
  id: number;
  current: Lottery;
}

export type Choice = 'current' | 'proposal';

export interface AgentLog {
  chainId: number;
  current: Lottery;
  proposal: Lottery;
  uCurrent: number;
  uProposal: number;
  accepted: boolean;
  timestamp: number;
}

export interface ParticipantLog {
  chainId: number;
  current: Lottery;
  proposal: Lottery;
  choice: Choice;
  responseTimeMs: number;
  timestamp: number;
}

export interface ExperimentSession {
  sessionId: string;
  chains: ChainState[];
  currentIndex: number;
  startTime: number;
  trialCount: number;
  agentLogs: AgentLog[];
  participantLogs: ParticipantLog[];
}

export type ExperimentScreen = 'instructions' | 'trial' | 'debrief';

export interface ExperimentInfo {
  slug: string;
  title: string;
  description: string;
  status: 'active' | 'coming-soon' | 'completed';
  tags: string[];
}

// Experiment Configuration Types
export interface DimensionRange {
  name: string;
  min: number;
  max: number;
  wrapped?: boolean; // For circular dimensions like Hue
}

export interface ColorDomainConfig {
  type: 'color';
  dimensions: 3;
  ranges: [
    DimensionRange & { name: 'Hue'; min: 0; max: 360; wrapped: true },
    DimensionRange & { name: 'Saturation'; min: 0; max: 100 },
    DimensionRange & { name: 'Lightness'; min: 0; max: 100 }
  ];
}

export interface ChordDomainConfig {
  type: 'chord';
  dimensions: 2;
  ranges: [
    DimensionRange & { name: 'Interval 1'; min: 0.5; max: 11.5 },
    DimensionRange & { name: 'Interval 2'; min: 0.5; max: 11.5 }
  ];
  rootFrequency: number; // e.g., 220 Hz
}

export type GSPDomainConfig = ColorDomainConfig | ChordDomainConfig;

export interface GSPConfig {
  domain: 'color' | 'chord';
  dimensions: number;
  m: number; // Samples per dimension
  targetIterations?: number; // Optional target iterations
  initialVector?: number[]; // Optional starting point
  domainConfig: GSPDomainConfig;
}

export interface MCMCConfig {
  targetTrials: number;
}

export interface ExperimentConfig {
  // Metadata
  slug: string;
  title: string;
  description: string;
  status: 'active' | 'coming-soon' | 'completed';
  tags: string[];

  // Experiment type
  type: 'mcmc-utility' | 'gsp';

  // GSP-specific specs (when type === 'gsp')
  gsp?: GSPConfig;

  // MCMC-specific specs (when type === 'mcmc-utility')
  mcmc?: MCMCConfig;
}

// GSP Experiment Types
export interface GSPSampleLog {
  dimensionIndex: number;
  iteration: number;
  sampleValue: number;
  timestamp: number;
  vector?: number[]; // Full vector state at the time of this sample (optional for backward compatibility)
}

export interface GSPSession {
  sessionId: string;
  experimentSlug: string;
  vector: number[];
  dimensionIndex: number;
  iteration: number;
  sampleCount: number;
  startTime: number;
  sampleLogs: GSPSampleLog[];
  completedIterations: number;
}