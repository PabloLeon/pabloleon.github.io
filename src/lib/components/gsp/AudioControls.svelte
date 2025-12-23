<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Play } from 'lucide-svelte';
  import type { ChordDomainConfig } from '$lib/types';
  import { playChord, cleanupAudio, initializeAudio } from '$lib/experiments/gsp/domains/chord';

  interface Props {
    config: ChordDomainConfig;
    vector: number[];
    disabled?: boolean;
  }

  let { config, vector, disabled = false }: Props = $props();

  let isPlaying = $state(false);
  let audioReady = $state(false);

  onMount(async () => {
    // Initialize audio on first user interaction
    try {
      await initializeAudio();
      audioReady = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  });

  onDestroy(() => {
    cleanupAudio();
  });

  async function handlePlay() {
    if (isPlaying || disabled) {
      return;
    }

    if (!audioReady) {
      try {
        await initializeAudio();
        audioReady = true;
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        return;
      }
    }

    isPlaying = true;
    await playChord(config, vector, 0.5);
    // Reset playing state after a short delay
    setTimeout(() => {
      isPlaying = false;
    }, 600);
  }

  // Handle J key to play chord
  function handleKeydown(event: KeyboardEvent) {
    if (event.code === 'KeyJ' && !event.repeat) {
      event.preventDefault();
      if (audioReady && !isPlaying && !disabled) {
        handlePlay();
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
</script>

<div class="audio-controls">
  <button
    class="audio-button"
    onclick={handlePlay}
    disabled={!audioReady || isPlaying || disabled}
    type="button"
  >
    <Play class="w-5 h-5" />
    Play Chord
  </button>
</div>

<style>
  .audio-controls {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .audio-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .audio-button:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .audio-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .audio-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

