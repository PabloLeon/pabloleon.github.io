import type { ProjectData, WritingData, Publication } from '../types';
import { compile } from 'mdsvex';

/**
 * Sort projects by date (newest first)
 */
export function sortProjectsByDate(projects: ProjectData[]): ProjectData[] {
  return [...projects].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Sort writings by date (newest first)
 */
export function sortWritingsByDate(writings: WritingData[]): WritingData[] {
  return [...writings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Sort publications by year (newest first)
 */
export function sortPublicationsByYear(publications: Publication[]): Publication[] {
  return [...publications].sort((a, b) => b.year - a.year);
}

/**
 * Filter projects by status
 */
export function filterProjectsByStatus(projects: ProjectData[], status: string): ProjectData[] {
  return projects.filter(project => project.status === status);
}

/**
 * Filter writings by category
 */
export function filterWritingsByCategory(writings: WritingData[], category: string): WritingData[] {
  return writings.filter(writing => writing.category === category);
}

/**
 * Get unique tags from projects
 */
export function getProjectTags(projects: ProjectData[]): string[] {
  const tags = new Set<string>();
  projects.forEach(project => {
    project.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get unique tags from writings
 */
export function getWritingTags(writings: WritingData[]): string[] {
  const tags = new Set<string>();
  writings.forEach(writing => {
    writing.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get unique categories from writings
 */
export function getWritingCategories(writings: WritingData[]): string[] {
  const categories = new Set<string>();
  writings.forEach(writing => {
    categories.add(writing.category);
  });
  return Array.from(categories).sort();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date for display (short format)
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
}

/**
 * Search content by query
 */
export function searchProjects(projects: ProjectData[], query: string): ProjectData[] {
  const lowercaseQuery = query.toLowerCase();
  return projects.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    project.content.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Search writings by query
 */
export function searchWritings(writings: WritingData[], query: string): WritingData[] {
  const lowercaseQuery = query.toLowerCase();
  return writings.filter(writing => 
    writing.title.toLowerCase().includes(lowercaseQuery) ||
    writing.excerpt.toLowerCase().includes(lowercaseQuery) ||
    writing.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    writing.content.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get related projects based on tags
 */
export function getRelatedProjects(currentProject: ProjectData, allProjects: ProjectData[], limit: number = 3): ProjectData[] {
  const related = allProjects
    .filter(project => project.slug !== currentProject.slug)
    .map(project => ({
      project,
      score: project.tags.filter(tag => currentProject.tags.includes(tag)).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.project);

  return related;
}

/**
 * Get related writings based on tags and category
 */
export function getRelatedWritings(currentWriting: WritingData, allWritings: WritingData[], limit: number = 3): WritingData[] {
  const related = allWritings
    .filter(writing => writing.slug !== currentWriting.slug)
    .map(writing => {
      let score = 0;
      
      // Same category gets higher score
      if (writing.category === currentWriting.category) {
        score += 3;
      }
      
      // Shared tags get points
      if (writing.tags && currentWriting.tags) {
        score += writing.tags.filter(tag => currentWriting.tags!.includes(tag)).length;
      }
      
      return { writing, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.writing);

  return related;
}

// === MARKDOWN PROCESSING FUNCTIONS ===
// Consolidated from utils.ts to avoid duplication

/**
 * Process MDSvex content with custom options
 */
export async function processMDSvex(content: string, options = {}) {
	const defaultOptions = {
		extension: '.svx',
		smartypants: {
			dashes: 'oldschool' as const
		},
		highlight: {
			alias: { js: 'javascript', ts: 'typescript' }
		},
		layout: {
			_: './src/lib/layouts/default.svelte'
		},
		...options
	};

	try {
		const result = await compile(content, defaultOptions);
		return result;
	} catch (error) {
		console.error('Error processing MDSvex content:', error);
		return { code: '', data: {} };
	}
}

/**
 * Extract frontmatter and content from markdown
 */
export function extractFrontmatter(content: string) {
	const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);
	
	if (match) {
		const [, frontmatter, body] = match;
		const metadata: Record<string, any> = {};
		
		frontmatter.split('\n').forEach(line => {
			const colonIndex = line.indexOf(':');
			if (colonIndex !== -1) {
				const key = line.substring(0, colonIndex).trim();
				const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
				metadata[key] = value;
			}
		});
		
		return { metadata, content: body.trim() };
	}
	
	return { metadata: {}, content };
}

/**
 * Generate excerpt from content (enhanced version with frontmatter support)
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
	const { content: body } = extractFrontmatter(content);
	
	const plainText = body
		.replace(/#{1,6}\s+/g, '')
		.replace(/\*\*(.*?)\*\*/g, '$1')
		.replace(/\*(.*?)\*/g, '$1')
		.replace(/\[(.*?)\]\(.*?\)/g, '$1')
		.replace(/`(.*?)`/g, '$1')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/\n+/g, ' ')
		.trim();

	if (plainText.length <= maxLength) {
		return plainText;
	}

	return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * Calculate estimated reading time for content (enhanced version with frontmatter support)
 */
export function calculateReadingTime(content: string): number {
	const { content: body } = extractFrontmatter(content);
	const wordsPerMinute = 200;
	const words = body.trim().split(/\s+/).length;
	return Math.ceil(words / wordsPerMinute);
}

/**
 * Extract headings from markdown content
 */
export function extractHeadings(content: string): Array<{ level: number; text: string; id: string }> {
	const { content: body } = extractFrontmatter(content);
	const headingRegex = /^(#{1,6})\s+(.+)$/gm;
	const headings: Array<{ level: number; text: string; id: string }> = [];
	
	let match;
	while ((match = headingRegex.exec(body)) !== null) {
		const level = match[1].length;
		const text = match[2].trim();
		const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
		
		headings.push({ level, text, id });
	}
	
	return headings;
}

/**
 * Validate markdown structure and return errors/warnings
 */
export function validateMarkdownStructure(content: string): { 
	isValid: boolean; 
	errors: string[]; 
	warnings: string[] 
} {
	const errors: string[] = [];
	const warnings: string[] = [];
	const { metadata, content: body } = extractFrontmatter(content);
	
	if (!metadata.title) errors.push('Missing title in frontmatter');
	if (!metadata.date) errors.push('Missing date in frontmatter');
	
	if (!body.trim()) errors.push('Empty content body');
	
	const headings = extractHeadings(content);
	for (let i = 1; i < headings.length; i++) {
		const prev = headings[i - 1];
		const curr = headings[i];
		if (curr.level > prev.level + 1) {
			warnings.push(`Heading level jump from h${prev.level} to h${curr.level}`);
		}
	}
	
	return {
		isValid: errors.length === 0,
		errors,
		warnings
	};
} 