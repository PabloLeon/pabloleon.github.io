import { getProjects } from '../../lib/markdown';

export const load = async () => {
	const projects = await getProjects();
	
	return {
		projects
	};
}; 