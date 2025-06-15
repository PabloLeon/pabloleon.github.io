<script lang="ts">
  import { cn } from '$lib/utils';
  import type { ButtonProps } from '$lib/types';
  import type { Snippet } from 'svelte';

  type $$Props = ButtonProps & {
    type?: 'button' | 'submit' | 'reset';
    children?: Snippet;
    active?: boolean;
  };

  let {
    variant = 'primary',
    size = 'md',
    onclick = undefined,
    disabled = false,
    type = 'button',
    class: className = '',
    active = false,
    children,
    ...restProps
  }: $$Props = $props();

  let buttonElement: HTMLButtonElement;

  let classes = $derived(cn(
    // Base styles
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",

    // Focus ring styles for non-link variants
    {
      "focus:ring-2 focus:ring-primary-600 focus:ring-offset-2": variant !== "link" && variant !== "nav-link",
    },

    // Variant styles
    {
      // Primary - main CTA button
      "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg active:bg-primary-800 shadow-sm":
        variant === "primary",

      // Secondary - less prominent actions
      "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md active:bg-gray-300": variant === "secondary",

      // Outline - alternative actions
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 hover:shadow-sm active:bg-primary-100":
        variant === "outline",

      // Link - text-like buttons (no focus ring)
      "text-primary-600 hover:text-primary-800 underline underline-offset-4 hover:no-underline hover:translate-x-1 p-0":
        variant === "link",

      // Nav Link - navigation links that only show underline when active (no focus ring)
      "text-primary-600 hover:text-primary-800 hover:translate-x-1 p-0": variant === "nav-link",

      // Ghost - subtle actions
      "text-primary-600 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100": variant === "ghost",
    },

    // Active state for nav-link variant
    {
      "underline underline-offset-4": variant === "nav-link" && active,
    },

    // Size styles
    {
      "px-3 py-1.5 text-sm": size === "sm",
      "px-4 py-2 text-base": size === "md",
      "px-6 py-3 text-lg": size === "lg",
    },

    // Link and nav-link variants don't need padding
    {
      "px-0 py-0": variant === "link" || variant === "nav-link",
    },

    className,
  ));

  function handleClick() {
    if (onclick) {
      onclick();
    }
  }
</script>

<button
  bind:this={buttonElement}
  class={classes}
  {disabled}
  {type}
  onclick={handleClick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button> 