<script lang="ts">
	import { onMount } from 'svelte';
	import { Loader2 } from 'lucide-svelte';
	import type { Lottery, Choice, AgentLog, ExperimentSession } from '$lib/types';
	import { findAcceptedProposal } from '$lib/experiments/mcmc-utility/mcmc';
	import { ExperimentState } from '$lib/experiments/mcmc-utility/state.svelte';
	import {
		saveSession,
		logParticipantTrial,
		logAgentDecision
	} from '$lib/experiments/mcmc-utility/storage';
	import LotteryCard from './LotteryCard.svelte';

	interface Props {
		experimentState: ExperimentState;
		session: ExperimentSession;
		onSessionUpdate: (session: ExperimentSession) => void;
		onComplete: () => void;
		targetTrials?: number;
	}

	let {
		experimentState,
		session,
		onSessionUpdate,
		onComplete,
		targetTrials = 60
	}: Props = $props();

	// Local state
	let isLoading = $state(true);
	let currentProposal = $state<Lottery | null>(null);
	let trialStartTime = $state(0);
	let isProcessing = $state(false);
	let agentAttempts = $state(0);

	// Progress tracking
	let progress = $derived(
		Math.min(100, Math.round((experimentState.trialCount / targetTrials) * 100))
	);
	let trialsRemaining = $derived(Math.max(0, targetTrials - experimentState.trialCount));

	// Current chain info
	let currentChain = $derived(experimentState.currentChain);
	let currentLottery = $derived(currentChain?.current ?? null);

	/**
	 * Prepare the next trial by running the agent filter
	 */
	async function prepareNextTrial() {
		if (!currentChain) {
			isLoading = false;
			return;
		}

		isLoading = true;
		currentProposal = null;

		try {
			const result = await findAcceptedProposal(currentChain.id, currentChain.current, {
				onAgentDecision: (log: AgentLog) => {
					// Update session with agent log
					const updatedSession = logAgentDecision(session, log);
					onSessionUpdate(updatedSession);
				}
			});

			currentProposal = result.proposal;
			agentAttempts = result.attempts;
			trialStartTime = Date.now();
			isLoading = false;
		} catch (error) {
			console.error('Error in agent filter:', error);
			// Fallback: use the current state as proposal
			currentProposal = currentChain.current;
			isLoading = false;
		}
	}

	/**
	 * Handle user choice
	 */
	function handleChoice(choice: Choice) {
		if (isLoading || isProcessing || !currentLottery || !currentProposal || !currentChain) {
			return;
		}

		isProcessing = true;

		const responseTime = Date.now() - trialStartTime;
		const chosenLottery = choice === 'current' ? currentLottery : currentProposal;

		// Log the participant trial
		const updatedSession = logParticipantTrial(
			session,
			currentChain.id,
			currentLottery,
			currentProposal,
			choice,
			responseTime
		);

		// Update experiment state
		experimentState.next(chosenLottery);

		// Update session with new chain state
		const finalSession = {
			...updatedSession,
			chains: experimentState.chains,
			currentIndex: experimentState.currentIndex,
			trialCount: experimentState.trialCount
		};

		onSessionUpdate(finalSession);
		saveSession(finalSession);

		// Check if experiment is complete
		if (experimentState.trialCount >= targetTrials) {
			onComplete();
			return;
		}

		// Prepare next trial
		isProcessing = false;
		prepareNextTrial();
	}

	/**
	 * Handle keyboard input with debouncing
	 */
	let lastKeyTime = 0;
	const debounceMs = 200;

	function handleKeyDown(event: KeyboardEvent) {
		const now = Date.now();

		// Debounce check
		if (now - lastKeyTime < debounceMs) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			lastKeyTime = now;
			handleChoice('current');
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			lastKeyTime = now;
			handleChoice('proposal');
		}
	}

	// Set up keyboard listener and prepare first trial
	onMount(() => {
		prepareNextTrial();

		return () => {
			// Cleanup if needed
		};
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="trial-container">
	<!-- Progress bar -->
	<div class="progress-section">
		<div class="progress-bar-container">
			<div class="progress-bar" style="width: {progress}%"></div>
		</div>
		<div class="progress-text">
			Trial {experimentState.trialCount + 1} of {targetTrials}
			<span class="progress-remaining">({trialsRemaining} remaining)</span>
		</div>
	</div>

	<!-- Main content -->
	<div class="trial-content">
		{#if isLoading}
			<div class="loading-state">
				<Loader2 class="loading-spinner" />
				<p class="loading-text">Preparing next trial...</p>
				{#if agentAttempts > 0}
					<p class="loading-subtext">Sampling proposals ({agentAttempts} attempts)</p>
				{/if}
			</div>
		{:else if currentLottery && currentProposal}
			<div class="instruction-text">Which lottery do you prefer?</div>

			<div class="lottery-comparison">
				<LotteryCard lottery={currentLottery} label="Option A" keyHint="← Left" />

				<div class="vs-divider">
					<span class="vs-text">VS</span>
				</div>

				<LotteryCard lottery={currentProposal} label="Option B" keyHint="→ Right" />
			</div>

			<div class="action-hint">
				Press <kbd>←</kbd> or <kbd>→</kbd> to choose
			</div>
		{/if}
	</div>

	<!-- Chain indicator -->
	<div class="chain-indicator">
		<span class="chain-label">Chain:</span>
		<div class="chain-dots">
			{#each [0, 1, 2] as chainId (chainId)}
				<span class="chain-dot" class:active={experimentState.currentIndex === chainId}></span>
			{/each}
		</div>
	</div>
</div>

<style>
	.trial-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
	}

	.progress-section {
		max-width: 32rem;
		margin: 0 auto 2rem;
		width: 100%;
	}

	.progress-bar-container {
		height: 0.5rem;
		background: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #1d4ed8);
		border-radius: 9999px;
		transition: width 0.3s ease;
	}

	.progress-text {
		margin-top: 0.5rem;
		text-align: center;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.progress-remaining {
		color: #9ca3af;
	}

	.trial-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.loading-state :global(.loading-spinner) {
		width: 3rem;
		height: 3rem;
		color: #3b82f6;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		font-size: 1.125rem;
		font-weight: 500;
		color: #374151;
	}

	.loading-subtext {
		font-size: 0.875rem;
		color: #9ca3af;
	}

	.instruction-text {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		text-align: center;
	}

	.lottery-comparison {
		display: flex;
		align-items: center;
		gap: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.vs-divider {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.vs-text {
		font-size: 1.25rem;
		font-weight: 700;
		color: #9ca3af;
		padding: 0.5rem 1rem;
		background: white;
		border-radius: 9999px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.action-hint {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.action-hint kbd {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		font-family: 'Geist Mono', monospace;
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.chain-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding-top: 1.5rem;
	}

	.chain-label {
		font-size: 0.75rem;
		color: #9ca3af;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.chain-dots {
		display: flex;
		gap: 0.5rem;
	}

	.chain-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: #d1d5db;
		transition: all 0.2s ease;
	}

	.chain-dot.active {
		background: #3b82f6;
		transform: scale(1.25);
	}

	@media (max-width: 640px) {
		.lottery-comparison {
			flex-direction: column;
			gap: 1rem;
		}

		.vs-divider {
			transform: rotate(90deg);
		}

		.instruction-text {
			font-size: 1.25rem;
		}
	}
</style>
