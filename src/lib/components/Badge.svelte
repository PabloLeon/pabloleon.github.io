<script lang="ts">
  import { cn } from '$lib/utils';

  let {
    variant = 'default',
    size = 'md',
    class: className = '',
    children
  }: {
    variant?: 'status-active' | 'status-default' | 'category-research' | 'category-default' | 'tag' | 'default';
    size?: 'sm' | 'md';
    class?: string;
    children?: any;
  } = $props();

  let badgeClass = $derived(cn(
    'badge',
    {
      'badge-status-active': variant === 'status-active',
      'badge-status-default': variant === 'status-default',
      'badge-category-research': variant === 'category-research',
      'badge-category-default': variant === 'category-default',
      'badge-tag': variant === 'tag',
      'px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs': variant === 'default',
    },
    className
  ));
</script>

<span class={badgeClass}>
  {#if children}
    {@render children()}
  {/if}
</span> 