<script lang="ts">
	import { Calendar, FileText, ExternalLink, Github } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ProjectData } from '$lib/types';

	let { projects }: { projects: ProjectData[] } = $props();
	
	// Calculate project stats for the sidebar
	const totalProjects = $derived(projects.length);
	const activeProjects = $derived(projects.filter(p => p.status === 'Active').length);
	const allTags = $derived([...new Set(projects.flatMap(p => p.tags || []))]);
	const latestProject = $derived(projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]);
</script>

<section id="projects" class="section-container-alt">
	<div class="content-wrapper">
		<div class="section-header">
			<h2 class="heading-section">Research Projects</h2>
			<div class="accent-bar"></div>
		</div>

		<div class="space-content">
			{#each projects as project}
				<article class="card">
					<div class="grid-about">
						<div class="lg:col-span-2 prose prose-slate max-w-none">
							<h3 class="heading-card !mb-3">{project.title}</h3>

							<div class="prose prose-slate !mb-4">
								<p class="text-body leading-relaxed">{project.description}</p>
							</div>

							<div class="flex flex-wrap gap-2 !mb-6">
								{#each project.tags || [] as tag}
									<span class="badge-tag">
										{tag}
									</span>
								{/each}
							</div>

							<div class="flex-actions !mt-6">
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
								{#if !project.descriptionOnly}
									<a href={`/projects/${project.slug}`}>
										<Button variant="ghost" size="sm">
											<FileText class="w-4 h-4" />
											Read More
										</Button>
									</a>
								{/if}
							</div>
						</div>

						<div class="space-sidebar hidden md:block">
							{#if project.thumbnail}
								<div class="project-thumbnail">
									<img src={`/assets/${project.thumbnail}`} alt="{project.title} thumbnail" class="w-full h-auto rounded-lg shadow-sm" />
								</div>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section> 