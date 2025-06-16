<script lang="ts">
	import { Mail, ExternalLink } from 'lucide-svelte';
	import { personalInfo } from '$lib/config';

	function getSkillBadgeClass(category: string): string {
		const categoryColors = {
			'Methods & Concepts': 'px-2 py-1 bg-blue-50 text-blue-700 rounded',
			'Tools & Libraries': 'px-2 py-1 bg-green-50 text-green-700 rounded',
			'Programming Languages': 'px-2 py-1 bg-purple-50 text-purple-700 rounded',
			'Psychology Tools': 'px-2 py-1 bg-orange-50 text-orange-700 rounded'
		};
		
		return categoryColors[category as keyof typeof categoryColors] || 'px-2 py-1 bg-gray-50 text-gray-700 rounded';
	}
</script>

<section id="about" class="section-container">
	<div class="section-header">
		<h2 class="heading-section">About</h2>
		<div class="accent-bar"></div>
	</div>

	<div class="grid-about">
		<div class="lg:col-span-2 space-y-6 text-body">
			<p class="text-body-lg">
				I'm a {personalInfo.title} at {personalInfo.affiliation}, specializing in cognitive science and computational modeling.
			</p>

			<p>
				I am currently at <a href="https://vivo.brown.edu/display/dbuchsba" class="link-content">Daphna Buchsbaum</a>'s <a href="http://www.cocodevlab.com/" class="link-content">CoCoDevLab</a>, where we are working on new experimental methods to uncover children's developing categories.
			</p>

			<p>
				Before, I worked at the University of Warwick, trying to find the algorithm underlying human approximative inference with <a href="https://warwick.ac.uk/fac/sci/psych/people/asanborn/" class="link-content">Adam Sanborn</a>, <a href="https://www.wbs.ac.uk/about/person/nick-chater/" class="link-content">Nick Chater</a>, and the rest of the <a href="https://sampling.warwick.ac.uk/" class="link-content">SAMPLING</a> group.
			</p>

			<p>
				I did my Ph.D. with <a href="http://www.christopherglucas.com/" class="link-content">Chris Lucas</a> at the University of Edinburgh. In my <a href="/assets/thesis.pdf" class="link-content">thesis</a>, I explored the representational principles that allow humans to generalize functions. My research showed that when faced with continuous-valued relationships, people learn abstract features of the data, such as the type or the variability of the function. These abstract features can then be transferred to inform their generalizations in subsequent tasks. Finally, my thesis showed that humans are perceptive to, and sometimes generalize according to compositional features inherent in the data.
			</p>
		</div>

		<div class="space-sidebar">
			<div class="contact-grid">
				<div>
					<h3 class="heading-small mb-4">Contact</h3>
					<div class="contact-section">
						<div class="contact-item">
							<Mail class="w-4 h-4 flex-shrink-0" />
							<a href="mailto:{personalInfo.email}" class="contact-text link-contact">{personalInfo.email}</a>
						</div>
					</div>
				</div>

				<div>
					<h3 class="heading-small mb-4">Education</h3>
					<div class="education-list">
						<div class="education-item">
							<div class="education-degree">PhD Informatics</div>
							<div class="text-meta-small">University of Edinburgh</div>
						</div>
						<div class="education-item">
							<div class="education-degree">BSc, MSc Cognitive Science</div>
							<div class="text-meta-small">University of Osnabrück</div>
						</div>
					</div>
				</div>

				<div class="hidden md:block">
					<h3 class="heading-small mb-4">Skills</h3>
					<div class="flex flex-wrap gap-1 text-xs">
						{#each Object.entries(personalInfo.skills) as [category, skills]}
							{#each skills.sort() as skill}
								<span class={getSkillBadgeClass(category)}>{skill}</span>
							{/each}
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section> 