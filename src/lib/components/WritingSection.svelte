<script lang="ts">
	import { Calendar, ArrowRight } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import type { WritingData } from '$lib/types';

	let { writings }: { writings: WritingData[] } = $props();
</script>

<section id="writing" class="section-container">
	<div class="section-header">
		<h2 class="heading-section">Writing</h2>
		<div class="accent-bar"></div>
	</div>

	<div class="space-content">
		{#each writings as writing}
			<article class="card">
				<h3 class="heading-card">{writing.title}</h3>

				<div class="meta-group">
					<span class="meta-item">
						<Calendar class="w-4 h-4" />
						{writing.date}
					</span>
					{#if writing.category}
						<span
							class={writing.category === 'Research' ? 'badge-category-research' : 'badge-category-default'}
						>
							{writing.category}
						</span>
					{/if}
				</div>

				{#if writing.excerpt}
					<p class="text-body mb-4">{writing.excerpt}</p>
				{/if}

				<a href={`/writing/${writing.slug}`}>
					<Button variant="link" class="justify-start p-0">
						Read more
						<ArrowRight class="w-4 h-4" />
					</Button>
				</a>
			</article>
		{/each}
	</div>
</section> 