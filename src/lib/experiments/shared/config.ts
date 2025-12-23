import type { ExperimentConfig, GSPConfig, MCMCConfig, ColorDomainConfig, ChordDomainConfig } from '$lib/types';

/**
 * Experiment configuration registry
 * Add new experiments here to make them available
 */
const experimentRegistry: Record<string, ExperimentConfig> = {
    'mcmc-utility': {
        slug: 'mcmc-utility',
        title: 'MCMC Utility Estimation',
        description:
            'Explore how preferences are elicited using Markov Chain Monte Carlo methods. Choose between lotteries to help map out your personal utility function over probabilistic outcomes.',
        status: 'active',
        tags: ['Decision Making', 'Bayesian Methods', 'Utility Theory'],
        type: 'mcmc-utility',
        mcmc: {
            targetTrials: 60,
        },
    },
    'gsp-color-lavender': {
        slug: 'gsp-color-lavender',
        title: 'GSP: Mapping "Lavender"',
        description: 'Adjust color properties to match your mental prototype of lavender using Gibbs Sampling with People.',
        status: 'active',
        tags: ['GSP', 'Color Perception', 'Mental Representations'],
        type: 'gsp',
        gsp: {
            domain: 'color',
            dimensions: 3,
            m: 3,
            targetIterations: 20,
            initialVector: [270, 50, 80], // Starting purple-ish
            domainConfig: {
                type: 'color',
                dimensions: 3,
                ranges: [
                    { name: 'Hue', min: 0, max: 360, wrapped: true },
                    { name: 'Saturation', min: 0, max: 100 },
                    { name: 'Lightness', min: 0, max: 100 },
                ],
            },
        },
    },
    'gsp-chord-pleasant': {
        slug: 'gsp-chord-pleasant',
        title: 'GSP: Mapping "Pleasant" Chords',
        description: 'Adjust intervals to create the most pleasant-sounding chord using Gibbs Sampling with People.',
        status: 'active',
        tags: ['GSP', 'Music Perception', 'Consonance'],
        type: 'gsp',
        gsp: {
            domain: 'chord',
            dimensions: 2,
            m: 3,
            targetIterations: 15,
            initialVector: [7, 4], // Perfect 5th + Major 3rd
            domainConfig: {
                type: 'chord',
                dimensions: 2,
                ranges: [
                    { name: 'Interval 1', min: 0.5, max: 11.5 },
                    { name: 'Interval 2', min: 0.5, max: 11.5 },
                ],
                rootFrequency: 220,
            },
        },
    },
};

/**
 * Get experiment configuration by slug
 */
export function getExperimentConfig(slug: string): ExperimentConfig | null {
    return experimentRegistry[slug] || null;
}

/**
 * Get all experiment configurations
 */
export function getAllExperiments(): ExperimentConfig[] {
    return Object.values(experimentRegistry);
}

/**
 * Get all active experiments
 */
export function getActiveExperiments(): ExperimentConfig[] {
    return getAllExperiments().filter((exp) => exp.status === 'active');
}

/**
 * Validate that a config has required fields
 */
export function isValidExperimentConfig(config: unknown): config is ExperimentConfig {
    if (!config || typeof config !== 'object') return false;

    const c = config as Partial<ExperimentConfig>;

    return (
        typeof c.slug === 'string' &&
        typeof c.title === 'string' &&
        typeof c.description === 'string' &&
        typeof c.status === 'string' &&
        ['active', 'coming-soon', 'completed'].includes(c.status) &&
        Array.isArray(c.tags) &&
        typeof c.type === 'string' &&
        ['mcmc-utility', 'gsp'].includes(c.type) &&
        (c.type === 'gsp' ? !!c.gsp : !!c.mcmc)
    );
}

