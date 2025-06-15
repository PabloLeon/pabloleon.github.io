import { dev } from '$app/environment';
import type { ProjectData, WritingData } from './types';

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): { metadata: any; content: string } {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);
	
	if (!match) {
		return { metadata: {}, content };
	}
	
	const [, frontmatterText, markdownContent] = match;
	const metadata: any = {};
	
	// Simple YAML parser for our frontmatter
	frontmatterText.split('\n').forEach(line => {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) return;
		
		const colonIndex = trimmed.indexOf(':');
		if (colonIndex === -1) return;
		
		const key = trimmed.slice(0, colonIndex).trim();
		let value = trimmed.slice(colonIndex + 1).trim();
		
		// Remove quotes if present
		if ((value.startsWith('"') && value.endsWith('"')) || 
		    (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		
		// Handle arrays (simple format: ["item1", "item2"])
		if (value.startsWith('[') && value.endsWith(']')) {
			const arrayContent = value.slice(1, -1);
			metadata[key] = arrayContent.split(',').map(item => 
				item.trim().replace(/^["']|["']$/g, '')
			).filter(item => item.length > 0);
		} else {
			// Handle boolean values
			if (value === 'true') {
				metadata[key] = true;
			} else if (value === 'false') {
				metadata[key] = false;
			} else {
				metadata[key] = value;
			}
		}
	});
	
	return { metadata, content: markdownContent };
}

// Enhanced markdown processing for content
export function processMarkdown(content: string): string {
	// First, let's handle special cases and escape some content
	let processed = content;
	
	// Handle image suggestions (special case for this content)
	processed = processed.replace(/!\[Image suggestion:([^\]]*)\]/g, '<div class="bg-blue-50 border-l-4 border-blue-200 p-4 my-6 rounded-r-lg"><p class="text-blue-800 text-sm font-medium mb-2">💡 Image Suggestion</p><p class="text-blue-700 text-sm">$1</p></div>');
	
	// Handle regular images
	processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto rounded-lg shadow-sm my-8" />');
	
	// Handle links
	processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="link-content">$1</a>');
	
	// Split into paragraphs and process
	const paragraphs = processed.split(/\n\s*\n/);
	const processedParagraphs = paragraphs.map(paragraph => {
		const trimmed = paragraph.trim();
		if (!trimmed) return '';
		
		// Handle headings
		if (trimmed.startsWith('## ')) {
			return `<h2 class="text-2xl sm:text-3xl font-semibold text-primary-600 mt-12 mb-6 first:mt-0">${trimmed.replace(/^## /, '')}</h2>`;
		}
		if (trimmed.startsWith('### ')) {
			return `<h3 class="text-xl sm:text-2xl font-semibold text-gray-800 mt-10 mb-5">${trimmed.replace(/^### /, '')}</h3>`;
		}
		if (trimmed.startsWith('#### ')) {
			return `<h4 class="text-lg sm:text-xl font-semibold text-gray-800 mt-8 mb-4">${trimmed.replace(/^#### /, '')}</h4>`;
		}
		
		// Handle unordered lists
		if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
			const listItems = trimmed.split('\n').filter(line => line.trim().startsWith('- '));
			const processedItems = listItems.map(item => {
				const content = item.replace(/^- /, '').trim();
				return `<li class="mb-3">${processInlineFormatting(content)}</li>`;
			}).join('');
			return `<ul class="list-disc pl-6 space-y-2 my-6">${processedItems}</ul>`;
		}
		
		// Handle ordered lists
		if (/^\d+\. /.test(trimmed) || trimmed.includes('\n') && /\d+\. /.test(trimmed)) {
			const listItems = trimmed.split('\n').filter(line => /^\d+\. /.test(line.trim()));
			const processedItems = listItems.map(item => {
				const content = item.replace(/^\d+\. /, '').trim();
				return `<li class="mb-3">${processInlineFormatting(content)}</li>`;
			}).join('');
			return `<ol class="list-decimal pl-6 space-y-2 my-6">${processedItems}</ol>`;
		}
		
		// Handle special div blocks (already processed image suggestions)
		if (trimmed.startsWith('<div class="bg-blue-50')) {
			return trimmed;
		}
		
		// Handle images (already processed)
		if (trimmed.startsWith('<img')) {
			return trimmed;
		}
		
		// Regular paragraphs
		return `<p class="mb-6 leading-relaxed">${processInlineFormatting(trimmed)}</p>`;
	}).filter(p => p);
	
	return processedParagraphs.join('\n');
}

