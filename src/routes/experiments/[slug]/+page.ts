import { error } from '@sveltejs/kit';
import { getExperimentConfig } from '$lib/experiments/shared/config';

export const load = async ({ params }: { params: { slug: string } }) => {
    const config = getExperimentConfig(params.slug);

    if (!config) {
        throw error(404, 'Experiment not found');
    }

    return {
        experiment: config,
    };
};

