import type { GSPSession, ExperimentConfig, GSPConfig } from '$lib/types';
import { GSPSampler } from './sampler.svelte';
import {
  loadCurrentGSPSession,
  saveGSPSession,
  createGSPSession,
  logSample,
} from './storage';

/**
 * GSP Experiment State Management
 */
export class GSPState {
  sampler: GSPSampler | null = null;
  session: GSPSession | null = null;
  config: ExperimentConfig | null = null;
  isReady = $state(false);

  /**
   * Initialize from experiment config
   */
  initializeFromConfig(config: ExperimentConfig): void {
    if (config.type !== 'gsp' || !config.gsp) {
      throw new Error('Invalid GSP config');
    }

    this.config = config;
    const gspConfig = config.gsp;

    // Try to load existing session
    const existingSession = loadCurrentGSPSession(config.slug);
    
    if (existingSession) {
      // Resume existing session
      this.session = existingSession;
      this.sampler = new GSPSampler(
        gspConfig.dimensions,
        existingSession.vector,
        gspConfig.m,
        gspConfig.domainConfig
      );
      this.sampler.state.dimensionIndex = existingSession.dimensionIndex;
      this.sampler.state.iteration = existingSession.iteration;
      this.sampler.state.sampleCount = existingSession.sampleCount;
    } else {
      // Create new session
      const initialVector = gspConfig.initialVector || 
        new Array(gspConfig.dimensions).fill(0).map((_, i) => {
          const range = gspConfig.domainConfig.ranges[i];
          return (range.min + range.max) / 2; // Start at midpoint
        });
      
      this.session = createGSPSession(config.slug, initialVector, gspConfig.dimensions);
      this.sampler = new GSPSampler(
        gspConfig.dimensions,
        initialVector,
        gspConfig.m,
        gspConfig.domainConfig
      );
      saveGSPSession(config.slug, this.session);
    }

    this.isReady = true;
  }

  /**
   * Record a sample from the slider
   */
  recordSample(value: number): void {
    if (!this.sampler || !this.session || !this.config) return;

    // Capture dimension index and vector BEFORE recordSample() potentially changes it
    const dimensionIndex = this.sampler.state.dimensionIndex;
    const vectorBeforeSample = [...this.sampler.state.vector];
    
    // Check if this will complete a step (before calling recordSample)
    const wasStepComplete = this.sampler.isStepComplete();
    const willCompleteStep = this.sampler.state.sampleCount === this.config.gsp!.m - 1;
    
    // Track if we're about to complete a cycle (dimensionIndex will wrap to 0)
    const willCompleteCycle = willCompleteStep && dimensionIndex === this.config.gsp!.dimensions - 1;

    this.sampler.recordSample(value);
    
    // Log the sample with the dimension index and vector state it was sampled for (before commitStep changed it)
    this.session = logSample(
      this.session,
      dimensionIndex,
      value,
      vectorBeforeSample
    );

    // Update session state
    this.session.vector = [...this.sampler.state.vector];
    this.session.dimensionIndex = this.sampler.state.dimensionIndex;
    this.session.iteration = this.sampler.state.iteration;
    this.session.sampleCount = this.sampler.state.sampleCount;

    // Increment completed iterations only when a full cycle completes (all dimensions visited)
    // A cycle completes when we finish the last dimension (dimensionIndex wraps to 0)
    if (willCompleteCycle && !wasStepComplete) {
      this.session.completedIterations++;
    }

    // Save session
    saveGSPSession(this.config.slug, this.session);
  }

  /**
   * Check if target iterations reached
   */
  isComplete(): boolean {
    if (!this.config?.gsp?.targetIterations || !this.session) return false;
    return this.session.completedIterations >= this.config.gsp.targetIterations;
  }

  /**
   * Reset state
   */
  reset(): void {
    this.sampler = null;
    this.session = null;
    this.config = null;
    this.isReady = false;
  }
}

