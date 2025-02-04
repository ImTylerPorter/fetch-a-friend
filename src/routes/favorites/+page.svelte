<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import type { Dog } from '$lib/types/dog';
	import { favorites } from '$lib/stores/favorites';
	import DogCard from '$lib/components/DogCard.svelte';

	/**
	 * Component props and state
	 * @prop {PageData} data - Server-loaded data including dogs and potential match
	 */
	let { data } = $props<{ data: PageData & { dogs?: Dog[]; matchedDog?: Dog | null } }>();
	let isLoading = $state(false);
	let matchedDog = $state(data.matchedDog);
	let currentDogs = $state<Dog[]>([]);

	// Initialize favorites store only on first load
	let initialized = $state(false);

	/**
	 * Effect to synchronize server-side favorites with client-side store
	 * Preserves existing favorites while adding any new ones from the server
	 */
	$effect(() => {
		if (!initialized && data.dogs?.length) {
			initialized = true;
			// Preserve any existing favorites
			const existingFavorites = new Set($favorites);
			const serverDogIds = new Set<string>(data.dogs.map((dog: Dog) => dog.id));
			const mergedFavorites = new Set([...existingFavorites, ...serverDogIds]);
			if (!areSetsEqual(mergedFavorites, $favorites)) {
				favorites.set(mergedFavorites);
			}
		}
	});

	/**
	 * Effect to update displayed dogs when favorites change
	 * Also handles removal of matched dog if unfavorited
	 */
	$effect(() => {
		if (data.dogs) {
			// Update current dogs based on favorites
			currentDogs = data.dogs.filter((dog: Dog) => $favorites.has(dog.id));

			// If the current match was unfavorited
			if (matchedDog && !$favorites.has(matchedDog.id)) {
				// Clear the current match immediately
				matchedDog = null;
				// Remove it from current dogs
				currentDogs = currentDogs.filter((dog) => dog.id !== matchedDog?.id);
				// Force a page reload to get a new match
				window.location.reload();
			}
		}
	});

	/**
	 * Computed store for grid display
	 * Excludes the current match from the grid of favorites
	 */
	let filteredDogs = $derived(currentDogs.filter((dog) => dog.id !== matchedDog?.id));

	/**
	 * Utility function to compare two sets for equality
	 */
	function areSetsEqual(a: Set<string>, b: Set<string>) {
		return a.size === b.size && [...a].every((value) => b.has(value));
	}
</script>

<!-- Favorites Page Component
 - Displays and manages the user's favorite dogs and potential matches
 - Features:
 	- Display of matched dog suggestion
	- Grid of favorited dogs
	- Synchronization with server-side favorites
	- Real-time favorite toggling -->

<svelte:head>
	<title>Your Favorites - Fetch A Friend</title>
	<meta
		name="description"
		content="View your favorite dogs and find your perfect match from your selected companions."
	/>
</svelte:head>

<main class="container mx-auto px-6 py-12 lg:px-8 lg:py-20">
	<!-- Page Header -->
	<div class="mb-12 text-center">
		<h1 class="font-lexend text-4xl font-bold tracking-tight text-white sm:text-5xl">
			Your Favorite Dogs
		</h1>
		<p class="mt-4 font-rubik text-xl font-light leading-8 text-fetch-gray-light/90">
			Find your perfect match from your favorite dogs
		</p>
	</div>

	{#if isLoading}
		<div class="mt-8 text-center font-rubik text-fetch-gray-light">Loading...</div>
	{:else if !currentDogs.length}
		<div class="mt-12 text-center font-rubik text-fetch-gray-light">
			You haven't favorited any dogs yet. Go back to the search page to find some dogs you like!
		</div>
	{:else}
		<!-- Match Section -->
		{#if matchedDog}
			<div class="mb-16">
				<div
					class="relative overflow-hidden rounded-xl border border-fetch-hot-pink/50 bg-fetch-hot-pink/5 p-8 backdrop-blur-sm"
				>
					<div class="relative z-10">
						<h2 class="mb-6 text-center font-lexend text-3xl font-bold text-white">
							<span
								class="bg-gradient-to-r from-fetch-hot-pink to-fetch-orange bg-clip-text text-transparent"
							>
								Your Perfect Match!
							</span>
						</h2>
						<div class="mx-auto max-w-sm">
							<DogCard dog={matchedDog} />
						</div>
					</div>
					<div
						class="absolute inset-0 -z-0 bg-gradient-to-br from-fetch-hot-pink/10 to-fetch-orange/10"
					></div>
				</div>
			</div>
		{/if}

		<!-- Favorited Dogs Grid -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredDogs as dog (dog.id)}
				<div transition:fade>
					<DogCard {dog} />
				</div>
			{/each}
		</div>
	{/if}
</main>
