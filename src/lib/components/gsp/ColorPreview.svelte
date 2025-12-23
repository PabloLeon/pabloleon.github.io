<script lang="ts">
  import { getColorCSSVariable } from '$lib/experiments/gsp/domains/color';

  interface Props {
    vector: number[];
  }

  let { vector }: Props = $props();

  let colorCSS = $derived(getColorCSSVariable(vector));
</script>

<div class="color-preview-container">
  <div class="color-preview" style="background-color: {colorCSS}"></div>
  <div class="color-info">
    <div class="color-value">{colorCSS}</div>
  </div>
</div>

<style>
  .color-preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .color-preview {
    width: 12rem;
    height: 12rem;
    border-radius: 1rem;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
  }

  .color-info {
    text-align: center;
  }

  .color-value {
    font-family: 'Geist Mono', monospace;
    font-size: 0.875rem;
    color: #6b7280;
    background: #f9fafb;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
  }
</style>

