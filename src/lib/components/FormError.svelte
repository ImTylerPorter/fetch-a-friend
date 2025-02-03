<script lang="ts">
	let props = $props<{
		message: string;
		variant?: 'error' | 'warning' | 'info';
	}>();

	const variants = {
		error: 'border-fetch-pink/20 bg-fetch-pink/10 text-fetch-pink',
		warning: 'border-fetch-orange/20 bg-fetch-orange/10 text-fetch-orange',
		info: 'border-fetch-blue-purple/20 bg-fetch-blue-purple/10 text-fetch-blue-purple'
	} as const;

	let variantClasses = $derived(variants[(props.variant ?? 'error') as keyof typeof variants]);
</script>

{#if props.message}
	<div class="rounded-lg border p-4 text-sm {variantClasses}">
		{props.message}
	</div>
{/if}
