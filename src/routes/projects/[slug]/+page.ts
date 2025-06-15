import { error } from '@sveltejs/kit';
import { getProjectBySlug } from '../../../lib/markdown';

export const load = async ({ params }: { params: { slug: string } }) => {
	const project = await getProjectBySlug(params.slug);
	
	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project
	};
}; 