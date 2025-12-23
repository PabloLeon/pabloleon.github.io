<script lang="ts">
  import type { Lottery } from '$lib/types';
  import { formatProbability, formatCurrency } from '$lib/experiments/mcmc-utility/utils';
  import PieChart from './PieChart.svelte';

  interface Props {
    lottery: Lottery;
    label: string;
    selected?: boolean;
    disabled?: boolean;
    keyHint?: string;
  }

  let { lottery, label, selected = false, disabled = false, keyHint }: Props = $props();
</script>

<div
  class="lottery-card"
  class:selected
  class:disabled
  role="option"
  aria-selected={selected}
  aria-disabled={disabled}
>
  <div class="card-label">{label}</div>

  <div class="chart-container">
    <PieChart {lottery} size={180} />
  </div>

  <div class="probabilities">
    <div class="prob-row">
      <span class="prob-dot prob-p20"></span>
      <span class="prob-value">{formatCurrency(20)}</span>
      <span class="prob-percent">{formatProbability(lottery.p20)}</span>
    </div>
    <div class="prob-row">
      <span class="prob-dot prob-p10"></span>
      <span class="prob-value">{formatCurrency(10)}</span>
      <span class="prob-percent">{formatProbability(lottery.p10)}</span>
    </div>
    <div class="prob-row">
      <span class="prob-dot prob-p0"></span>
      <span class="prob-value">{formatCurrency(0)}</span>
      <span class="prob-percent">{formatProbability(lottery.p0)}</span>
    </div>
  </div>

  {#if keyHint}
    <div class="key-hint">
      <kbd>{keyHint}</kbd>
    </div>
  {/if}
</div>

<style>
  .lottery-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background: white;
    border-radius: 1rem;
    border: 2px solid #e5e7eb;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
    min-width: 14rem;
  }

  .lottery-card:not(.disabled):hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .lottery-card.selected {
    border-color: #3b82f6;
    background: linear-gradient(to bottom, #eff6ff, white);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    transform: scale(1.02);
  }

  .lottery-card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .card-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }

  .chart-container {
    margin-bottom: 1.25rem;
  }

  .probabilities {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .prob-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
  }

  .prob-dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .prob-p20 {
    background-color: #3b82f6;
  }

  .prob-p10 {
    background-color: #22c55e;
  }

  .prob-p0 {
    background-color: #9ca3af;
  }

  .prob-value {
    font-weight: 600;
    color: #374151;
    min-width: 2.5rem;
  }

  .prob-percent {
    margin-left: auto;
    font-family: 'Geist Mono', monospace;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .key-hint {
    margin-top: 1rem;
  }

  .key-hint kbd {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    font-family: 'Geist Mono', monospace;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
</style>

