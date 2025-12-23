import type { ChainState, Lottery, ExperimentSession } from '$lib/types';
import { initializeChains, generateSessionId } from './utils';

/**
 * Experiment state management using Svelte 5 runes
 */
export class ExperimentState {
  // Reactive state
  chains = $state<ChainState[]>([]);
  currentIndex = $state(0);
  sessionId = $state('');
  startTime = $state(0);
  trialCount = $state(0);
  isReady = $state(false);

  /**
   * Initialize with fresh state
   */
  initializeNew(): void {
    this.chains = initializeChains();
    this.currentIndex = 0;
    this.sessionId = generateSessionId();
    this.startTime = Date.now();
    this.trialCount = 0;
    this.isReady = true;
  }

  /**
   * Initialize from existing session data
   */
  initializeFromSession(session: ExperimentSession): void {
    this.chains = session.chains;
    this.currentIndex = session.currentIndex;
    this.sessionId = session.sessionId;
    this.startTime = session.startTime;
    this.trialCount = session.trialCount;
    this.isReady = true;
  }

  /**
   * Get the current chain
   */
  get currentChain(): ChainState | undefined {
    return this.chains[this.currentIndex];
  }

  /**
   * Advance to the next trial
   * Updates the current chain's lottery if user chose proposal
   * Then cycles to the next interleaved chain
   *
   * @param chosenLottery - The lottery the user chose (current or proposal)
   */
  next(chosenLottery: Lottery): void {
    // Update the current chain's state
    if (this.chains[this.currentIndex]) {
      this.chains[this.currentIndex].current = chosenLottery;
    }

    // Increment trial count
    this.trialCount++;

    // Cycle to next chain (0 -> 1 -> 2 -> 0 -> ...)
    this.currentIndex = (this.currentIndex + 1) % 3;
  }

  /**
   * Export current state as session object for persistence
   */
  toSession(agentLogs: unknown[] = [], participantLogs: unknown[] = []): ExperimentSession {
    return {
      sessionId: this.sessionId,
      chains: this.chains,
      currentIndex: this.currentIndex,
      startTime: this.startTime,
      trialCount: this.trialCount,
      agentLogs: agentLogs as ExperimentSession['agentLogs'],
      participantLogs: participantLogs as ExperimentSession['participantLogs'],
    };
  }

  /**
   * Reset state for a new session
   */
  reset(): void {
    this.chains = [];
    this.currentIndex = 0;
    this.sessionId = '';
    this.startTime = 0;
    this.trialCount = 0;
    this.isReady = false;
  }
}

/**
 * Create a singleton experiment state instance
 */
export function createExperimentState(): ExperimentState {
  return new ExperimentState();
}

