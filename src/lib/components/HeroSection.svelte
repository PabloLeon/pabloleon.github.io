<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import { personalInfo } from '$lib/config';

	let { scrollToSection }: { scrollToSection: (sectionId: string) => void } = $props();
</script>

<section id="home" class="section-container pt-6">
	<div class="grid-hero sm:mt-6">
		<!-- Portrait -->
		<div class="hidden lg:block order-2 lg:order-1">
			<div class="portrait-container">
				<div class="portrait-frame">
					<enhanced:img
						src="$lib/assets/portrait.png"
						alt={personalInfo.name}
						class="portrait-image"
						sizes="(max-width: 1024px) 0px, 400px"
						fetchpriority="high"
					/>
				</div>
				<div class="portrait-accent"></div>
			</div>
		</div>

		<!-- Bio -->
		<div class="order-1 lg:order-2 space-y-6">
			<div>
				<h1 class="heading-primary mb-6">
					I study how children, adults, and machines
					<br />
					<span class="font-normal">learn to represent the world</span>
				</h1>
				<div class="accent-bar-sm"></div>
			</div>

			<div class="space-text">
				<p>
					To explore this question, I run experimental studies and write computational models.
				</p>
				<div class="pt-4">
					<Button
						variant="link"
						onclick={() => scrollToSection('projects')}
						class="justify-start sm:justify-center"
					>
						View my current projects
						<ArrowRight class="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	</div>
</section> 