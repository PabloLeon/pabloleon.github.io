<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import type { ExperimentConfig } from '$lib/types';
  import ColorPreview from './ColorPreview.svelte';
  import AudioControls from './AudioControls.svelte';

  interface Props {
    config: ExperimentConfig;
    onStart: () => void;
  }

  let { config, onStart }: Props = $props();

  const isColorDomain = $derived(config.gsp?.domain === 'color');
  const isChordDomain = $derived(config.gsp?.domain === 'chord');
  
  // Example vector for preview
  const exampleVector = $derived(config.gsp?.initialVector || [180, 50, 50]);
</script>

<div class="page-container">
  <div class="section-container py-8 sm:py-12">
    <div class="content-wrapper-narrow">
      <div class="card">
        <h1 class="heading-section text-center mb-6">{config.title}</h1>

        <div class="space-content">
          <section>
            <h2 class="heading-small mb-2">What is this experiment?</h2>
            <div class="space-text">
              <p class="text-body">
                {config.description}
              </p>
              <p class="text-body">
                This experiment uses Gibbs Sampling with People (GSP) to map your mental representation
                of a concept. You'll adjust different properties one at a time until the stimulus matches
                your internal prototype.
              </p>
            </div>
          </section>

          {#if isColorDomain}
            <section>
              <h2 class="heading-small mb-2">How it works</h2>
              <div class="space-text">
                <p class="text-body">
                  You'll see a color preview and a slider. Adjust the slider until the color matches
                  your mental prototype of "{config.title.split('"')[1] || 'the target'}". You'll do
                  this for each color property (Hue, Saturation, Lightness) multiple times.
                </p>
              </div>
              <div class="mt-4 p-5 bg-gray-50 rounded-lg flex flex-col items-center gap-4">
                <p class="text-meta font-medium">Example color preview:</p>
                <ColorPreview vector={exampleVector} />
              </div>
            </section>
          {:else if isChordDomain}
            <section>
              <h2 class="heading-small mb-2">How it works</h2>
              <div class="space-text">
                <p class="text-body">
                  You'll hear a chord and adjust intervals using a slider until it sounds most pleasant
                  or matches your mental prototype. You'll do this for each interval multiple times.
                </p>
              </div>
              <div class="mt-4 p-5 bg-gray-50 rounded-lg flex flex-col items-center gap-4">
                <p class="text-meta font-medium">Try the audio controls:</p>
                <AudioControls config={config.gsp!.domainConfig as any} vector={exampleVector} />
              </div>
            </section>
          {/if}

          <section>
            <h2 class="heading-small mb-2">What to expect</h2>
            <ul class="space-y-2 mb-4">
              <li class="text-body">
                You'll adjust <strong>{config.gsp?.m || 3} samples</strong> for each dimension
              </li>
              <li class="text-body">
                The experiment will cycle through all dimensions automatically
              </li>
              <li class="text-body">
                {config.gsp?.targetIterations
                  ? `Target: ${config.gsp.targetIterations} iterations`
                  : 'Continue until you feel satisfied'}
              </li>
              <li class="text-body">
                <strong>Tip:</strong> You can submit your selection by clicking the Submit button or pressing the <strong>Space</strong> key
              </li>
            </ul>
            <p class="text-meta italic">
              There are no right or wrong answers — we're interested in your personal perception.
            </p>
          </section>

          <section>
            <h2 class="heading-small mb-2">Session information</h2>
            <p class="text-body">
              Your progress is automatically saved. If you close this page and return later,
              you can continue from where you left off.
            </p>
          </section>
        </div>

        <div class="mt-8 flex justify-center">
          <Button variant="primary" size="lg" onclick={onStart}>
            Start Experiment
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>


