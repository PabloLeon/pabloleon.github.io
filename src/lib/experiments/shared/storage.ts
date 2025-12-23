/**
 * Generic localStorage session management for experiments
 * Accepts an experiment prefix to namespace storage keys
 */

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
    if (typeof window === 'undefined') return false;

    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get the storage key for a session
 */
function getSessionKey(prefix: string, sessionId: string): string {
    return `${prefix}-session-${sessionId}`;
}

/**
 * Get the storage key for the current session ID
 */
function getCurrentSessionKey(prefix: string): string {
    return `${prefix}-current-session`;
}

/**
 * Save the current session ID
 */
export function saveCurrentSessionId(prefix: string, sessionId: string): void {
    if (!isStorageAvailable()) return;

    try {
        localStorage.setItem(getCurrentSessionKey(prefix), sessionId);
    } catch (error) {
        console.error(`Failed to save current session ID for ${prefix}:`, error);
    }
}

/**
 * Load the current session ID
 */
export function loadCurrentSessionId(prefix: string): string | null {
    if (!isStorageAvailable()) return null;

    try {
        return localStorage.getItem(getCurrentSessionKey(prefix));
    } catch (error) {
        console.error(`Failed to load current session ID for ${prefix}:`, error);
        return null;
    }
}

/**
 * Save experiment session to localStorage
 */
export function saveSession<T extends { sessionId: string }>(
    prefix: string,
    session: T
): void {
    if (!isStorageAvailable()) return;

    try {
        const key = getSessionKey(prefix, session.sessionId);
        localStorage.setItem(key, JSON.stringify(session));
        saveCurrentSessionId(prefix, session.sessionId);
    } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Clearing old sessions...');
            clearOldSessions(prefix);
            try {
                localStorage.setItem(getSessionKey(prefix, session.sessionId), JSON.stringify(session));
            } catch {
                console.error('Still cannot save session after clearing old data');
            }
        } else {
            console.error(`Failed to save session for ${prefix}:`, error);
        }
    }
}

/**
 * Load experiment session from localStorage
 */
export function loadSession<T>(prefix: string, sessionId: string): T | null {
    if (!isStorageAvailable()) return null;

    try {
        const key = getSessionKey(prefix, sessionId);
        const data = localStorage.getItem(key);

        if (!data) return null;

        return JSON.parse(data) as T;
    } catch (error) {
        console.error(`Failed to load session for ${prefix}:`, error);
        return null;
    }
}

/**
 * Load the most recent session
 */
export function loadCurrentSession<T>(prefix: string): T | null {
    const sessionId = loadCurrentSessionId(prefix);
    if (!sessionId) return null;
    return loadSession<T>(prefix, sessionId);
}

/**
 * Clear old sessions to free up space
 * Keeps only the most recent session
 */
function clearOldSessions(prefix: string): void {
    if (!isStorageAvailable()) return;

    const currentSessionId = loadCurrentSessionId(prefix);
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`${prefix}-session-`)) {
            const sessionId = key.replace(`${prefix}-session-`, '');
            if (sessionId !== currentSessionId) {
                keysToRemove.push(key);
            }
        }
    }

    for (const key of keysToRemove) {
        localStorage.removeItem(key);
    }
}

/**
 * Clear current session data
 */
export function clearCurrentSession(prefix: string): void {
    if (!isStorageAvailable()) return;

    const currentSessionId = loadCurrentSessionId(prefix);
    if (currentSessionId) {
        localStorage.removeItem(getSessionKey(prefix, currentSessionId));
    }
    localStorage.removeItem(getCurrentSessionKey(prefix));
}

/**
 * Export session data as JSON string
 */
export function exportSessionData<T>(session: T): string {
    return JSON.stringify(session, null, 2);
}

/**
 * Download session data as a JSON file
 */
export function downloadSessionData<T extends { sessionId: string }>(
    prefix: string,
    session: T
): void {
    const data = exportSessionData(session);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${prefix}-${session.sessionId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

