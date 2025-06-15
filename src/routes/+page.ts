import { getProjects, getWritings } from '../lib/markdown';
import { publications } from '../lib/utils/publications';

export const load = async () => {
	const [projects, writings] = await Promise.all([
		getProjects(),
		getWritings(),
	]);

	return {
		projects,
		writings,
		publications
	};
}; 