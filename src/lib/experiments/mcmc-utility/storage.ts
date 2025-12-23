import type {
    ExperimentSession,
    AgentLog,
    ParticipantLog,
    Lottery,
    Choice,
} from '$lib/types';
import {
    saveSession as saveSessionShared,
    loadSession as loadSessionShared,
    loadCurrentSession as loadCurrentSessionShared,
    saveCurrentSessionId as saveCurrentSessionIdShared,
    loadCurrentSessionId as loadCurrentSessionIdShared,
    clearCurrentSession as clearCurrentSessionShared,
    exportSessionData as exportSessionDataShared,
    downloadSessionData as downloadSessionDataShared,
} from '../shared/storage';

const STORAGE_PREFIX = 'mcmc-utility';

/**
 * Save the current session ID (wrapper for shared storage)
 */
export function saveCurrentSessionId(sessionId: string): void {
    saveCurrentSessionIdShared(STORAGE_PREFIX, sessionId);
}

/**
 * Load the current session ID (wrapper for shared storage)
 */
export function loadCurrentSessionId(): string | null {
    return loadCurrentSessionIdShared(STORAGE_PREFIX);
}

/**
 * Save experiment session to localStorage
 */
export function saveSession(session: ExperimentSession): void {
    saveSessionShared(STORAGE_PREFIX, session);
}

/**
 * Load experiment session from localStorage
 */
export function loadSession(sessionId: string): ExperimentSession | null {
    return loadSessionShared<ExperimentSession>(STORAGE_PREFIX, sessionId);
}

/**
 * Load the most recent session
 */
export function loadCurrentSession(): ExperimentSession | null {
    return loadCurrentSessionShared<ExperimentSession>(STORAGE_PREFIX);
}

/**
 * Validate session structure
 */
export function isValidSession(session: unknown): session is ExperimentSession {
    if (!session || typeof session !== 'object') return false;

    const s = session as Partial<ExperimentSession>;

    return (
        typeof s.sessionId === 'string' &&
        Array.isArray(s.chains) &&
        s.chains.length === 3 &&
        typeof s.currentIndex === 'number' &&
        s.currentIndex >= 0 &&
        s.currentIndex < 3 &&
        typeof s.startTime === 'number' &&
        typeof s.trialCount === 'number' &&
        Array.isArray(s.agentLogs) &&
        Array.isArray(s.participantLogs)
    );
}

/**
 * Log an agent decision
 */
export function logAgentDecision(
    session: ExperimentSession,
    log: AgentLog
): ExperimentSession {
    return {
        ...session,
        agentLogs: [...session.agentLogs, log],
    };
}

/**
 * Log a participant trial
 */
export function logParticipantTrial(
    session: ExperimentSession,
    chainId: number,
    current: Lottery,
    proposal: Lottery,
    choice: Choice,
    responseTimeMs: number
): ExperimentSession {
    const log: ParticipantLog = {
        chainId,
        current,
        proposal,
        choice,
        responseTimeMs,
        timestamp: Date.now(),
    };

    return {
        ...session,
        participantLogs: [...session.participantLogs, log],
    };
}

/**
 * Clear current session data
 */
export function clearCurrentSession(): void {
    clearCurrentSessionShared(STORAGE_PREFIX);
}

/**
 * Export session data as JSON string
 */
export function exportSessionData(session: ExperimentSession): string {
    return exportSessionDataShared(session);
}

/**
 * Download session data as a JSON file
 */
export function downloadSessionData(session: ExperimentSession): void {
    downloadSessionDataShared(STORAGE_PREFIX, session);
}

/**
 * Calculate session statistics
 */
export function getSessionStats(session: ExperimentSession): {
    totalTrials: number;
    totalAgentDecisions: number;
    agentAcceptanceRate: number;
    averageResponseTimeMs: number;
    durationMinutes: number;
} {
    const totalTrials = session.participantLogs.length;
    const totalAgentDecisions = session.agentLogs.length;

    const acceptedDecisions = session.agentLogs.filter((log) => log.accepted).length;
    const agentAcceptanceRate =
        totalAgentDecisions > 0 ? acceptedDecisions / totalAgentDecisions : 0;

    const totalResponseTime = session.participantLogs.reduce(
        (sum, log) => sum + log.responseTimeMs,
        0
    );
    const averageResponseTimeMs =
        totalTrials > 0 ? totalResponseTime / totalTrials : 0;

    const lastTimestamp =
        session.participantLogs.length > 0
            ? session.participantLogs[session.participantLogs.length - 1].timestamp
            : session.startTime;
    const durationMinutes = (lastTimestamp - session.startTime) / 1000 / 60;

    return {
        totalTrials,
        totalAgentDecisions,
        agentAcceptanceRate,
        averageResponseTimeMs,
        durationMinutes,
    };
}

