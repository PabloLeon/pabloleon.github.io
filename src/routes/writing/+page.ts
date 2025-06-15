import { getWritings } from '../../lib/markdown';

export const load = async () => {
	const writings = await getWritings();
	
	return {
		writings
	};
}; 