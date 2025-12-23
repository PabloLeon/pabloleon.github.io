import type { ChordDomainConfig } from '$lib/types';

/**
 * Audio synthesis utilities for musical chord domain
 */

// Use any type for dynamic import to avoid SSR issues
type ToneModule = any;
let Tone: ToneModule | null = null;
let synth: any = null;
let reverb: any = null;
let isInitialized = false;

/**
 * Dynamically import Tone.js (browser-only)
 */
async function loadTone(): Promise<ToneModule> {
    if (Tone) return Tone;
    if (typeof window === 'undefined') {
        throw new Error('Tone.js can only be loaded in the browser');
    }
    // Dynamic import - only loads in browser
    // @ts-expect-error - tone is a browser-only library, not available during SSR
    Tone = await import('tone');
    return Tone;
}

/**
 * Initialize Tone.js audio context and create synth/reverb
 * Must be called after user interaction (browser requirement)
 */
export async function initializeAudio(): Promise<void> {
    if (isInitialized) return;

    try {
        // Load Tone.js dynamically (browser-only)
        const ToneModule = await loadTone();

        await ToneModule.start();

        // Create reverb effect
        reverb = new ToneModule.Reverb({
            wet: 0.1,
            decay: 2,
        });
        await reverb.generate();

        // Create polyphonic synth with harmonic complex tones
        synth = new ToneModule.PolySynth(ToneModule.Synth, {
            oscillator: {
                type: 'custom',
                partials: generateHarmonicPartials(10), // 10 partials with 1/f decay
            },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.3,
                release: 0.3,
            },
        }).connect(reverb);

        // Connect to destination
        reverb.toDestination();

        isInitialized = true;
    } catch (error) {
        console.error('Failed to initialize audio:', error);
        throw error;
    }
}

/**
 * Generate harmonic partials with 1/f amplitude decay
 */
function generateHarmonicPartials(count: number): number[] {
    const partials: number[] = [];
    for (let i = 1; i <= count; i++) {
        // 1/f decay: amplitude = 1 / frequency
        partials.push(1 / i);
    }
    return partials;
}

/**
 * Calculate frequency from semitone interval
 * f_tone = f_root * 2^(z_k/12)
 */
export function semitoneToFrequency(rootFrequency: number, semitones: number): number {
    return rootFrequency * Math.pow(2, semitones / 12);
}

/**
 * Play chord from interval vector
 */
export async function playChord(
    config: ChordDomainConfig,
    vector: number[],
    duration: number = 0.5
): Promise<void> {
    if (!isInitialized) {
        await initializeAudio();
    }

    if (!synth) {
        console.error('Synth not initialized');
        return;
    }

    try {
        // Calculate frequencies for root and intervals
        const frequencies = [
            config.rootFrequency, // Root
            semitoneToFrequency(config.rootFrequency, vector[0]), // Interval 1
            semitoneToFrequency(config.rootFrequency, vector[1]), // Interval 2
        ];

        // Convert frequencies to note names (approximate)
        const ToneModule = await loadTone();
        const notes = frequencies.map((freq) => {
            // Convert frequency to MIDI note number, then to note name
            const midiNote = 69 + 12 * Math.log2(freq / 440);
            return ToneModule.Frequency(midiNote, 'midi').toNote();
        });

        // Play chord with fade
        synth.triggerAttackRelease(notes, duration);
    } catch (error) {
        console.error('Failed to play chord:', error);
    }
}

/**
 * Stop all currently playing notes
 */
export function stopAudio(): void {
    if (synth) {
        synth.releaseAll();
    }
}

/**
 * Cleanup audio resources
 */
export function cleanupAudio(): void {
    stopAudio();
    if (synth) {
        synth.dispose();
        synth = null;
    }
    if (reverb) {
        reverb.dispose();
        reverb = null;
    }
    isInitialized = false;
}

/**
 * Format interval value for display
 */
export function formatIntervalValue(value: number): string {
    // Round to nearest 0.1 semitone
    return `${value.toFixed(1)} semitones`;
}

/**
 * Get interval name (e.g., "Perfect 5th" for 7 semitones)
 */
export function getIntervalName(semitones: number): string {
    const rounded = Math.round(semitones);
    const intervalNames: Record<number, string> = {
        0: 'Unison',
        1: 'Minor 2nd',
        2: 'Major 2nd',
        3: 'Minor 3rd',
        4: 'Major 3rd',
        5: 'Perfect 4th',
        6: 'Tritone',
        7: 'Perfect 5th',
        8: 'Minor 6th',
        9: 'Major 6th',
        10: 'Minor 7th',
        11: 'Major 7th',
        12: 'Octave',
    };
    return intervalNames[rounded] || `${rounded} semitones`;
}

/**
 * Validate chord domain config
 */
export function isValidChordConfig(config: ChordDomainConfig): boolean {
    return (
        config.type === 'chord' &&
        config.dimensions === 2 &&
        config.ranges.length === 2 &&
        config.rootFrequency > 0
    );
}

