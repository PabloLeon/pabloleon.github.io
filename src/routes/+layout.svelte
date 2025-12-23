<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_GA_MEASUREMENT_ID } from '$env/static/public';
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Hide navigation and footer when in an active experiment (not on index page)
	// Show navigation on /experiments, hide on /experiments/[slug]
	// Use browser check to avoid SSR issues with page store
	let isExperimentPage = $state(false);
	
	$effect(() => {
		if (browser) {
			isExperimentPage = $page.url.pathname !== '/experiments' && $page.url.pathname.startsWith('/experiments/');
		}
	});
</script>

<svelte:head>
	<title>Pablo León-Villagrá - Cognitive Scientist</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<GoogleAnalytics id={PUBLIC_GA_MEASUREMENT_ID} />

	{#if !isExperimentPage}
		<Navigation />
	{/if}

	<main>
		{@render children()}
	</main>

	{#if !isExperimentPage}
		<Footer />
	{/if}
</div>
