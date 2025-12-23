<script lang="ts">
	interface Props {
		min: number;
		max: number;
		value?: number | undefined;
		step?: number;
		label: string;
		wrapped?: boolean;
		onChange: (value: number) => void;
		onInteraction?: () => void;
		disabled?: boolean;
	}

	let {
		min,
		max,
		value,
		step = (max - min) / 1000,
		label,
		wrapped = false,
		onChange,
		onInteraction,
		disabled = false
	}: Props = $props();

	// Use midpoint as placeholder for undefined, but track actual undefined state
	const placeholderValue = $derived((min + max) / 2);
	let displayValue = $state(value ?? placeholderValue);
	let hasValue = $state(value !== undefined);
	let sliderId = `slider-${Math.random().toString(36).substring(7)}`;

	// Initialize and update display value when prop changes
	$effect(() => {
		if (value === undefined) {
			displayValue = placeholderValue;
			hasValue = false;
		} else {
			displayValue = value;
			hasValue = true;
		}
	});

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = parseFloat(target.value);
		displayValue = newValue;
		hasValue = true;
		
		// Call onInteraction on first interaction
		if (onInteraction && value === undefined) {
			onInteraction();
		}
		
		onChange(newValue);
	}

	function formatValue(val: number | undefined): string {
		if (val === undefined || !hasValue) {
			return '--';
		}
		if (wrapped && (val < min || val > max)) {
			// For wrapped dimensions, show the wrapped value
			const range = max - min;
			const wrappedValue = ((val - min) % range) + min;
			if (wrappedValue < min) return `${(wrappedValue + range).toFixed(1)}`;
			return `${wrappedValue.toFixed(1)}`;
		}
		return val.toFixed(1);
	}
</script>

<div class="slider-container">
	<label for={sliderId} class="slider-label">{label}</label>
	<div class="slider-wrapper">
		<input
			id={sliderId}
			type="range"
			{min}
			{max}
			{step}
			value={displayValue}
			oninput={handleInput}
			{disabled}
			class="slider-input"
			class:has-value={hasValue}
			style="--progress: {hasValue ? ((displayValue - min) / (max - min) * 100) : 0}%"
		/>
		<div class="slider-value">{formatValue(hasValue ? displayValue : undefined)}</div>
	</div>
	<div class="slider-range">
		<span>{min}</span>
		<span>{max}</span>
	</div>
</div>

<style>
	.slider-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		max-width: 32rem;
	}

	.slider-label {
		font-size: 1rem;
		font-weight: 600;
		color: #374151;
	}

	.slider-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.slider-input {
		flex: 1;
		height: 0.5rem;
		border-radius: 9999px;
		background: #e5e7eb;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		position: relative;
	}

	/* Hide thumb and progress bar when value is undefined */
	.slider-input:not(.has-value)::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 0;
		height: 0;
		opacity: 0;
		pointer-events: none;
	}

	.slider-input:not(.has-value)::-moz-range-thumb {
		width: 0;
		height: 0;
		opacity: 0;
		pointer-events: none;
		border: none;
	}

	/* Show thumb and progress bar when value is defined */
	.slider-input.has-value::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		transition: all 0.2s ease;
		opacity: 1;
	}

	.slider-input.has-value::-webkit-slider-thumb:hover {
		background: #2563eb;
		transform: scale(1.1);
	}

	.slider-input.has-value::-webkit-slider-thumb:active {
		transform: scale(0.95);
	}

	.slider-input.has-value::-moz-range-thumb {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: none;
		transition: all 0.2s ease;
		opacity: 1;
	}

	.slider-input.has-value::-moz-range-thumb:hover {
		background: #2563eb;
		transform: scale(1.1);
	}

	/* Hide progress bar (filled portion) when value is undefined */
	.slider-input:not(.has-value) {
		background: #e5e7eb;
	}

	.slider-input.has-value {
		background: linear-gradient(to right, #3b82f6 0%, #3b82f6 var(--progress, 0%), #e5e7eb var(--progress, 0%), #e5e7eb 100%);
	}

	.slider-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.slider-input:disabled::-webkit-slider-thumb {
		cursor: not-allowed;
	}

	.slider-input:disabled::-moz-range-thumb {
		cursor: not-allowed;
	}

	.slider-value {
		min-width: 5rem;
		text-align: right;
		font-family: 'Geist Mono', monospace;
		font-size: 0.875rem;
		font-weight: 600;
		color: #3b82f6;
		padding: 0.25rem 0.5rem;
		background: #eff6ff;
		border-radius: 0.375rem;
	}

	.slider-range {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #9ca3af;
		padding: 0 0.5rem;
	}
</style>
