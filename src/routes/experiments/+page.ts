import { getAllExperiments } from '$lib/experiments/shared/config';

export const load = async () => {
    const experiments = getAllExperiments();

    return {
        experiments,
    };
};

