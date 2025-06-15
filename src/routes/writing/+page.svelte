<script lang="ts">
	import { Calendar, ArrowRight } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import type { WritingData } from '$lib/types';

	let { data }: { data: { writings: WritingData[] } } = $props();
	let writings = $derived(data.writings);
</script>

<svelte:head>
	<title>Writing - Pablo León-Villagrá</title>
</svelte:head>

<div class="page-container">
	<main class="main-content">
		<section class="section-container">
			<div class="content-wrapper">
				<div class="section-header">
					<h1 class="heading-section">Writing</h1>
					<div class="accent-bar"></div>
				</div>

				<div class="space-content">
					{#each writings as writing}
						<article class="card-bordered">
							<h2 class="heading-card">{writing.title}</h2>

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
			</div>
		</section>
	</main>
</div> 