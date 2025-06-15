<script lang="ts">
	// Get build timestamp from environment variables set during build
	const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString();
	const buildDate = new Date(buildTimestamp);
	
	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<footer class="mt-16 bg-gray-50 border-t border-gray-200 pt-8 pb-6">
	<div class="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
		<p>Last updated: {formatDate(buildDate)}</p>
	</div>
</footer> 