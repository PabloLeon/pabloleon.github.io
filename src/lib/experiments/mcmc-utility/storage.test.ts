import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveSession,
  loadSession,
  loadCurrentSession,
  saveCurrentSessionId,
  loadCurrentSessionId,
  clearCurrentSession,
  logAgentDecision,
  logParticipantTrial,
  exportSessionData,
  getSessionStats,
} from './storage';
import type { ExperimentSession, AgentLog, Lottery } from '$lib/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('storage', () => {
  const mockSession: ExperimentSession = {
    sessionId: 'test-session-123',
    chains: [
      { id: 0, current: { p20: 0.33, p10: 0.34, p0: 0.33 } },
      { id: 1, current: { p20: 0.6, p10: 0.2, p0: 0.2 } },
      { id: 2, current: { p20: 0.1, p10: 0.3, p0: 0.6 } },
    ],
    currentIndex: 0,
    startTime: Date.now(),
    trialCount: 5,
    agentLogs: [],
    participantLogs: [],
  };

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('saveSession / loadSession', () => {
    it('saves and loads session correctly', () => {
      saveSession(mockSession);
      const loaded = loadSession(mockSession.sessionId);

      expect(loaded).toEqual(mockSession);
    });

    it('returns null for non-existent session', () => {
      const loaded = loadSession('non-existent-id');
      expect(loaded).toBeNull();
    });

    it('saves current session ID when saving session', () => {
      saveSession(mockSession);
      expect(loadCurrentSessionId()).toBe(mockSession.sessionId);
    });
  });

  describe('saveCurrentSessionId / loadCurrentSessionId', () => {
    it('saves and loads current session ID', () => {
      saveCurrentSessionId('my-session-id');
      expect(loadCurrentSessionId()).toBe('my-session-id');
    });
  });

  describe('loadCurrentSession', () => {
    it('loads the current session when exists', () => {
      saveSession(mockSession);
      const loaded = loadCurrentSession();

      expect(loaded).toEqual(mockSession);
    });

    it('returns null when no current session', () => {
      expect(loadCurrentSession()).toBeNull();
    });
  });

  describe('clearCurrentSession', () => {
    it('clears current session data', () => {
      saveSession(mockSession);
      expect(loadCurrentSession()).not.toBeNull();

      clearCurrentSession();
      expect(loadCurrentSession()).toBeNull();
    });
  });

  describe('logAgentDecision', () => {
    it('adds agent log to session', () => {
      const log: AgentLog = {
        chainId: 0,
        current: { p20: 0.3, p10: 0.3, p0: 0.4 },
        proposal: { p20: 0.4, p10: 0.3, p0: 0.3 },
        uCurrent: 1.5,
        uProposal: 2.0,
        accepted: true,
        timestamp: Date.now(),
      };

      const updated = logAgentDecision(mockSession, log);

      expect(updated.agentLogs).toHaveLength(1);
      expect(updated.agentLogs[0]).toEqual(log);
      // Original should be unchanged
      expect(mockSession.agentLogs).toHaveLength(0);
    });
  });

  describe('logParticipantTrial', () => {
    it('adds participant log to session', () => {
      const current: Lottery = { p20: 0.3, p10: 0.3, p0: 0.4 };
      const proposal: Lottery = { p20: 0.4, p10: 0.3, p0: 0.3 };

      const updated = logParticipantTrial(
        mockSession,
        0,
        current,
        proposal,
        'proposal',
        1500
      );

      expect(updated.participantLogs).toHaveLength(1);
      expect(updated.participantLogs[0].choice).toBe('proposal');
      expect(updated.participantLogs[0].responseTimeMs).toBe(1500);
    });
  });

  describe('exportSessionData', () => {
    it('exports session as JSON string', () => {
      const exported = exportSessionData(mockSession);
      const parsed = JSON.parse(exported);

      expect(parsed.sessionId).toBe(mockSession.sessionId);
      expect(parsed.trialCount).toBe(mockSession.trialCount);
    });
  });

  describe('getSessionStats', () => {
    it('calculates stats correctly', () => {
      const session: ExperimentSession = {
        ...mockSession,
        startTime: Date.now() - 60000, // 1 minute ago
        agentLogs: [
          { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: false, timestamp: 1 },
          { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, uCurrent: 1, uProposal: 2, accepted: true, timestamp: 2 },
        ],
        participantLogs: [
          { chainId: 0, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, choice: 'current', responseTimeMs: 1000, timestamp: Date.now() },
          { chainId: 1, current: { p20: 0.3, p10: 0.3, p0: 0.4 }, proposal: { p20: 0.3, p10: 0.3, p0: 0.4 }, choice: 'proposal', responseTimeMs: 2000, timestamp: Date.now() },
        ],
      };

      const stats = getSessionStats(session);

      expect(stats.totalTrials).toBe(2);
      expect(stats.totalAgentDecisions).toBe(2);
      expect(stats.agentAcceptanceRate).toBe(0.5);
      expect(stats.averageResponseTimeMs).toBe(1500);
    });

    it('handles empty session', () => {
      const stats = getSessionStats(mockSession);

      expect(stats.totalTrials).toBe(0);
      expect(stats.averageResponseTimeMs).toBe(0);
    });
  });
});

describe('session validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('rejects invalid session with wrong chain count', () => {
    const invalidSession = {
      sessionId: 'test',
      chains: [{ id: 0, current: { p20: 0.33, p10: 0.33, p0: 0.34 } }], // Only 1 chain
      currentIndex: 0,
      startTime: Date.now(),
      trialCount: 0,
      agentLogs: [],
      participantLogs: [],
    };

    localStorageMock.setItem(
      'mcmc-utility-session-test',
      JSON.stringify(invalidSession)
    );

    const loaded = loadSession('test');
    expect(loaded).toBeNull();
  });

  it('rejects invalid session with bad currentIndex', () => {
    const invalidSession = {
      sessionId: 'test',
      chains: [
        { id: 0, current: { p20: 0.33, p10: 0.34, p0: 0.33 } },
        { id: 1, current: { p20: 0.6, p10: 0.2, p0: 0.2 } },
        { id: 2, current: { p20: 0.1, p10: 0.3, p0: 0.6 } },
      ],
      currentIndex: 5, // Invalid index
      startTime: Date.now(),
      trialCount: 0,
      agentLogs: [],
      participantLogs: [],
    };

    localStorageMock.setItem(
      'mcmc-utility-session-test',
      JSON.stringify(invalidSession)
    );

    const loaded = loadSession('test');
    expect(loaded).toBeNull();
  });
});

