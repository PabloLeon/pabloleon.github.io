<script lang="ts">
	import type { Lottery } from '$lib/types';

	interface Props {
		lottery: Lottery;
		size?: number;
	}

	let { lottery, size = 160 }: Props = $props();

	// Colors for each outcome
	const colors = {
		p20: '#3b82f6', // Blue for £20
		p10: '#22c55e', // Green for £10
		p0: '#9ca3af' // Gray for £0
	};

	// Calculate pie slices using SVG arc paths
	function getSlices(lottery: Lottery) {
		const { p20, p10, p0 } = lottery;
		const slices: { path: string; color: string; label: string; probability: number }[] = [];

		let currentAngle = -90; // Start from top

		const segments = [
			{ key: 'p20', probability: p20, color: colors.p20, label: '£20' },
			{ key: 'p10', probability: p10, color: colors.p10, label: '£10' },
			{ key: 'p0', probability: p0, color: colors.p0, label: '£0' }
		];

		const radius = 50;
		const cx = 50;
		const cy = 50;

		for (const segment of segments) {
			if (segment.probability <= 0) continue;

			const angle = segment.probability * 360;
			const startAngle = currentAngle;
			const endAngle = currentAngle + angle;

			// Convert angles to radians
			const startRad = (startAngle * Math.PI) / 180;
			const endRad = (endAngle * Math.PI) / 180;

			// Calculate arc points
			const x1 = cx + radius * Math.cos(startRad);
			const y1 = cy + radius * Math.sin(startRad);
			const x2 = cx + radius * Math.cos(endRad);
			const y2 = cy + radius * Math.sin(endRad);

			// Large arc flag
			const largeArc = angle > 180 ? 1 : 0;

			// Create SVG path
			const path =
				segment.probability >= 0.9999
					? `M ${cx} ${cy} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`
					: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

			slices.push({
				path,
				color: segment.color,
				label: segment.label,
				probability: segment.probability
			});

			currentAngle = endAngle;
		}

		return slices;
	}

	let slices = $derived(getSlices(lottery));
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 100 100"
	class="pie-chart"
	role="img"
	aria-label="Lottery probability distribution"
>
	{#each slices as slice}
		<path d={slice.path} fill={slice.color} stroke="white" stroke-width="1" class="pie-slice">
			<title>{slice.label}: {Math.round(slice.probability * 100)}%</title>
		</path>
	{/each}
</svg>

<style>
	.pie-chart {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
	}

	.pie-slice {
		transition: transform 0.2s ease-out;
		transform-origin: center;
	}

	.pie-slice:hover {
		transform: scale(1.02);
	}
</style>
