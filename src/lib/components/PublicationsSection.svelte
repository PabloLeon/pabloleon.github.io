<script lang="ts">
	import { Calendar, FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Publication } from '$lib/types';

	let { publications }: { publications: Publication[] } = $props();
	
	const sortedPublications = $derived(publications.sort((a, b) => b.year - a.year));
	
	// Track expanded state for each publication abstract
	let expandedAbstracts = $state(new Set<number>());
	
	function toggleAbstract(index: number) {
		if (expandedAbstracts.has(index)) {
			expandedAbstracts.delete(index);
		} else {
			expandedAbstracts.add(index);
		}
		// Trigger reactivity
		expandedAbstracts = new Set(expandedAbstracts);
	}
</script>

<section id="publications" class="section-container-alt">
	<div class="content-wrapper">
		<div class="section-header">
			<h2 class="heading-section">Publications</h2>
			<div class="accent-bar"></div>
		</div>

		<div class="space-content">
			{#each sortedPublications as pub, index}
				<article class="publication-article">
					<div class="grid-about">
						<div class="lg:col-span-2 prose prose-slate max-w-none">
							<h3 class="publication-title !mb-2">{pub.title}</h3>

							<p class="publication-authors !mt-0 !mb-2">{pub.authors.join(', ')}</p>

							<p class="publication-venue !mt-0 !mb-4">
								{#if pub.type === 'Ph.D. Thesis'}
									<em>Ph.D. Thesis, {pub.school}</em>
								{:else}
									<em>{pub.venue}</em>
									{#if pub.type === 'Book Chapter' && pub.publisher}
										· {pub.publisher}
									{/if}
								{/if}
								<span class="badge-status-default ml-2">{pub.type}</span>
								({pub.year})
							</p>

							{#if pub.abstract}
								<div class="publication-abstract-container !mt-4 !mb-6">
									<div class="prose prose-sm prose-slate">
										<div class="publication-abstract-wrapper {expandedAbstracts.has(index) ? 'expanded' : 'collapsed'}">
											<p class="publication-abstract leading-relaxed">{pub.abstract}</p>
										</div>
										<button
											class="abstract-toggle-button"
											onclick={() => toggleAbstract(index)}
											type="button"
										>
											{expandedAbstracts.has(index) ? 'Show less' : 'Show more'}
											{#if expandedAbstracts.has(index)}
												<ChevronUp class="w-3 h-3 ml-1" />
											{:else}
												<ChevronDown class="w-3 h-3 ml-1" />
											{/if}
										</button>
									</div>
								</div>
							{/if}

							<div class="flex-actions !mt-6">
								{#if pub.pdf}
									<a href={pub.pdf} target="_blank" rel="noopener noreferrer">
										<Button variant="primary" size="sm">
											<FileText class="w-4 h-4" />
											PDF
										</Button>
									</a>
								{/if}
								{#if pub.url}
									<a href={pub.url} target="_blank" rel="noopener noreferrer">
										<Button variant="secondary" size="sm">
											<ExternalLink class="w-4 h-4" />
											View Online
										</Button>
									</a>
								{/if}
							</div>
						</div>

						<div class="space-sidebar">
							{#if pub.thumbnail}
								<div class="publication-thumbnail">
									<img src={pub.thumbnail} alt="{pub.title} thumbnail" class="w-full h-auto rounded-lg shadow-sm" />
								</div>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.publication-abstract-wrapper {
		position: relative;
		transition: all 0.3s ease;
	}
	
	.publication-abstract-wrapper.collapsed {
		max-height: 4.5rem; /* Approximately 3-4 lines */
		overflow: hidden;
		mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
	}
	
	.publication-abstract-wrapper.expanded {
		max-height: none;
		mask-image: none;
		-webkit-mask-image: none;
	}
	
	.abstract-toggle-button {
		display: inline-flex;
		align-items: center;
		margin-top: 0.5rem;
		padding: 0.25rem 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		transition: color 0.2s ease;
		font-weight: 500;
		float: right;
		clear: both;
	}
	
	.abstract-toggle-button:hover {
		color: var(--color-primary);
	}
	
	.abstract-toggle-button:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
		border-radius: 0.25rem;
	}
</style> 