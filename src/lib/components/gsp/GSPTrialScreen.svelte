<script lang="ts">
  import { onDestroy } from 'svelte';
  import ContinuousSlider from '$lib/components/ContinuousSlider.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { ExperimentConfig } from '$lib/types';
  import { GSPState } from '$lib/experiments/gsp/state.svelte';
  import ColorPreview from './ColorPreview.svelte';
  import AudioControls from './AudioControls.svelte';
  import GSPDebugPanel from './GSPDebugPanel.svelte';
  import { formatDimensionValue } from '$lib/experiments/gsp/domains/color';
  import { formatIntervalValue } from '$lib/experiments/gsp/domains/chord';

  interface Props {
    experimentState: GSPState;
    config: ExperimentConfig;
    onComplete: () => void;
  }

  let { experimentState, config, onComplete }: Props = $props();

  const gspConfig = $derived(config.gsp!);
  const isColorDomain = $derived(gspConfig.domain === 'color');
  const isChordDomain = $derived(gspConfig.domain === 'chord');

  // Calculate progress percentage accounting for current iteration progress
  const progressPercentage = $derived(() => {
    if (!gspConfig.targetIterations || !experimentState.session || !experimentState.sampler) {
      return 0;
    }

    const completedIterations = experimentState.session.completedIterations;
    const dimensions = gspConfig.dimensions;
    const m = gspConfig.m;
    const dimensionIndex = experimentState.sampler.state.dimensionIndex;
    const sampleCount = experimentState.sampler.state.sampleCount;

    // Calculate current progress within the current iteration
    // Each iteration requires (dimensions * m) samples
    // Current progress: (dimensionIndex * m + sampleCount) / (dimensions * m)
    const currentIterationProgress = (dimensionIndex * m + sampleCount) / (dimensions * m);
    
    // Total progress = completed iterations + current iteration progress
    const totalProgress = completedIterations + currentIterationProgress;
    
    return Math.min(100, (totalProgress / gspConfig.targetIterations) * 100);
  });

  let currentValue = $state<number | undefined>(undefined);
  let hasInteracted = $state(false);
  let previousDimensionIndex = $state(-1);
  let previousSampleCount = $state(0);

  // Create a derived vector that updates the current dimension with slider value
  const previewVector = $derived(() => {
    if (!experimentState.session || !experimentState.sampler) {
      return experimentState.session?.vector || [];
    }
    
    const baseVector = [...experimentState.session.vector];
    const dimIndex = experimentState.sampler.state.dimensionIndex;
    
    // If we have a current value from the slider, use it; otherwise use the base vector value
    if (currentValue !== undefined) {
      baseVector[dimIndex] = currentValue;
    }
    
    return baseVector;
  });

  // Reset to undefined when dimension or sample count changes (new sample)
  $effect(() => {
    if (experimentState.sampler) {
      const dimIndex = experimentState.sampler.state.dimensionIndex;
      const sampleCount = experimentState.sampler.state.sampleCount;
      
      // Check if we've moved to a new dimension or new sample
      if (dimIndex !== previousDimensionIndex || sampleCount !== previousSampleCount) {
        currentValue = undefined;
        hasInteracted = false;
        previousDimensionIndex = dimIndex;
        previousSampleCount = sampleCount;
      }
    }
  });

  function handleSliderChange(value: number) {
    currentValue = value;
    // Don't record sample here - only on submit
  }

  function handleSliderInteraction() {
    hasInteracted = true;
  }

  function handleSubmit() {
    if (currentValue === undefined || !hasInteracted) {
      return;
    }

    experimentState.recordSample(currentValue);

    // Reset for next sample
    currentValue = undefined;
    hasInteracted = false;

    // Check if experiment is complete
    if (experimentState.isComplete()) {
      onComplete();
    }
  }

  function formatValue(value: number): string {
    if (isColorDomain) {
      const dimIndex = experimentState.sampler?.state.dimensionIndex || 0;
      return formatDimensionValue(dimIndex, value);
    } else if (isChordDomain) {
      return formatIntervalValue(value);
    }
    return value.toFixed(1);
  }

  // Play audio on slider change for chord domain
  let audioTimeout: ReturnType<typeof setTimeout> | null = null;
  $effect(() => {
    if (isChordDomain && experimentState.sampler && hasInteracted && currentValue !== undefined && audioTimeout === null) {
      audioTimeout = setTimeout(() => {
        // Trigger audio playback (handled by AudioControls component)
        audioTimeout = null;
      }, 100);
    }
  });

  // Handle spacebar to submit
  function handleKeydown(event: KeyboardEvent) {
    if (event.code === 'Space' && !event.repeat) {
      event.preventDefault();
      if (hasInteracted && currentValue !== undefined) {
        handleSubmit();
      }
    }
  }

  // Add keyboard event listener
  $effect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown);
      return () => {
        window.removeEventListener('keydown', handleKeydown);
      };
    }
  });

  onDestroy(() => {
    if (audioTimeout) {
      clearTimeout(audioTimeout);
    }
  });
