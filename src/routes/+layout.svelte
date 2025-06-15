<script lang="ts">
	import { PUBLIC_GA_MEASUREMENT_ID } from '$env/static/public';
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Pablo León-Villagrá - Cognitive Scientist</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<GoogleAnalytics id={PUBLIC_GA_MEASUREMENT_ID} />

	<Navigation />

	<main>
		{@render children()}
	</main>

	<Footer />
</div>
