<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import PieChart from './PieChart.svelte';
  import type { Lottery } from '$lib/types';

  interface Props {
    onStart: () => void;
  }

  let { onStart }: Props = $props();

  // Example lottery for demonstration
  const exampleLottery: Lottery = { p20: 0.4, p10: 0.35, p0: 0.25 };
</script>

<div class="instructions-container">
  <div class="instructions-content">
    <h1 class="instructions-title">Utility Estimation Experiment</h1>

    <div class="instructions-body">
      <section class="instructions-section">
        <h2>What is this experiment?</h2>
        <p>
          This experiment helps us understand how people make decisions under uncertainty.
          You'll be presented with pairs of lotteries and asked to choose which one you prefer.
        </p>
      </section>

      <section class="instructions-section">
        <h2>Understanding Lotteries</h2>
        <p>
          Each lottery has three possible outcomes with different prizes:
        </p>
        <ul class="outcome-list">
          <li>
            <span class="outcome-dot outcome-p20"></span>
            <strong>£20</strong> — the best prize
          </li>
          <li>
            <span class="outcome-dot outcome-p10"></span>
            <strong>£10</strong> — the middle prize
          </li>
          <li>
            <span class="outcome-dot outcome-p0"></span>
            <strong>£0</strong> — no prize
          </li>
        </ul>

        <div class="example-container">
          <p class="example-label">Example lottery:</p>
          <div class="example-lottery">
            <PieChart lottery={exampleLottery} size={140} />
            <div class="example-probabilities">
              <div class="prob-row">
                <span class="outcome-dot outcome-p20"></span>
                <span>40% chance of £20</span>
              </div>
              <div class="prob-row">
                <span class="outcome-dot outcome-p10"></span>
                <span>35% chance of £10</span>
              </div>
              <div class="prob-row">
                <span class="outcome-dot outcome-p0"></span>
                <span>25% chance of £0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="instructions-section">
        <h2>How to respond</h2>
        <p>
          On each trial, you'll see two lotteries side by side. Choose the one you prefer:
        </p>
        <ul class="key-list">
          <li>
            Press <kbd>←</kbd> (Left Arrow) to choose the <strong>left</strong> lottery
          </li>
          <li>
            Press <kbd>→</kbd> (Right Arrow) to choose the <strong>right</strong> lottery
          </li>
        </ul>
        <p class="instructions-note">
          There are no right or wrong answers — we're interested in your personal preferences.
        </p>
      </section>

      <section class="instructions-section">
        <h2>Session information</h2>
        <p>
          Your progress is automatically saved. If you close this page and return later,
          you can continue from where you left off.
        </p>
      </section>
    </div>

    <div class="instructions-footer">
      <Button variant="primary" size="lg" onclick={onStart}>
        Start Experiment
      </Button>
    </div>
  </div>
</div>

<style>
  .instructions-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .instructions-content {
    max-width: 40rem;
    background: white;
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  .instructions-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .instructions-body {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .instructions-section h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .instructions-section p {
    color: #4b5563;
    line-height: 1.6;
  }

  .outcome-list {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .outcome-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4b5563;
  }

  .outcome-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .outcome-p20 {
    background-color: #3b82f6;
  }

  .outcome-p10 {
    background-color: #22c55e;
  }

  .outcome-p0 {
    background-color: #9ca3af;
  }

  .example-container {
    margin-top: 1rem;
    padding: 1.25rem;
    background: #f9fafb;
    border-radius: 0.75rem;
  }

  .example-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.75rem;
  }

  .example-lottery {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .example-probabilities {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .prob-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #4b5563;
  }

  .key-list {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .key-list li {
    color: #4b5563;
    line-height: 1.6;
  }

  kbd {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-family: 'Geist Mono', monospace;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .instructions-note {
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
    margin-top: 0.5rem;
  }

  .instructions-footer {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }
</style>

