<script lang="ts">
  import { onMount } from 'svelte';
  import type { ExperimentConfig } from '$lib/types';
  import { GSPState } from '$lib/experiments/gsp/state.svelte';
  import GSPInstructions from '$lib/components/gsp/GSPInstructions.svelte';
  import GSPTrialScreen from '$lib/components/gsp/GSPTrialScreen.svelte';
  import GSPDebrief from '$lib/components/gsp/GSPDebrief.svelte';
  import type { ExperimentScreen } from '$lib/types';

  let { data }: { data: { experiment: ExperimentConfig } } = $props();

  const config = $derived(data.experiment);
  const experimentState = new GSPState();

  let currentScreen = $state<ExperimentScreen>('instructions');
  let isInitializing = $state(true);

  /**
   * Initialize experiment
   */
  function initializeExperiment() {
    if (config.type === 'gsp') {
      experimentState.initializeFromConfig(config);
      
      // Determine which screen to show
      if (experimentState.session) {
        if (experimentState.isComplete()) {
          currentScreen = 'debrief';
        } else if (experimentState.session.iteration > 0) {
          currentScreen = 'trial';
        } else {
          currentScreen = 'instructions';
        }
      } else {
        currentScreen = 'instructions';
      }
    } else {
      // For MCMC experiments, redirect to legacy route for now
      window.location.href = `/experiments/${config.slug}`;
      return;
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
    experimentState.initializeFromConfig(config);
    currentScreen = 'instructions';
  }

  // Initialize on mount
  onMount(() => {
    initializeExperiment();
  });
</script>

<svelte:head>
  <title>{config.title} - Experiments</title>
  <meta name="description" content={config.description} />
</svelte:head>

<div class="page-container">
  {#if isInitializing}
    <div class="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-600">
      <div class="w-10 h-10 border-[3px] border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p class="text-body">Loading experiment...</p>
    </div>
  {:else if config.type === 'gsp' && experimentState.isReady}
    {#if currentScreen === 'instructions'}
      <GSPInstructions {config} onStart={handleStart} />
    {:else if currentScreen === 'trial' && experimentState.session}
      <GSPTrialScreen {experimentState} {config} onComplete={handleComplete} />
    {:else if currentScreen === 'debrief' && experimentState.session}
      <GSPDebrief session={experimentState.session} {config} onRestart={handleRestart} />
    {/if}
  {/if}
</div>

