/**
 * Base session types and utilities for experiments
 */

/**
 * Generate a unique session ID
 */
export function generateSessionId(prefix: string = 'session'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validate that a value is a valid timestamp
 */
export function isValidTimestamp(value: unknown): value is number {
    return typeof value === 'number' && value > 0 && !isNaN(value);
}

/**
 * Validate that a value is a non-empty string
 */
export function isValidString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

