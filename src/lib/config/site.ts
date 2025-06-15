import type { SiteConfig } from '../types';
import { personalInfo } from '../data/personal';

export const siteConfig: SiteConfig = {
  title: `${personalInfo.name} - ${personalInfo.title}`,
  description: `${personalInfo.name} is a ${personalInfo.title} at ${personalInfo.affiliation}, specializing in ${personalInfo.research_areas.slice(0, 3).join(', ')}.`,
  url: 'https://your-domain.com', // Update with your actual domain
  author: personalInfo,
  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Writing', href: '#writing' },
    { label: 'Publications', href: '#publications' },
  ],
  features: {
    projects: true,
    writing: true,
    publications: true,
    cv: true,
    contact: true,
  },
};

// SEO and metadata configuration
export const defaultMetadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    ...personalInfo.research_areas,
    personalInfo.name,
    personalInfo.affiliation,
    'research',
    'academic',
    'portfolio'
  ],
  ogImage: '/assets/images/og-image.png', // Add your OG image
  canonical: siteConfig.url,
};

// Social media configuration
export const socialConfig = {
  ...personalInfo.social_links,
  // Add any additional social platforms or override existing ones
};

// Content configuration
export const contentConfig = {
  projectsPerPage: 6,
  writingsPerPage: 5,
  publicationsPerPage: 10,
  showReadingTime: true,
  showTags: true,
  enableComments: false, // Set to true if you want to add comments
  enableSearch: false, // Set to true if you want to add search functionality
}; 