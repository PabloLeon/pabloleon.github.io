<script lang="ts">
	import { ArrowLeft, Calendar, Github, ExternalLink } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import { processMarkdown } from '../../../lib/markdown';
	import type { ProjectData } from '$lib/types';

	let { data }: { data: { project: ProjectData } } = $props();
	let project = $derived(data.project);
</script>

<svelte:head>
	<title>{project ? `${project.title} - Pablo León-Villagrá` : 'Project Not Found'}</title>
</svelte:head>

	<div class="page-container">
		<!-- Header -->
		<header class="card-header">
			<div class="content-wrapper py-12 sm:py-16">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
					<!-- Header content - aligns with main content -->
					<div class="lg:col-span-2">
						<h1 class="heading-section mb-4">{project.title}</h1>
						
						<p class="text-body-lg mb-6">{project.description}</p>

						<div class="flex flex-wrap gap-2 mb-6">
							{#each project.tags || [] as tag}
								<span class="badge-tag">
									{tag}
								</span>
							{/each}
						</div>

						<div class="flex-actions">
							{#if project.link}
								<a href={project.link} target="_blank" rel="noopener noreferrer">
									<Button variant="outline" size="sm">
										<Github class="w-4 h-4" />
										View Code
									</Button>
								</a>
							{/if}
							{#if project.demo}
								<a href={project.demo} target="_blank" rel="noopener noreferrer">
									<Button variant="secondary" size="sm">
										<ExternalLink class="w-4 h-4" />
										Live Demo
									</Button>
								</a>
							{/if}
						</div>
					</div>
					
					<!-- Thumbnail in header - visible on desktop -->
					{#if project.thumbnail}
						<div class="hidden lg:block">
							<div class="project-thumbnail-container">
								<enhanced:img
									src={project.thumbnail}
									alt={`${project.title} thumbnail`}
									class="project-thumbnail"
									sizes="(max-width: 1024px) 0px, 400px"
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</header>

		<!-- Content -->
		<main class="content-wrapper py-12 sm:py-16">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
				<!-- Main content -->
				<div class="lg:col-span-2">
					<div class="prose-content">
						<div class="content-body">
							{@html project.content 
								? processMarkdown(project.content)
								: '<p>Project content coming soon...</p>'
							}
						</div>
					</div>
				</div>
				
				<!-- Empty sidebar space to maintain grid alignment -->
				<div class="hidden lg:block">
					<!-- This maintains the grid structure but remains empty -->
				</div>
			</div>
		</main>
	</div> 