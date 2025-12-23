<script lang="ts">
	import { CheckCircle, Download, RotateCcw, BarChart3, ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import type { ExperimentConfig, GSPSession } from '$lib/types';
	import {
		downloadGSPSessionData,
		getGSPSessionStats,
		clearCurrentGSPSession
	} from '$lib/experiments/gsp/storage';

	interface Props {
		session: GSPSession;
		config: ExperimentConfig;
		onRestart: () => void;
	}

	let { session, config, onRestart }: Props = $props();

	function handleReturnToExperiments() {
		goto('/experiments');
	}

	// Calculate stats
	let stats = $derived(getGSPSessionStats(session));

	function handleDownload() {
		downloadGSPSessionData(config.slug, session);
	}

	function handleNewSession() {
		clearCurrentGSPSession(config.slug);
		onRestart();
	}

	function formatDuration(minutes: number): string {
		if (minutes < 1) {
			return 'less than a minute';
		}
		const mins = Math.round(minutes);
		return mins === 1 ? '1 minute' : `${mins} minutes`;
	}
</script>

<div class="page-container bg-gray-50">
	<div class="section-container py-8 sm:py-12">
		<div class="content-wrapper-narrow">
			<div class="flex flex-col items-center text-center">
				<!-- Success Icon -->
				<div class="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-full text-white mb-6 shadow-lg">
					<CheckCircle class="h-16 w-16" />
				</div>

				<h1 class="heading-section mb-3">Experiment Complete!</h1>

				<p class="text-body-lg mb-8 max-w-2xl">
					Thank you for participating in this experiment. Your responses help us understand how people
					perceive and represent concepts.
				</p>

				<!-- Statistics Card -->
				<div class="card w-full mb-8">
					<div class="flex items-center justify-center gap-2 font-semibold text-gray-700 mb-5 pb-4 border-b border-gray-100">
						<BarChart3 class="h-5 w-5" />
						<span>Session Statistics</span>
					</div>

					<div class="grid grid-cols-2 gap-4 mb-5">
						<div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
							<span class="text-2xl font-bold text-gray-900">{stats.completedIterations}</span>
							<span class="text-xs text-gray-600 mt-1">Iterations Completed</span>
						</div>

						<div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
							<span class="text-2xl font-bold text-gray-900">{stats.totalSamples}</span>
							<span class="text-xs text-gray-600 mt-1">Total Samples</span>
						</div>

						<div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
							<span class="text-2xl font-bold text-gray-900">{formatDuration(stats.durationMinutes)}</span>
							<span class="text-xs text-gray-600 mt-1">Total Duration</span>
						</div>

						<div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
							<span class="text-2xl font-bold text-gray-900">{stats.averageSamplesPerIteration.toFixed(1)}</span>
							<span class="text-xs text-gray-600 mt-1">Avg. Samples/Iteration</span>
						</div>
					</div>

					<div class="text-xs text-gray-400 pt-4 border-t border-gray-100">
						Session ID: <code class="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{session.sessionId}</code>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex flex-col gap-4 items-center mb-6 w-full max-w-md">
					<Button variant="primary" size="lg" onclick={handleDownload} class="w-full">
						<Download class="h-5 w-5" />
						Download Your Data
					</Button>

					<Button variant="outline" size="md" onclick={handleReturnToExperiments} class="w-full">
						<ArrowLeft class="h-4 w-4" />
						Return to Experiments
					</Button>

					<Button variant="outline" size="md" onclick={handleNewSession} class="w-full">
						<RotateCcw class="h-4 w-4" />
						Start New Session
					</Button>
				</div>

				<!-- Data info -->
				<p class="text-meta-small max-w-md">
					Your data is stored locally in your browser. Download it to keep a permanent copy or to share
					it with researchers.
				</p>
			</div>
		</div>
	</div>
</div>

