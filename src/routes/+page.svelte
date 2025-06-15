<script lang="ts">
	import { onMount } from 'svelte';

	import WritingSection from '$lib/components/WritingSection.svelte';
	import ProjectsSection from '$lib/components/ProjectsSection.svelte';
	import PublicationsSection from '$lib/components/PublicationsSection.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import type { ProjectData, WritingData, Publication } from '$lib/types';

	let { data }: { data: { projects: ProjectData[], writings: WritingData[], publications: Publication[] } } = $props();
	
	let activeSection = $state('home');
	let projects = $derived(data.projects);
	let writings = $derived(data.writings);
	let publications = $derived(data.publications);

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			const offsetTop = element.offsetTop - 80;
			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth'
			});
		}
	}

	onMount(() => {
		const handleScroll = () => {
			const sections = ['home', 'about', 'projects', 'writing', 'publications'];
			const scrollPosition = window.scrollY + 100;

			for (const section of sections) {
				const element = document.getElementById(section);
				if (element) {
					const offsetTop = element.offsetTop;
					const offsetBottom = offsetTop + element.offsetHeight;

					if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
						activeSection = section;
						break;
					}
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div class="page-container">
	<!-- Main Content -->
	<main class="main-content">
		<!-- Hero Section -->
		<HeroSection {scrollToSection} />

		<!-- About Section -->
		<AboutSection />

		<!-- Projects Section -->
		<ProjectsSection {projects} />

		<!-- Writing Section
		<WritingSection {writings} /> -->

		<!-- Publications Section -->
		<PublicationsSection {publications} />
	</main>
</div>
