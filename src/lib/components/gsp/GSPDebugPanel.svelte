<script lang="ts">
  import type { GSPSession, GSPDomainConfig } from '$lib/types';
  import { formatIntervalValue } from '$lib/experiments/gsp/domains/chord';
  import { formatDimensionValue } from '$lib/experiments/gsp/domains/color';

  interface Props {
    session: GSPSession | null;
    domain: 'color' | 'chord' | null;
    domainConfig: GSPDomainConfig | null;
  }

  let { session, domain, domainConfig }: Props = $props();

  let isOpen = $state(false);

  function formatSampleValue(value: number, dimensionIndex: number): string {
    if (domain === 'color') {
      return formatDimensionValue(dimensionIndex, value);
    } else if (domain === 'chord') {
      return formatIntervalValue(value);
    }
    return value.toFixed(2);
  }

  function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }

  function getDimensionName(index: number): string {
    if (!domainConfig) return `Dim ${index}`;
    return domainConfig.ranges[index]?.name || `Dim ${index}`;
  }
</script>

<div class="debug-panel">
  <button
    class="debug-toggle"
    onclick={() => isOpen = !isOpen}
    type="button"
  >
    {isOpen ? '▼' : '▶'} Debug
  </button>

  {#if isOpen && session}
    <div class="debug-content">
      <div class="debug-header">
        <h3 class="debug-title">Sample History</h3>
        <span class="debug-count">{session.sampleLogs.length} samples</span>
      </div>
      
      <div class="debug-list">
        {#if session.sampleLogs.length === 0}
          <p class="debug-empty">No samples recorded yet</p>
        {:else}
          {#each session.sampleLogs.slice().reverse() as log (log.timestamp)}
            <div class="debug-item">
              <div class="debug-item-header">
                <span class="debug-dimension">{getDimensionName(log.dimensionIndex)}</span>
                <span class="debug-iteration">Iter {log.iteration}</span>
                <span class="debug-time">{formatTimestamp(log.timestamp)}</span>
              </div>
              <div class="debug-values">
                {#each (log.vector || []) as value, idx (idx)}
                  <div class="debug-dimension-value" class:debug-dimension-changed={idx === log.dimensionIndex}>
                    <span class="debug-dimension-label">{getDimensionName(idx)}:</span>
                    <span class="debug-dimension-value-text">{formatSampleValue(value, idx)}</span>
                  </div>
                {/each}
                {#if !log.vector || log.vector.length === 0}
                  <!-- Fallback for old logs without vector -->
                  <div class="debug-dimension-value debug-dimension-changed">
                    <span class="debug-dimension-label">{getDimensionName(log.dimensionIndex)}:</span>
                    <span class="debug-dimension-value-text">{formatSampleValue(log.sampleValue, log.dimensionIndex)}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .debug-panel {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    max-height: 500px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .debug-toggle {
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    border: none;
    border-bottom: 1px solid #e5e7eb;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    text-align: left;
    width: 100%;
  }

  .debug-toggle:hover {
    background: #e5e7eb;
  }

  .debug-content {
    display: flex;
    flex-direction: column;
    max-height: 450px;
  }

  .debug-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .debug-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .debug-count {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .debug-list {
    overflow-y: auto;
    padding: 0.5rem;
  }

  .debug-empty {
    padding: 1rem;
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
  }

  .debug-item {
    padding: 0.5rem;
    margin-bottom: 0.25rem;
    background: #f9fafb;
    border-radius: 0.25rem;
    border: 1px solid #e5e7eb;
  }

  .debug-item-header {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }

  .debug-dimension {
    font-weight: 600;
    color: #3b82f6;
  }

  .debug-iteration {
    color: #6b7280;
  }

  .debug-time {
    color: #9ca3af;
    margin-left: auto;
  }

  .debug-values {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.5rem;
  }

  .debug-dimension-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }

  .debug-dimension-value.debug-dimension-changed {
    background: #dbeafe;
    border: 1px solid #3b82f6;
  }

  .debug-dimension-label {
    font-weight: 500;
    color: #6b7280;
  }

  .debug-dimension-changed .debug-dimension-label {
    color: #3b82f6;
    font-weight: 600;
  }

  .debug-dimension-value-text {
    font-weight: 500;
    color: #111827;
  }

  .debug-dimension-changed .debug-dimension-value-text {
    color: #1e40af;
    font-weight: 600;
  }
</style>

