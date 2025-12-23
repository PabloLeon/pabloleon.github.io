import type { Lottery, AgentLog } from '$lib/types';
import { generateUniformProposal, getExpectedValue } from './utils';

/**
 * Calculate agent utility for a lottery
 * g(z) = (1 / E(z))^8
 * This biases the agent toward low expected value lotteries
 */
export function getAgentUtility(lottery: Lottery): number {
  const expectedValue = getExpectedValue(lottery);

  // Prevent division by zero - if EV is 0, return very high utility
  if (expectedValue <= 0) {
    return Infinity;
  }

  return Math.pow(1 / expectedValue, 8);
}

/**
 * Determine if the agent accepts a proposal using Boltzmann choice rule
 * P(accept z') = g(z') / (g(z) + g(z'))
 *
 * @param uCurrent - Utility of current state
 * @param uProposal - Utility of proposed state
 * @returns true if proposal is accepted
 */
export function shouldAccept(uCurrent: number, uProposal: number): boolean {
  // Handle edge cases with infinite utilities
  if (!isFinite(uProposal) && !isFinite(uCurrent)) {
    // Both infinite - accept with 50% probability
    return Math.random() < 0.5;
  }
  if (!isFinite(uProposal)) {
    // Proposal has infinite utility - always accept
    return true;
  }
  if (!isFinite(uCurrent)) {
    // Current has infinite utility - never accept
    return false;
  }

  // Normal case: Boltzmann choice rule
  const acceptanceProbability = uProposal / (uCurrent + uProposal);
  return Math.random() < acceptanceProbability;
}

/**
 * Configuration for the agent filter
 */
export interface AgentFilterConfig {
  maxAttempts?: number;
  onAgentDecision?: (log: AgentLog) => void;
}

/**
 * Find an accepted proposal using the agent filter
 * Runs a loop generating proposals until one is accepted by the agent
 *
 * @param chainId - ID of the current chain
 * @param current - Current lottery state
 * @param config - Optional configuration
 * @returns The accepted proposal lottery
 */
export async function findAcceptedProposal(
  chainId: number,
  current: Lottery,
  config: AgentFilterConfig = {}
): Promise<{ proposal: Lottery; attempts: number }> {
  const { maxAttempts = 1000, onAgentDecision } = config;

  // Optimization 1: Compute uCurrent once - it never changes
  const uCurrent = getAgentUtility(current);

  let attempts = 0;
  let accepted = false;
  let proposal: Lottery = generateUniformProposal();

  while (!accepted && attempts < maxAttempts) {
    attempts++;
    proposal = generateUniformProposal();

    const uProposal = getAgentUtility(proposal);
    accepted = shouldAccept(uCurrent, uProposal);

    // Optimization 2: Only log accepted proposals to reduce callback overhead
    if (onAgentDecision && accepted) {
      const log: AgentLog = {
        chainId,
        current,
        proposal,
        uCurrent,
        uProposal,
        accepted,
        timestamp: Date.now(),
      };
      onAgentDecision(log);
    }

    // Optimization 3: Yield to event loop less frequently to reduce async overhead
    if (attempts % 100 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  if (!accepted) {
    // Fallback: return current state if we couldn't find an accepted proposal
    console.warn(
      `Agent filter reached max attempts (${maxAttempts}) without finding accepted proposal`
    );
    return { proposal: current, attempts };
  }

  return { proposal, attempts };
}

/**
 * Calculate summary statistics for agent filter performance
 */
export function calculateAgentStats(logs: AgentLog[]): {
  totalDecisions: number;
  acceptanceRate: number;
  meanAttemptsPerAccept: number;
} {
  if (logs.length === 0) {
    return {
      totalDecisions: 0,
      acceptanceRate: 0,
      meanAttemptsPerAccept: 0,
    };
  }

  const accepted = logs.filter((log) => log.accepted).length;
  const acceptanceRate = accepted / logs.length;

  // Calculate mean attempts per accepted proposal
  let currentStreak = 0;
  const acceptStreaks: number[] = [];

  for (const log of logs) {
    currentStreak++;
    if (log.accepted) {
      acceptStreaks.push(currentStreak);
      currentStreak = 0;
    }
  }

  const meanAttemptsPerAccept =
    acceptStreaks.length > 0
      ? acceptStreaks.reduce((a, b) => a + b, 0) / acceptStreaks.length
      : 0;

  return {
    totalDecisions: logs.length,
    acceptanceRate,
    meanAttemptsPerAccept,
  };
}

