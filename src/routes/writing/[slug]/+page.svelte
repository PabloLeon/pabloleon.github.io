<script lang="ts">
	import { ArrowLeft, Calendar } from 'lucide-svelte';
	import { processMarkdown } from '../../../lib/markdown';
	import type { WritingData } from '$lib/types';
	
	let { data }: { data: { writing: WritingData } } = $props();
	let writing = $derived(data.writing);
</script>

<svelte:head>
	<title>{writing ? `${writing.title} - Pablo León-Villagrá` : 'Article Not Found'}</title>
</svelte:head>

{#if writing}
	<div class="page-container">
		<!-- Header -->
		<header class="card-header">
			<div class="content-wrapper-narrow py-12 sm:py-16">
				<h1 class="heading-section mb-4">{writing.title}</h1>
				
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
					<p class="text-body-lg mb-6">{writing.excerpt}</p>
				{/if}
			</div>
		</header>

		<!-- Content -->
		<main class="content-wrapper-narrow py-12 sm:py-16">
			<div class="prose-content">
				<div class="content-body">
					{@html writing.content 
						? processMarkdown(writing.content)
						: '<p>Article content coming soon...</p>'
					}
				</div>
			</div>
		</main>
	</div>
{:else}
	<div class="page-container">
		<main class="main-content">
			<div class="content-wrapper-narrow py-12 sm:py-16 text-center">
				<h1 class="heading-section mb-4">Article Not Found</h1>
				<p class="text-meta mb-8">The article you're looking for doesn't exist or has been moved.</p>
				<a href="/writing" class="link-primary inline-flex items-center gap-2">
					<ArrowLeft class="w-4 h-4" />
					Back to Writing
				</a>
			</div>
		</main>
	</div>
{/if} 