</script>

<div class="page-container bg-gray-50 min-h-screen flex flex-col">
  <div class="section-container py-6 flex-1 flex flex-col">
    <!-- Progress bar -->
    <div class="content-wrapper-narrow mb-8">
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary-600 rounded-full transition-all duration-300"
          style="width: {progressPercentage()}%"
        ></div>
      </div>
      <div class="mt-2 text-center text-sm text-gray-600">
        Iteration {experimentState.session?.completedIterations || 0}
        {gspConfig.targetIterations ? `of ${gspConfig.targetIterations}` : ''}
        {#if experimentState.sampler}
          <span class="text-gray-400">
            • Adjusting: {experimentState.sampler.getCurrentDimensionName()}
          </span>
        {/if}
      </div>
    </div>

    <!-- Main content - centered -->
    <div class="content-wrapper-narrow flex-1 flex items-center justify-center">
      {#if experimentState.sampler && experimentState.session}
        <div class="flex flex-col items-center justify-center gap-8 w-full">
          <div class="flex items-center justify-center mb-4">
            {#if isColorDomain}
              <ColorPreview vector={previewVector()} />
            {:else if isChordDomain}
              <AudioControls
                config={gspConfig.domainConfig as any}
                vector={previewVector()}
                disabled={currentValue === undefined}
              />
            {/if}
          </div>

          <div class="w-full max-w-2xl">
            <ContinuousSlider
              min={experimentState.sampler.getCurrentDimensionRange().min}
              max={experimentState.sampler.getCurrentDimensionRange().max}
              value={currentValue}
              step={(experimentState.sampler.getCurrentDimensionRange().max -
                experimentState.sampler.getCurrentDimensionRange().min) /
                1000}
              label={experimentState.sampler.getCurrentDimensionName()}
              wrapped={experimentState.sampler.getCurrentDimensionRange().wrapped}
              onChange={handleSliderChange}
              onInteraction={handleSliderInteraction}
            />
          </div>

          <div class="flex justify-center w-full">
            <Button
              variant="primary"
              size="lg"
              disabled={!hasInteracted || currentValue === undefined}
              onclick={handleSubmit}
            >
              Submit
            </Button>
          </div>

          <div class="text-center text-gray-600">
            <p class="text-body">
              Sample {experimentState.sampler.state.sampleCount} of {gspConfig.m} for this dimension
            </p>
            <p class="text-meta italic mt-2">
              Adjust the slider until the stimulus matches your mental prototype, then click Submit or press Space
            </p>
          </div>
        </div>
      {/if}
    </div>

    <!-- Debug Panel -->
    <GSPDebugPanel 
      session={experimentState.session} 
      domain={gspConfig.domain} 
      domainConfig={gspConfig.domainConfig}
    />
  </div>
</div>


