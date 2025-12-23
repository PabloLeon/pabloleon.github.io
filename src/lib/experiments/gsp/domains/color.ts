import { hsl } from 'd3-color';
import type { ColorDomainConfig } from '$lib/types';

/**
 * Convert HSL values to CSS color string using d3-color
 * @param h - Hue in degrees (0-360, will be wrapped)
 * @param s - Saturation as percentage (0-100)
 * @param l - Lightness as percentage (0-100)
 * @returns CSS HSL color string
 */
export function hslToCSS(h: number, s: number, l: number): string {
    // d3-color hsl() expects:
    // - h: hue in degrees (0-360, can be any number, will be wrapped)
    // - s: saturation as number in [0, 1] (we pass 0-100, so divide by 100)
    // - l: lightness as number in [0, 1] (we pass 0-100, so divide by 100)
    const color = hsl(h, s / 100, l / 100);

    // Clamp values to valid ranges and convert to CSS string
    // d3-color handles hue wrapping automatically
    return color ? color.toString() : 'hsl(0, 0%, 50%)';
}

/**
 * Get CSS variable value for color preview
 * @param vector - Array of [H, S, L] values
 * @returns CSS HSL color string
 */
export function getColorCSSVariable(vector: number[]): string {
    if (vector.length < 3) return 'hsl(0, 0%, 50%)';
    return hslToCSS(vector[0], vector[1], vector[2]);
}

/**
 * Format dimension value for display
 */
export function formatDimensionValue(dimensionIndex: number, value: number): string {
    switch (dimensionIndex) {
        case 0: // Hue
            return `${Math.round(value)}°`;
        case 1: // Saturation
        case 2: // Lightness
            return `${Math.round(value)}%`;
        default:
            return value.toFixed(1);
    }
}

/**
 * Get dimension label
 */
export function getDimensionLabel(dimensionIndex: number): string {
    const labels = ['Hue', 'Saturation', 'Lightness'];
    return labels[dimensionIndex] || `Dimension ${dimensionIndex + 1}`;
}

/**
 * Validate color domain config
 */
export function isValidColorConfig(config: ColorDomainConfig): boolean {
    return (
        config.type === 'color' &&
        config.dimensions === 3 &&
        config.ranges.length === 3 &&
        config.ranges[0].wrapped === true &&
        config.ranges[0].min === 0 &&
        config.ranges[0].max === 360
    );
}

