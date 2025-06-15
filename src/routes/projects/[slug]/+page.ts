import { error } from '@sveltejs/kit';
import { getProjectBySlug, getProjects } from '../../../lib/markdown';

export const load = async ({ params }: { params: { slug: string } }) => {
	const project = await getProjectBySlug(params.slug);
	
	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project
	};
};

export async function entries() {
	const projects = await getProjects();
	return projects.map(project => ({
		slug: project.slug
	}));
} 