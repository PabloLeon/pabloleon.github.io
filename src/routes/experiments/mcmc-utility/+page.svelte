<script lang="ts">
  import { onMount } from 'svelte';
  import type { ExperimentSession, ExperimentScreen } from '$lib/types';
  import { ExperimentState } from '$lib/experiments/mcmc-utility/state.svelte';
  import {
    loadCurrentSession,
    saveSession,
  } from '$lib/experiments/mcmc-utility/storage';
  import Instructions from './components/Instructions.svelte';
  import TrialScreen from './components/TrialScreen.svelte';
  import Debrief from './components/Debrief.svelte';

  // Constants
  const TARGET_TRIALS = 60;

  // Experiment state
  const experimentState = new ExperimentState();

  // Session state
  let session = $state<ExperimentSession | null>(null);

  // Current screen
  let currentScreen = $state<ExperimentScreen>('instructions');

  // Loading state for initial session check
  let isInitializing = $state(true);

  /**
   * Initialize experiment - check for existing session or create new
   */
  function initializeExperiment(resumeSession?: ExperimentSession | null) {
    if (resumeSession) {
      // Resume existing session
      experimentState.initializeFromSession(resumeSession);
      session = resumeSession;

      // Determine which screen to show
      if (resumeSession.trialCount >= TARGET_TRIALS) {
        currentScreen = 'debrief';
      } else if (resumeSession.trialCount > 0) {
        // Resume in the middle of experiment
        currentScreen = 'trial';
      } else {
        currentScreen = 'instructions';
      }
    } else {
      // Start fresh
      experimentState.initializeNew();
      session = experimentState.toSession([], []);
      currentScreen = 'instructions';
      saveSession(session);
    }

    isInitializing = false;
  }

  /**
   * Handle starting the experiment from instructions
   */
  function handleStart() {
    currentScreen = 'trial';
  }

  /**
   * Handle session updates from TrialScreen
   */
  function handleSessionUpdate(updatedSession: ExperimentSession) {
    session = updatedSession;
  }

  /**
   * Handle experiment completion
   */
  function handleComplete() {
    currentScreen = 'debrief';
  }

  /**
   * Handle restart from debrief
   */
  function handleRestart() {
    experimentState.reset();
    experimentState.initializeNew();
    session = experimentState.toSession([], []);
    currentScreen = 'instructions';
    saveSession(session);
  }

  // Check for existing session on mount
  onMount(() => {
    const existingSession = loadCurrentSession();
    initializeExperiment(existingSession);
  });
</script>

<svelte:head>
  <title>MCMC Utility Estimation - Experiments</title>
  <meta
    name="description"
    content="Participate in a utility estimation experiment using MCMC methods. Choose between lotteries to help map your preferences."
  />
</svelte:head>

<div class="experiment-container">
  {#if isInitializing}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading experiment...</p>
    </div>
  {:else if currentScreen === 'instructions'}
    <Instructions onStart={handleStart} />
  {:else if currentScreen === 'trial' && session}
    <TrialScreen
      {experimentState}
      {session}
      onSessionUpdate={handleSessionUpdate}
      onComplete={handleComplete}
      targetTrials={TARGET_TRIALS}
    />
  {:else if currentScreen === 'debrief' && session}
    <Debrief {session} onRestart={handleRestart} />
  {/if}
</div>

<style>
  .experiment-container {
    min-height: 100vh;
  }

  .loading-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: #6b7280;
  }

  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

