import type { GSPSession, GSPSampleLog } from '$lib/types';
import {
    saveSession as saveSessionShared,
    loadSession as loadSessionShared,
    loadCurrentSession as loadCurrentSessionShared,
    clearCurrentSession as clearCurrentSessionShared,
    exportSessionData as exportSessionDataShared,
    downloadSessionData as downloadSessionDataShared,
} from '../shared/storage';
import { generateSessionId } from '../shared/session';

/**
 * Get storage prefix for a GSP experiment slug
 */
function getStoragePrefix(experimentSlug: string): string {
    return `gsp-${experimentSlug}`;
}

/**
 * Save GSP session
 */
export function saveGSPSession(experimentSlug: string, session: GSPSession): void {
    const prefix = getStoragePrefix(experimentSlug);
    saveSessionShared(prefix, session);
}

/**
 * Load GSP session
 */
export function loadGSPSession(experimentSlug: string, sessionId: string): GSPSession | null {
    const prefix = getStoragePrefix(experimentSlug);
    return loadSessionShared<GSPSession>(prefix, sessionId);
}

/**
 * Load current GSP session
 */
export function loadCurrentGSPSession(experimentSlug: string): GSPSession | null {
    const prefix = getStoragePrefix(experimentSlug);
    return loadCurrentSessionShared<GSPSession>(prefix);
}

/**
 * Clear current GSP session
 */
export function clearCurrentGSPSession(experimentSlug: string): void {
    const prefix = getStoragePrefix(experimentSlug);
    clearCurrentSessionShared(prefix);
}

/**
 * Export GSP session data
 */
export function exportGSPSessionData(session: GSPSession): string {
    return exportSessionDataShared(session);
}

/**
 * Download GSP session data
 */
export function downloadGSPSessionData(experimentSlug: string, session: GSPSession): void {
    const prefix = getStoragePrefix(experimentSlug);
    downloadSessionDataShared(prefix, session);
}

/**
 * Log a sample
 */
export function logSample(
    session: GSPSession,
    dimensionIndex: number,
    sampleValue: number,
    vector: number[]
): GSPSession {
    const log: GSPSampleLog = {
        dimensionIndex,
        iteration: session.iteration,
        sampleValue,
        timestamp: Date.now(),
        vector: [...vector], // Store a copy of the vector state
    };

    return {
        ...session,
        sampleLogs: [...session.sampleLogs, log],
    };
}

/**
 * Create a new GSP session
 */
export function createGSPSession(
    experimentSlug: string,
    initialVector: number[],
    dimensions: number
): GSPSession {
    return {
        sessionId: generateSessionId(`gsp-${experimentSlug}`),
        experimentSlug,
        vector: [...initialVector],
        dimensionIndex: 0,
        iteration: 0,
        sampleCount: 0,
        startTime: Date.now(),
        sampleLogs: [],
        completedIterations: 0,
    };
}

/**
 * Calculate session statistics
 */
export function getGSPSessionStats(session: GSPSession): {
    totalSamples: number;
    completedIterations: number;
    averageSamplesPerIteration: number;
    durationMinutes: number;
} {
    const totalSamples = session.sampleLogs.length;
    const completedIterations = session.completedIterations;
    const averageSamplesPerIteration =
        completedIterations > 0 ? totalSamples / completedIterations : 0;

    const lastTimestamp =
        session.sampleLogs.length > 0
            ? session.sampleLogs[session.sampleLogs.length - 1].timestamp
            : session.startTime;
    const durationMinutes = (lastTimestamp - session.startTime) / 1000 / 60;

    return {
        totalSamples,
        completedIterations,
        averageSamplesPerIteration,
        durationMinutes,
    };
}

