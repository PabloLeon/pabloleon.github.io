<script lang="ts">
	let { content }: { content: string } = $props();

	// Simple markdown to HTML converter for basic formatting
	function markdownToHtml(markdown: string): string {
		return markdown
			// Headers
					.replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-primary-600 mb-3 mt-6">$1</h3>')
		.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-primary-600 mb-4 mt-8">$1</h2>')
		.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-primary-600 mb-6 mt-8 first:mt-0">$1</h1>')
			// Bold and italic
			.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
			.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
			// Links
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-800 underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>')
			// Code blocks
			.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm font-mono">$1</code></pre>')
			// Inline code
			.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
			// Lists
			.replace(/^\* (.+)$/gim, '<li class="mb-1">$1</li>')
			.replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside text-gray-700 mb-4 space-y-1">$1</ul>')
			// Blockquotes
			.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-blue-200 pl-4 italic text-gray-600 mb-4">$1</blockquote>')
			// Paragraphs
			.replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
			.replace(/^/, '<p class="text-gray-700 leading-relaxed mb-4">')
			.replace(/$/, '</p>');
	}

	let htmlContent = $derived(markdownToHtml(content));
</script>

<div class="prose prose-lg max-w-none">
	{@html htmlContent}
</div> 