<script lang="ts">
	import { CheckCircle, Download, RotateCcw, BarChart3, ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import type { ExperimentSession } from '$lib/types';
	import {
		downloadSessionData,
		getSessionStats,
		clearCurrentSession
	} from '$lib/experiments/mcmc-utility/storage';

	interface Props {
		session: ExperimentSession;
		onRestart: () => void;
	}

	let { session, onRestart }: Props = $props();

	function handleReturnToExperiments() {
		goto('/experiments');
	}

	// Calculate stats
	let stats = $derived(getSessionStats(session));

	function handleDownload() {
		downloadSessionData(session);
	}

	function handleNewSession() {
		clearCurrentSession();
		onRestart();
	}

	function formatDuration(minutes: number): string {
		if (minutes < 1) {
			return 'less than a minute';
		}
		const mins = Math.round(minutes);
		return mins === 1 ? '1 minute' : `${mins} minutes`;
	}

	function formatMs(ms: number): string {
		if (ms < 1000) {
			return `${Math.round(ms)}ms`;
		}
		return `${(ms / 1000).toFixed(1)}s`;
	}
</script>

<div class="debrief-container">
	<div class="debrief-content">
		<!-- Success Icon -->
		<div class="success-icon">
			<CheckCircle class="h-16 w-16" />
		</div>

		<h1 class="debrief-title">Experiment Complete!</h1>

		<p class="debrief-message">
			Thank you for participating in this experiment. Your responses help us understand how people
			make decisions under uncertainty.
		</p>

		<!-- Statistics Card -->
		<div class="stats-card">
			<div class="stats-header">
				<BarChart3 class="h-5 w-5" />
				<span>Session Statistics</span>
			</div>

			<div class="stats-grid">
				<div class="stat-item">
					<span class="stat-value">{stats.totalTrials}</span>
					<span class="stat-label">Trials Completed</span>
				</div>

				<div class="stat-item">
					<span class="stat-value">{formatDuration(stats.durationMinutes)}</span>
					<span class="stat-label">Total Duration</span>
				</div>

				<div class="stat-item">
					<span class="stat-value">{formatMs(stats.averageResponseTimeMs)}</span>
					<span class="stat-label">Avg. Response Time</span>
				</div>

				<div class="stat-item">
					<span class="stat-value">{(stats.agentAcceptanceRate * 100).toFixed(1)}%</span>
					<span class="stat-label">Agent Accept Rate</span>
				</div>
			</div>

			<div class="session-id">
				Session ID: <code>{session.sessionId}</code>
			</div>
		</div>

		<!-- Actions -->
		<div class="debrief-actions">
			<Button variant="primary" size="lg" onclick={handleDownload}>
				<Download class="h-5 w-5" />
				Download Your Data
			</Button>

			<Button variant="outline" size="md" onclick={handleReturnToExperiments}>
				<ArrowLeft class="h-4 w-4" />
				Return to Experiments
			</Button>

			<Button variant="outline" size="md" onclick={handleNewSession}>
				<RotateCcw class="h-4 w-4" />
				Start New Session
			</Button>
		</div>

		<!-- Data info -->
		<p class="data-info">
			Your data is stored locally in your browser. Download it to keep a permanent copy or to share
			it with researchers.
		</p>
	</div>
</div>

<style>
	.debrief-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
	}

	.debrief-content {
		max-width: 32rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.success-icon {
		width: 5rem;
		height: 5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
		border-radius: 50%;
		color: white;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
	}

	.debrief-title {
		font-size: 2rem;
		font-weight: 700;
		color: #111827;
		margin-bottom: 0.75rem;
	}

	.debrief-message {
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.stats-card {
		width: 100%;
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.stats-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 1.25rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem;
		background: #f9fafb;
		border-radius: 0.5rem;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #111827;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.session-id {
		font-size: 0.75rem;
		color: #9ca3af;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.session-id code {
		font-family: 'Geist Mono', monospace;
		background: #f3f4f6;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
	}

	.debrief-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.data-info {
		font-size: 0.75rem;
		color: #9ca3af;
		max-width: 24rem;
	}
</style>
