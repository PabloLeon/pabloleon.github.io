/**
 * GSP experiment utilities
 */

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Wrap a value for circular dimensions (e.g., Hue 0-360)
 */
export function wrap(value: number, min: number, max: number): number {
    const range = max - min;
    let wrapped = ((value - min) % range) + min;
    if (wrapped < min) wrapped += range;
    return wrapped;
}

/**
 * Calculate mean of an array of numbers
 */
export function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Format a number to a specified number of decimal places
 */
export function formatDecimal(value: number, decimals: number = 1): string {
    return value.toFixed(decimals);
}

