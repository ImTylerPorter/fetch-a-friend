<script lang="ts">
	/**
	 * Component props
	 * @prop {string} message - The message to display
	 * @prop {'error' | 'warning' | 'info'} [variant='error'] - The visual style variant
	 */
	let props = $props<{
		message: string;
		variant?: 'error' | 'warning' | 'info';
	}>();

	/**
	 * Mapping of variants to their respective CSS classes
	 * Each variant has its own color scheme for border, background, and text
	 */
	const variants = {
		error: 'border-fetch-pink/20 bg-fetch-pink/10 text-fetch-pink',
		warning: 'border-fetch-orange/20 bg-fetch-orange/10 text-fetch-orange',
		info: 'border-fetch-blue-purple/20 bg-fetch-blue-purple/10 text-fetch-blue-purple'
	} as const;

	/**
	 * Computed classes based on the current variant
	 * Defaults to 'error' if no variant is specified
	 */
	let variantClasses = $derived(variants[(props.variant ?? 'error') as keyof typeof variants]);
</script>

<!-- FormError.svelte
 - A reusable alert component for displaying form errors, warnings, or info
messages
 - Supports multiple visual variants through color schemes -->

{#if props.message}
	<div class="rounded-lg border p-4 text-sm {variantClasses}">
		{props.message}
	</div>
{/if}
