<script lang="ts">
	import type { Dog } from '$lib/types/dog';
	import { favorites } from '$lib/stores/favorites';

	/**
	 * Component props
	 * @prop {Dog} dog - The dog object containing all necessary information
	 */
	let { dog } = $props<{ dog: Dog }>();

	/**
	 * Fallback image to use when the dog's image fails to load
	 */
	const FALLBACK_IMAGE = '/fetch-logo.svg';

	/**
	 * Handles image loading errors by replacing the failed image with a fallback
	 * @param {Event} event - The error event from the img element
	 */
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		img.src = FALLBACK_IMAGE;
	}

	/**
	 * Toggles the favorite status of the current dog
	 * Updates both the UI and persisted storage
	 */
	function toggleFavorite() {
		favorites.toggle(dog.id);
	}
</script>

<!-- DogCard.svelte
	- A reusable card component for displaying individual dog information.
	- Features:
		- Responsive image display with fallback
		- Favorite toggling functionality
		- Basic dog details (name, breed, age)
		- Location information
		- Hover effects and animations -->

<div
	class="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-fetch-hot-pink/50 hover:bg-white/10"
>
	<!-- Image Container with Favorite Button -->
	<div class="aspect-square w-full overflow-hidden">
		<img
			src={dog.img || FALLBACK_IMAGE}
			alt={`${dog.name} - ${dog.breed}`}
			onerror={handleImageError}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
		/>
		<button
			class="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-fetch-hot-pink/80 {$favorites.has(
				dog.id
			)
				? 'text-fetch-hot-pink hover:text-white'
				: 'text-white/50 hover:text-white'}"
			onclick={toggleFavorite}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				{#if $favorites.has(dog.id)}
					<path
						fill-rule="evenodd"
						d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
						clip-rule="evenodd"
					/>
				{:else}
					<path
						d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"
					/>
				{/if}
			</svg>
		</button>
	</div>

	<!-- Dog Information -->
	<div class="p-6">
		<h3 class="font-lexend text-lg font-semibold text-white">{dog.name}</h3>
		<p class="mt-2 font-rubik text-sm text-fetch-gray-light">
			{dog.breed}
		</p>
		<div class="mt-2 flex flex-wrap gap-2">
			<span class="rounded-full bg-fetch-hot-pink/10 px-3 py-1 text-xs text-fetch-hot-pink">
				{dog.age}
				{dog.age === 1 ? 'year' : 'years'}
			</span>
			<span class="rounded-full bg-fetch-orange/10 px-3 py-1 text-xs text-fetch-orange">
				Location: {dog.zip_code}
			</span>
		</div>
	</div>

	<!-- Hover Effect Overlay -->
	<div
		class="absolute inset-0 -z-10 bg-gradient-to-br from-fetch-hot-pink/5 to-fetch-orange/5 opacity-0 transition-opacity group-hover:opacity-100"
	></div>
</div>
