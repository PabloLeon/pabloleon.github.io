declare module 'd3-color' {
    export interface HSL {
        h: number;
        s: number;
        l: number;
        opacity?: number;
        toString(): string;
    }

    export function hsl(h: number, s: number, l: number, opacity?: number): HSL | null;
    export function hsl(color: string): HSL | null;
}

