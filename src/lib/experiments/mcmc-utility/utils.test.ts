import { describe, it, expect } from 'vitest';
import {
  generateUniformProposal,
  normalizeProbabilities,
  getExpectedValue,
  isValidLottery,
  formatProbability,
  formatCurrency,
  generateSessionId,
  initializeChains,
} from './utils';
import type { Lottery } from '$lib/types';

describe('generateUniformProposal', () => {
  it('generates valid probabilities that sum to 1.0', () => {
    for (let i = 0; i < 1000; i++) {
      const lottery = generateUniformProposal();
      const sum = lottery.p20 + lottery.p10 + lottery.p0;
      
      expect(sum).toBeCloseTo(1.0, 10);
      expect(lottery.p20).toBeGreaterThanOrEqual(0);
      expect(lottery.p10).toBeGreaterThanOrEqual(0);
      expect(lottery.p0).toBeGreaterThanOrEqual(0);
      expect(lottery.p20).toBeLessThanOrEqual(1);
      expect(lottery.p10).toBeLessThanOrEqual(1);
      expect(lottery.p0).toBeLessThanOrEqual(1);
    }
  });

  it('generates uniform distribution over 10000 samples', () => {
    // Test that probabilities are distributed across the simplex
    const samples = 10000;
    let sumP20 = 0;
    let sumP10 = 0;
    let sumP0 = 0;
    
    for (let i = 0; i < samples; i++) {
      const lottery = generateUniformProposal();
      sumP20 += lottery.p20;
      sumP10 += lottery.p10;
      sumP0 += lottery.p0;
    }
    
    // For uniform distribution on simplex, mean of each component should be ~1/3
    const meanP20 = sumP20 / samples;
    const meanP10 = sumP10 / samples;
    const meanP0 = sumP0 / samples;
    
    expect(meanP20).toBeCloseTo(1 / 3, 1);
    expect(meanP10).toBeCloseTo(1 / 3, 1);
    expect(meanP0).toBeCloseTo(1 / 3, 1);
  });
});

describe('normalizeProbabilities', () => {
  it('normalizes probabilities to sum to 1.0', () => {
    const lottery: Lottery = { p20: 0.2, p10: 0.3, p0: 0.4 };
    const normalized = normalizeProbabilities(lottery);
    
    expect(normalized.p20 + normalized.p10 + normalized.p0).toBeCloseTo(1.0);
  });

  it('handles already normalized probabilities', () => {
    const lottery: Lottery = { p20: 0.5, p10: 0.3, p0: 0.2 };
    const normalized = normalizeProbabilities(lottery);
    
    expect(normalized.p20).toBeCloseTo(0.5);
    expect(normalized.p10).toBeCloseTo(0.3);
    expect(normalized.p0).toBeCloseTo(0.2);
  });

  it('handles all zeros by returning equal probabilities', () => {
    const lottery: Lottery = { p20: 0, p10: 0, p0: 0 };
    const normalized = normalizeProbabilities(lottery);
    
    expect(normalized.p20).toBeCloseTo(1 / 3);
    expect(normalized.p10).toBeCloseTo(1 / 3);
    expect(normalized.p0).toBeCloseTo(1 / 3);
  });

  it('handles negative values by clamping to zero', () => {
    const lottery: Lottery = { p20: -0.1, p10: 0.6, p0: 0.5 };
    const normalized = normalizeProbabilities(lottery);
    
    expect(normalized.p20).toBeGreaterThanOrEqual(0);
    expect(normalized.p20 + normalized.p10 + normalized.p0).toBeCloseTo(1.0);
  });
});

describe('getExpectedValue', () => {
  it('calculates expected value correctly', () => {
    const lottery: Lottery = { p20: 0.5, p10: 0.3, p0: 0.2 };
    // E = 20*0.5 + 10*0.3 + 0*0.2 = 10 + 3 = 13
    expect(getExpectedValue(lottery)).toBe(13);
  });

  it('returns 20 for certain £20 win', () => {
    const lottery: Lottery = { p20: 1, p10: 0, p0: 0 };
    expect(getExpectedValue(lottery)).toBe(20);
  });

  it('returns 10 for certain £10 win', () => {
    const lottery: Lottery = { p20: 0, p10: 1, p0: 0 };
    expect(getExpectedValue(lottery)).toBe(10);
  });

  it('returns 0 for certain £0', () => {
    const lottery: Lottery = { p20: 0, p10: 0, p0: 1 };
    expect(getExpectedValue(lottery)).toBe(0);
  });
});

describe('isValidLottery', () => {
  it('returns true for valid lottery', () => {
    const lottery: Lottery = { p20: 0.4, p10: 0.35, p0: 0.25 };
    expect(isValidLottery(lottery)).toBe(true);
  });

  it('returns false when probabilities do not sum to 1', () => {
    const lottery: Lottery = { p20: 0.3, p10: 0.3, p0: 0.3 };
    expect(isValidLottery(lottery)).toBe(false);
  });

  it('returns false for negative probabilities', () => {
    const lottery: Lottery = { p20: -0.1, p10: 0.6, p0: 0.5 };
    expect(isValidLottery(lottery)).toBe(false);
  });

  it('returns true for edge cases (one probability is 1)', () => {
    expect(isValidLottery({ p20: 1, p10: 0, p0: 0 })).toBe(true);
    expect(isValidLottery({ p20: 0, p10: 1, p0: 0 })).toBe(true);
    expect(isValidLottery({ p20: 0, p10: 0, p0: 1 })).toBe(true);
  });
});

describe('formatProbability', () => {
  it('formats probability as percentage', () => {
    expect(formatProbability(0.5)).toBe('50%');
    expect(formatProbability(0.333)).toBe('33%');
    expect(formatProbability(1)).toBe('100%');
    expect(formatProbability(0)).toBe('0%');
  });
});

describe('formatCurrency', () => {
  it('formats currency with pound sign', () => {
    expect(formatCurrency(20)).toBe('£20');
    expect(formatCurrency(10)).toBe('£10');
    expect(formatCurrency(0)).toBe('£0');
  });
});

describe('generateSessionId', () => {
  it('generates unique session IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateSessionId());
    }
    expect(ids.size).toBe(100);
  });

  it('generates IDs with correct prefix', () => {
    const id = generateSessionId();
    expect(id.startsWith('mcmc-')).toBe(true);
  });
});

describe('initializeChains', () => {
  it('creates 3 chains', () => {
    const chains = initializeChains();
    expect(chains.length).toBe(3);
  });

  it('each chain has valid initial lottery', () => {
    const chains = initializeChains();
    
    for (const chain of chains) {
      expect(chain.id).toBeDefined();
      expect(isValidLottery(chain.current)).toBe(true);
    }
  });

  it('chains have unique IDs', () => {
    const chains = initializeChains();
    const ids = chains.map((c) => c.id);
    expect(new Set(ids).size).toBe(3);
  });
});

