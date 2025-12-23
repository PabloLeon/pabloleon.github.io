import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAgentUtility,
  shouldAccept,
  findAcceptedProposal,
  calculateAgentStats,
} from './mcmc';
import type { Lottery, AgentLog } from '$lib/types';

describe('getAgentUtility', () => {
  it('calculates utility correctly for a lottery with expected value 10', () => {
    const lottery: Lottery = { p20: 0, p10: 1, p0: 0 };
    // E(z) = 10, g(z) = (1/10)^8 = 1e-8
    expect(getAgentUtility(lottery)).toBeCloseTo(1e-8);
  });

  it('calculates utility correctly for a lottery with expected value 20', () => {
    const lottery: Lottery = { p20: 1, p10: 0, p0: 0 };
    // E(z) = 20, g(z) = (1/20)^8 = 3.90625e-11
    expect(getAgentUtility(lottery)).toBeCloseTo(3.90625e-11, 15);
  });

  it('returns Infinity for zero expected value lottery', () => {
    const lottery: Lottery = { p20: 0, p10: 0, p0: 1 };
    expect(getAgentUtility(lottery)).toBe(Infinity);
  });

  it('prefers low expected value lotteries (higher utility)', () => {
    const lowEV: Lottery = { p20: 0.1, p10: 0.2, p0: 0.7 }; // EV = 4
    const highEV: Lottery = { p20: 0.8, p10: 0.1, p0: 0.1 }; // EV = 17
    
    expect(getAgentUtility(lowEV)).toBeGreaterThan(getAgentUtility(highEV));
  });
});

describe('shouldAccept', () => {
  let mockRandom: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockRandom = vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    mockRandom.mockRestore();
  });

  it('accepts when random < acceptance probability', () => {
    // uProposal = 3, uCurrent = 1
    // P(accept) = 3 / (1 + 3) = 0.75
    mockRandom.mockReturnValue(0.5); // 0.5 < 0.75
    expect(shouldAccept(1, 3)).toBe(true);
  });

  it('rejects when random >= acceptance probability', () => {
    // uProposal = 1, uCurrent = 3
    // P(accept) = 1 / (3 + 1) = 0.25
    mockRandom.mockReturnValue(0.5); // 0.5 >= 0.25
    expect(shouldAccept(3, 1)).toBe(false);
  });

  it('always accepts when proposal has infinite utility', () => {
    mockRandom.mockReturnValue(0.99);
    expect(shouldAccept(1000, Infinity)).toBe(true);
  });

  it('never accepts when current has infinite utility', () => {
    mockRandom.mockReturnValue(0.01);
    expect(shouldAccept(Infinity, 1000)).toBe(false);
  });

  it('returns 50% when both have infinite utility', () => {
    mockRandom.mockReturnValue(0.3);
    expect(shouldAccept(Infinity, Infinity)).toBe(true);

    mockRandom.mockReturnValue(0.7);
    expect(shouldAccept(Infinity, Infinity)).toBe(false);
  });

  it('rejects bad proposals when random is high', () => {
    // Simulate a significantly worse proposal
    // If Math.random returns 0.9, shouldAccept should return false
    // when the proposal is much worse than current
    mockRandom.mockReturnValue(0.9);
    
    // uCurrent = 1000 (very good), uProposal = 1 (bad)
    // P(accept) = 1 / (1000 + 1) ≈ 0.001
    expect(shouldAccept(1000, 1)).toBe(false);
  });
});

describe('findAcceptedProposal', () => {
  it('returns a proposal after agent accepts', async () => {
    const current: Lottery = { p20: 0.33, p10: 0.33, p0: 0.34 };
    
    const result = await findAcceptedProposal(0, current, { maxAttempts: 1000 });
    
    expect(result.proposal).toBeDefined();
    expect(result.proposal.p20).toBeGreaterThanOrEqual(0);
    expect(result.proposal.p10).toBeGreaterThanOrEqual(0);
    expect(result.proposal.p0).toBeGreaterThanOrEqual(0);
    expect(result.attempts).toBeGreaterThanOrEqual(1);
  });

  it('calls onAgentDecision callback for accepted proposals', async () => {
    const current: Lottery = { p20: 0.33, p10: 0.33, p0: 0.34 };
    const decisions: AgentLog[] = [];
    
    await findAcceptedProposal(0, current, {
      maxAttempts: 100,
      onAgentDecision: (log) => decisions.push(log),
    });
    
    // Should have at least one accepted proposal logged
    expect(decisions.length).toBeGreaterThanOrEqual(1);
    // All logged decisions should be accepted (optimization: only log accepted)
    decisions.forEach(log => {
      expect(log.accepted).toBe(true);
    });
  });

  it('respects maxAttempts limit', async () => {
    // Use a very high expected value lottery that should be hard to beat
    const current: Lottery = { p20: 0, p10: 0, p0: 1 }; // EV = 0, infinite utility
    
    const result = await findAcceptedProposal(0, current, { maxAttempts: 5 });
    
    // Should either find an accepted proposal or hit max attempts
    expect(result.attempts).toBeLessThanOrEqual(5);
  });
});

describe('calculateAgentStats', () => {
  it('returns zeros for empty logs', () => {
    const stats = calculateAgentStats([]);
    
    expect(stats.totalDecisions).toBe(0);
    expect(stats.acceptanceRate).toBe(0);
    expect(stats.meanAttemptsPerAccept).toBe(0);
  });

  it('calculates acceptance rate correctly', () => {
    const logs: AgentLog[] = [
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: false, timestamp: 1 },
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: true, timestamp: 2 },
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: false, timestamp: 3 },
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: true, timestamp: 4 },
    ];
    
    const stats = calculateAgentStats(logs);
    
    expect(stats.totalDecisions).toBe(4);
    expect(stats.acceptanceRate).toBe(0.5);
  });

  it('calculates mean attempts per accept correctly', () => {
    const logs: AgentLog[] = [
      // First accept after 2 attempts
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: false, timestamp: 1 },
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: true, timestamp: 2 },
      // Second accept after 4 attempts
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: false, timestamp: 3 },
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: false, timestamp: 4 },
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: false, timestamp: 5 },
      { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: true, timestamp: 6 },
    ];
    
    const stats = calculateAgentStats(logs);
    
    // (2 + 4) / 2 = 3
    expect(stats.meanAttemptsPerAccept).toBe(3);
  });
});

