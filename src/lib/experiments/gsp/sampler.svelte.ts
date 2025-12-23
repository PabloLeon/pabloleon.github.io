import type { GSPDomainConfig, DimensionRange } from '$lib/types';
import { clamp, wrap, mean } from './utils';

/**
 * GSP Sampler state interface
 */
export interface GSPState {
  vector: number[]; // The N-dimensional parameter vector
  dimensionIndex: number; // Current active dimension (k)
  iteration: number; // Current step in the chain
  sampleCount: number; // Current count within the aggregation buffer
}

/**
 * GSP Sampler class implementing Gibbs Sampling with People algorithm
 * Uses Svelte 5 runes for reactive state management
 */
export class GSPSampler {
  // Reactive state
  state = $state<GSPState>({
    vector: [],
    dimensionIndex: 0,
    iteration: 0,
    sampleCount: 0,
  });

  // Aggregation buffer (non-reactive for performance)
  private buffer: number[] = [];

  constructor(
    readonly dimensions: number,
    initial: number[],
    readonly m: number = 3,
    readonly domainConfig: GSPDomainConfig
  ) {
    // Initialize vector with provided initial values or zeros
    this.state.vector = initial.length === dimensions ? [...initial] : new Array(dimensions).fill(0);
    
    // Clamp initial values to valid ranges
    this.state.vector = this.state.vector.map((val, idx) => {
      const range = domainConfig.ranges[idx];
      if (range.wrapped) {
        return wrap(val, range.min, range.max);
      }
      return clamp(val, range.min, range.max);
    });
  }

  /**
   * Record a single slider adjustment
   */
  recordSample(value: number): void {
    const range = this.domainConfig.ranges[this.state.dimensionIndex];
    
    // Clamp or wrap value based on dimension type
    const clampedValue = range.wrapped
      ? wrap(value, range.min, range.max)
      : clamp(value, range.min, range.max);
    
    this.buffer.push(clampedValue);
    this.state.sampleCount = this.buffer.length;

    // If we reached m samples, commit and move to next dimension
    if (this.buffer.length >= this.m) {
      this.commitStep();
    }
  }

  /**
   * Commit the current step by averaging samples and moving to next dimension
   */
  private commitStep(): void {
    if (this.buffer.length === 0) return;

    // Calculate mean of samples
    const meanValue = mean(this.buffer);
    
    // Update the vector at current dimension
    this.state.vector[this.state.dimensionIndex] = meanValue;

    // Circular increment dimension
    this.state.dimensionIndex = (this.state.dimensionIndex + 1) % this.dimensions;
    this.state.iteration++;

    // Reset buffer
    this.buffer = [];
    this.state.sampleCount = 0;
  }

  /**
   * Get current dimension range
   */
  getCurrentDimensionRange(): DimensionRange {
    return this.domainConfig.ranges[this.state.dimensionIndex];
  }

  /**
   * Get current dimension name
   */
  getCurrentDimensionName(): string {
    return this.domainConfig.ranges[this.state.dimensionIndex].name;
  }

  /**
   * Reset sampler to initial state
   */
  reset(initial?: number[]): void {
    const initialVector = initial || this.state.vector;
    this.state.vector = initialVector.length === this.dimensions 
      ? [...initialVector] 
      : new Array(this.dimensions).fill(0);
    this.state.dimensionIndex = 0;
    this.state.iteration = 0;
    this.state.sampleCount = 0;
    this.buffer = [];
  }

  /**
   * Get current vector value for a specific dimension
   */
  getDimensionValue(index: number): number {
    return this.state.vector[index] ?? 0;
  }

  /**
   * Check if current step is complete (has m samples)
   */
  isStepComplete(): boolean {
    return this.buffer.length >= this.m;
  }
}

