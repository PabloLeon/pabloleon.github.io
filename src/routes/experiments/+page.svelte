<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ExperimentConfig } from '$lib/types';

	let { data }: { data: { experiments: ExperimentConfig[] } } = $props();

	const experiments = $derived(data.experiments);

	function getStatusBadge(status: ExperimentConfig['status']) {
		switch (status) {
			case 'active':
				return { text: 'Active', class: 'badge-active' };
			case 'coming-soon':
				return { text: 'Coming Soon', class: 'badge-coming-soon' };
			case 'completed':
				return { text: 'Completed', class: 'badge-completed' };
		}
	}
</script>

<svelte:head>
	<title>Experiments - Pablo León-Villagrá</title>
</svelte:head>

<div class="page-container">
	<main class="main-content">
		<section class="section-container pt-8">
			<div class="content-wrapper">
				<div class="section-header">
					<h1 class="heading-section">Experiments</h1>
					<p class="section-description">
						These are some of the online experiments I have been working on! Feel free to try them -
						no data is collected.
					</p>
					<div class="accent-bar"></div>
				</div>

				<div class="experiments-grid">
					{#each experiments as experiment}
						{@const badge = getStatusBadge(experiment.status)}
						<article class="experiment-card">
							<div class="card-header">
								<span class="status-badge {badge.class}">{badge.text}</span>
							</div>

							<h2 class="experiment-title">{experiment.title}</h2>

							<p class="experiment-description">{experiment.description}</p>

							<div class="experiment-tags">
								{#each experiment.tags as tag}
									<span class="badge-tag">{tag}</span>
								{/each}
							</div>

							<div class="card-footer">
								{#if experiment.status === 'active'}
									<a href={`/experiments/${experiment.slug}`}>
										<Button variant="primary" size="md">
											Start Experiment
											<ArrowRight class="h-4 w-4" />
										</Button>
									</a>
								{:else if experiment.status === 'coming-soon'}
									<Button variant="secondary" size="md" disabled>Coming Soon</Button>
								{:else}
									<a href={`/experiments/${experiment.slug}`}>
										<Button variant="outline" size="md">
											View Results
											<ArrowRight class="h-4 w-4" />
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

<style>
	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		border-radius: 1rem;
		color: white;
		margin-bottom: 1rem;
	}

	.section-description {
		max-width: 36rem;
		margin: 0 auto 1.5rem;
		color: #6b7280;
		line-height: 1.6;
	}

	.experiments-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: 1.5rem;
	}

	.experiment-card {
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		border: 1px solid #e5e7eb;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.1),
			0 1px 2px rgba(0, 0, 0, 0.06);
		display: flex;
		flex-direction: column;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.experiment-card:hover {
		transform: translateY(-2px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1);
	}

	.card-header {
		margin-bottom: 0.75rem;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 9999px;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.badge-active {
		background: #dcfce7;
		color: #166534;
	}

	.badge-coming-soon {
		background: #fef3c7;
		color: #92400e;
	}

	.badge-completed {
		background: #e0e7ff;
		color: #3730a3;
	}

	.experiment-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.experiment-description {
		color: #4b5563;
		line-height: 1.6;
		flex-grow: 1;
		margin-bottom: 1rem;
	}

	.experiment-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.badge-tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #6b7280;
		background: #f3f4f6;
		border-radius: 9999px;
	}

	.card-footer {
		margin-top: auto;
	}
</style>
