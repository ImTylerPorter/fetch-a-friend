<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Hero from '$lib/components/Hero.svelte';
	import SearchFilters from '$lib/components/SearchFilters.svelte';
	import DogCard from '$lib/components/DogCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { SearchFilters as SearchFiltersType } from '$lib/types/search';

	let { data } = $props<{ data: PageData }>();
	let isLoading = $state(false);

	// Constants
	const DOGS_PER_PAGE = 24;

	// Initialize filters from URL params or defaults
	let filters = $state<SearchFiltersType>({
		searchTerm: browser
			? new URLSearchParams(window.location.search).get('searchTerm') || null
			: null,
		breed: browser ? new URLSearchParams(window.location.search).get('breed') || null : null,
		ageMin: browser
			? Number(new URLSearchParams(window.location.search).get('ageMin')) || null
			: null,
		ageMax: browser
			? Number(new URLSearchParams(window.location.search).get('ageMax')) || null
			: null,
		location: browser ? new URLSearchParams(window.location.search).get('location') || null : null,
		sort: browser
			? new URLSearchParams(window.location.search).get('sort') || 'breed:asc'
			: 'breed:asc'
	});

	/**
	 * Handles filter changes from the SearchFilters component
	 * Updates URL parameters and triggers a new server load
	 */
	function handleFilterChange(newFilters: SearchFiltersType) {
		isLoading = true;
		const params = new URLSearchParams();

		// Add all non-null filters to URL params
		if (newFilters.searchTerm) {
			const trimmedSearch = newFilters.searchTerm.trim();
			if (trimmedSearch) params.set('searchTerm', trimmedSearch);
		}
		if (newFilters.breed) params.set('breed', newFilters.breed);
		if (newFilters.ageMin) params.set('ageMin', newFilters.ageMin.toString());
		if (newFilters.ageMax) params.set('ageMax', newFilters.ageMax.toString());
		if (newFilters.location) params.set('location', newFilters.location);
		if (newFilters.sort) params.set('sort', newFilters.sort);

		// Reset to first page when filters change
		params.set('page', '1');

		// Update filters state
		filters = newFilters;

		// Navigate to update the URL and trigger a new server load
		goto(`/?${params.toString()}`);
	}

	/**
	 * Handles page changes from the Pagination component
	 */
	function handlePageChange(page: number) {
		isLoading = true;
		const params = new URLSearchParams(window.location.search);
		params.set('page', page.toString());
		goto(`/?${params.toString()}`);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Reset loading state when data changes
	$effect(() => {
		if (data) {
			isLoading = false;
		}
	});
</script>

<!-- Main page component for Fetch A Friend
 - Handles the display and filtering of available dogs for adoption -->
<svelte:head>
	<title>Browse Dogs - Fetch A Friend</title>
	<meta
		name="description"
		content="Browse and search through available dogs for adoption. Find your perfect furry companion based on breed, age, location, and more."
	/>
</svelte:head>

<main class="container mx-auto px-6 py-8 lg:px-8 lg:py-12">
	<Hero />

	<!-- Search Filters -->
	<div class="mb-12 mt-8 flex justify-center">
		<SearchFilters {filters} breeds={data.breeds || []} onFilterChange={handleFilterChange} />
	</div>

	<!-- Results Section -->
	<div class="mb-12">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="font-lexend text-2xl font-bold text-white">
				Available Dogs
				{#if data.total > 0}
					<span class="ml-2 text-fetch-gray-light">({data.total} total)</span>
				{/if}
			</h2>
		</div>

		{#if isLoading}
			<div class="text-center font-rubik text-fetch-gray-light">Loading...</div>
		{:else if data.dogs.length === 0}
			<div class="text-center font-rubik text-fetch-gray-light">
				No dogs found matching your criteria. Try adjusting your filters.
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each data.dogs as dog (dog.id)}
					<div transition:fade>
						<DogCard {dog} />
					</div>
				{/each}
			</div>

			{#if data.totalPages > 1}
				<div class="mt-12">
					<Pagination
						currentPage={data.currentPage}
						totalPages={data.totalPages}
						total={data.total}
						dogsPerPage={DOGS_PER_PAGE}
						onPageChange={handlePageChange}
					/>
				</div>
			{/if}
		{/if}
	</div>
</main>
