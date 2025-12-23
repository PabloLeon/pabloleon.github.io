import type { Lottery } from '$lib/types';

/**
 * Generate a random lottery uniformly from the probability triangle.
 * Uses barycentric coordinates to sample uniformly from the simplex.
 */
export function generateUniformProposal(): Lottery {
    // Sample two uniform random numbers
    const u1 = Math.random();
    const u2 = Math.random();

    // Transform to simplex using sorted method
    // This ensures uniform distribution over the 2-simplex
    const sorted = [0, u1, u2, 1].sort((a, b) => a - b);

    const p20 = sorted[1] - sorted[0];
    const p10 = sorted[2] - sorted[1];
    const p0 = sorted[3] - sorted[2];

    return normalizeProbabilities({ p20, p10, p0 });
}

/**
 * Normalize probabilities to ensure they sum to exactly 1.0
 * Handles floating point precision issues and clamps negative values
 */
export function normalizeProbabilities(lottery: Lottery): Lottery {
    // First clamp to non-negative
    const p20 = Math.max(0, lottery.p20);
    const p10 = Math.max(0, lottery.p10);
    const p0 = Math.max(0, lottery.p0);

    const sum = p20 + p10 + p0;

    if (sum === 0) {
        // Edge case: if all are 0, return equal probabilities
        return { p20: 1 / 3, p10: 1 / 3, p0: 1 / 3 };
    }

    return {
        p20: p20 / sum,
        p10: p10 / sum,
        p0: p0 / sum,
    };
}

/**
 * Calculate the expected value of a lottery
 * E(z) = 20 * p20 + 10 * p10 + 0 * p0
 */
export function getExpectedValue(lottery: Lottery): number {
    return 20 * lottery.p20 + 10 * lottery.p10 + 0 * lottery.p0;
}

/**
 * Format a probability as a percentage string
 */
export function formatProbability(p: number): string {
    return `${Math.round(p * 100)}%`;
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
    return `£${value}`;
}

/**
 * Validate that a lottery has valid probabilities
 */
export function isValidLottery(lottery: Lottery): boolean {
    const sum = lottery.p20 + lottery.p10 + lottery.p0;
    const epsilon = 1e-10;

    return (
        lottery.p20 >= 0 &&
        lottery.p10 >= 0 &&
        lottery.p0 >= 0 &&
        Math.abs(sum - 1.0) < epsilon
    );
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
    return `mcmc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Initialize the three chains with starting lotteries
 * Each chain starts at a different point in the probability space
 */
export function initializeChains(): { id: number; current: Lottery }[] {
    return [
        { id: 0, current: { p20: 0.33, p10: 0.34, p0: 0.33 } }, // Center
        { id: 1, current: { p20: 0.6, p10: 0.2, p0: 0.2 } },    // High value region
        { id: 2, current: { p20: 0.1, p10: 0.3, p0: 0.6 } },    // Low value region
    ];
}

