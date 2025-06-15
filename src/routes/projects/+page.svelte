<script lang="ts">
	import { Calendar, Github, ExternalLink, FileText } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ProjectData } from '$lib/types';

	let { data }: { data: { projects: ProjectData[] } } = $props();
	let projects = $derived(data.projects);
</script>

<svelte:head>
	<title>Research Projects - Pablo León-Villagrá</title>
</svelte:head>

<div class="page-container">
	<main class="main-content">
		<section class="section-container">
			<div class="content-wrapper">
				<div class="section-header">
					<h1 class="heading-section">Research Projects</h1>
					<div class="accent-bar"></div>
				</div>

				<div class="grid-cards">
					{#each projects as project}
						<article class="card-bordered">
							<h2 class="heading-card">{project.title}</h2>

							<p class="text-body mb-4">{project.description}</p>

							<div class="flex flex-wrap gap-2 mb-6">
								{#each project.tags || [] as tag}
									<span class="badge-tag">
										{tag}
									</span>
								{/each}
							</div>

							<div class="flex flex-wrap gap-3">
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
						</article>
					{/each}
				</div>
			</div>
		</section>
	</main>
</div> 