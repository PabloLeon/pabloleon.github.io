import { error } from '@sveltejs/kit';
import { getWritingBySlug } from '../../../lib/markdown';

export const load = async ({ params }: { params: { slug: string } }) => {
	const writing = await getWritingBySlug(params.slug);
	
	if (!writing) {
		throw error(404, 'Article not found');
	}

	return {
		writing
	};
}; 