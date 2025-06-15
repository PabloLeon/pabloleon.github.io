<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  let {
    variant = 'primary',
    size = 'md',
    class: className = '',
    disabled = false,
    type = 'button',
    onclick,
    children,
    ...restProps
  }: {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    class?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: () => void;
    children?: Snippet;
  } = $props();

  let classes = $derived(cn(
    // Base styles
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",

    // Variant styles
    {
      "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800": variant === "primary",
      "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300": variant === "secondary",
      "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100": variant === "outline",
      "text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200": variant === "ghost",
    },

    // Size styles
    {
      "w-8 h-8 text-sm": size === "sm",
      "w-10 h-10 text-base": size === "md", 
      "w-12 h-12 text-lg": size === "lg",
    },

    className,
  ));
</script>

<button
  class={classes}
  {disabled}
  {type}
  {onclick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button> 