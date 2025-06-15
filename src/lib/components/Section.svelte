<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  let {
    title,
    variant = 'default',
    class: className = '',
    children
  }: {
    title: string;
    variant?: 'default' | 'alt';
    class?: string;
    children?: Snippet;
  } = $props();

  let sectionClass = $derived(cn(
    variant === 'alt' ? 'section-container-alt' : 'section-container',
    className
  ));
</script>

<section class={sectionClass}>
  <div class="content-wrapper">
    <div class="section-header">
      <h2 class="heading-section">{title}</h2>
      <div class="accent-bar"></div>
    </div>

    {#if children}
      {@render children()}
    {/if}
  </div>
</section> 