// Helper function to process inline formatting
function processInlineFormatting(text: string): string {
	return text
		// Bold text
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
		// Italic text  
		.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
		// Inline code
		.replace(/`(.*?)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
		// Links (if not already processed)
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="link-content">$1</a>');
}

// Load all project markdown files
export async function getProjects(): Promise<ProjectData[]> {
	const projectFiles = import.meta.glob('../content/projects/*.md', { 
		query: '?raw', 
		import: 'default' 
	});
	const projects: ProjectData[] = [];
	
	console.log('getProjects: Found project files:', Object.keys(projectFiles));
	
	for (const [path, loader] of Object.entries(projectFiles)) {
		try {
		const content = await loader() as string;
			console.log(`getProjects: Processing file ${path}`);
			console.log(`getProjects: Raw content length: ${content.length}`);
			
		const { metadata, content: markdownContent } = parseFrontmatter(content);
			console.log(`getProjects: Parsed metadata for ${path}:`, metadata);
		
		// Extract slug from filename
		const filename = path.split('/').pop()?.replace('.md', '') || '';
		
			const projectData = {
			slug: filename,
			title: metadata.title || filename,
			date: metadata.date || new Date().toISOString().split('T')[0],
			description: metadata.description || '',
			status: metadata.status || 'Active',
			tags: Array.isArray(metadata.tags) ? metadata.tags : [],
			link: metadata.link,
			demo: metadata.demo,
			thumbnail: metadata.thumbnail,
			content: markdownContent.trim(),
			exclude: metadata.exclude || false,
			descriptionOnly: metadata.descriptionOnly || false
			};
			
			console.log(`getProjects: Created project data for ${filename}:`, projectData);
			projects.push(projectData);
		} catch (error) {
			console.error(`getProjects: Error processing ${path}:`, error);
	}
	}
	
	console.log(`getProjects: Total projects before filtering: ${projects.length}`);
	
	// Filter out excluded projects and sort by date (newest first)
	const filteredProjects = projects
		.filter(project => !project.exclude)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		
	console.log(`getProjects: Projects after filtering: ${filteredProjects.length}`);
	console.log('getProjects: Final projects:', filteredProjects);
	
	return filteredProjects;
}

// Load all writing markdown files  
export async function getWritings(): Promise<WritingData[]> {
	const writingFiles = import.meta.glob('../content/writing/*.md', { 
		query: '?raw', 
		import: 'default' 
	});
	const writings: WritingData[] = [];
	
	for (const [path, loader] of Object.entries(writingFiles)) {
		const content = await loader() as string;
		const { metadata, content: markdownContent } = parseFrontmatter(content);
		
		// Extract slug from filename
		const filename = path.split('/').pop()?.replace('.md', '') || '';
		
		writings.push({
			slug: filename,
			title: metadata.title || filename,
			date: metadata.date || new Date().toISOString().split('T')[0],
			excerpt: metadata.excerpt || metadata.description || '',
			category: metadata.category || 'Article',
			tags: Array.isArray(metadata.tags) ? metadata.tags : [],
			readingTime: metadata.readingTime || 5,
			content: markdownContent.trim()
		});
	}
	
	// Sort by date (newest first)
	return writings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
	const projects = await getProjects();
	return projects.find(p => p.slug === slug) || null;
}

export async function getWritingBySlug(slug: string): Promise<WritingData | null> {
	const writings = await getWritings();
	return writings.find(w => w.slug === slug) || null;
} 
