<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { SearchFilters } from '$lib/types/search';

	let {
		filters = $bindable(),
		breeds,
		onFilterChange
	} = $props<{
		filters: SearchFilters;
		breeds: string[];
		onFilterChange: (filters: SearchFilters) => void;
	}>();

	let isExpanded = $state(false);

	/**
	 * Predefined sorting options for the dog list
	 */
	let sortOptions = [
		{ value: 'breed:asc', label: 'Breed (A-Z)' },
		{ value: 'breed:desc', label: 'Breed (Z-A)' },
		{ value: 'age:asc', label: 'Age (Youngest)' },
		{ value: 'age:desc', label: 'Age (Oldest)' }
	];

	/**
	 * Notifies parent component of filter changes
	 */
	function handleFilterChange() {
		// Create a new object to ensure reactivity
		const updatedFilters = {
			breed: filters.breed || null,
			ageMin: filters.ageMin ? Number(filters.ageMin) : null,
			ageMax: filters.ageMax ? Number(filters.ageMax) : null,
			location: filters.location?.trim() || null,
			sort: filters.sort || 'breed:asc'
		};

		onFilterChange(updatedFilters);
	}

	/**
	 * Toggles the visibility of the filter panel
	 */
	function toggleFilters() {
		isExpanded = !isExpanded;
	}

	/**
	 * Clears a specific filter while maintaining others
	 * @param {keyof SearchFilters} filterName - The name of the filter to clear
	 */
	function clearFilter(filterName: keyof SearchFilters) {
		if (filterName === 'sort') {
			filters[filterName] = 'breed:asc';
		} else {
			filters[filterName] = null;
		}
		handleFilterChange();
	}

	/**
	 * Computed array of active filters for display
	 * Shows which filters are currently applied
	 */
	let activeFilters = $derived(
		(() => {
			const active: Array<{ key: keyof SearchFilters; label: string }> = [];
			if (filters.breed) active.push({ key: 'breed', label: `Breed: ${filters.breed}` });
			if (filters.ageMin) active.push({ key: 'ageMin', label: `Min Age: ${filters.ageMin}` });
			if (filters.ageMax) active.push({ key: 'ageMax', label: `Max Age: ${filters.ageMax}` });
			if (filters.location)
				active.push({ key: 'location', label: `Location: ${filters.location}` });
			if (filters.sort && filters.sort !== 'breed:asc') {
				const option = sortOptions.find((opt) => opt.value === filters.sort);
				if (option) active.push({ key: 'sort', label: `Sort: ${option.label}` });
			}
			return active;
		})()
	);
</script>

<!-- SearchFilters.svelte
	- A comprehensive filter interface for the dog search functionality.
  - Provides controls for searching by name, breed, age, location, and sorting options. -->
<div class="w-full max-w-3xl">
	<button
		class="mb-4 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-rubik text-white transition-colors hover:border-fetch-hot-pink/50 hover:bg-white/10"
		onclick={toggleFilters}
	>
		<span class="font-medium">
			{isExpanded ? 'Hide' : 'Show'} Filters
			{#if activeFilters.length > 0}
				<span class="ml-2 text-fetch-gray-light">({activeFilters.length} active)</span>
			{/if}
		</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 transition-transform {isExpanded ? 'rotate-180' : ''}"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	<!-- Active Filters Display -->
	{#if activeFilters.length > 0 && !isExpanded}
		<div class="mb-4 flex flex-wrap gap-2">
			{#each activeFilters as filter}
				<div
					class="group flex items-center gap-2 rounded-full bg-fetch-hot-pink/10 px-3 py-1 text-sm font-medium text-fetch-hot-pink"
				>
					<span>{filter.label}</span>
					<button
						aria-label="Clear filter"
						class="flex h-4 w-4 items-center justify-center rounded-full bg-fetch-hot-pink/20 text-fetch-hot-pink opacity-0 transition-opacity group-hover:opacity-100"
						onclick={() => clearFilter(filter.key)}
						title="Clear filter"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3 w-3"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	{#if isExpanded}
		<div class="space-y-6" transition:slide>
			<!-- Breed Selection -->
			<div>
				<label for="breed" class="mb-2 block font-rubik text-sm text-fetch-gray-light">Breed</label>
				<select
					id="breed"
					bind:value={filters.breed}
					onchange={handleFilterChange}
					class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-rubik text-white focus:border-fetch-hot-pink focus:bg-white/10 focus:ring focus:ring-fetch-hot-pink/20"
				>
					<option value="" selected>All Breeds ({breeds.length})</option>
					{#each breeds as breed}
						<option value={breed}>{breed}</option>
					{/each}
				</select>
			</div>

			<!-- Age Range -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="ageMin" class="mb-2 block font-rubik text-sm text-fetch-gray-light"
						>Min Age</label
					>
					<input
						type="number"
						id="ageMin"
						bind:value={filters.ageMin}
						onchange={handleFilterChange}
						min="0"
						max="20"
						placeholder="0"
						class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-rubik text-white placeholder:text-fetch-gray-light/50 focus:border-fetch-hot-pink focus:bg-white/10 focus:ring focus:ring-fetch-hot-pink/20"
					/>
				</div>
				<div>
					<label for="ageMax" class="mb-2 block font-rubik text-sm text-fetch-gray-light"
						>Max Age</label
					>
					<input
						type="number"
						id="ageMax"
						bind:value={filters.ageMax}
						onchange={handleFilterChange}
						min="0"
						max="20"
						placeholder="20"
						class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-rubik text-white placeholder:text-fetch-gray-light/50 focus:border-fetch-hot-pink focus:bg-white/10 focus:ring focus:ring-fetch-hot-pink/20"
					/>
				</div>
			</div>

			<!-- Location -->
			<div>
				<label for="location" class="mb-2 block font-rubik text-sm text-fetch-gray-light"
					>Location (ZIP, City, or State)</label
				>
				<input
					type="text"
					id="location"
					bind:value={filters.location}
					oninput={handleFilterChange}
					placeholder="Enter ZIP code, city, or state..."
					class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-rubik text-white placeholder:text-fetch-gray-light/50 focus:border-fetch-hot-pink focus:bg-white/10 focus:ring focus:ring-fetch-hot-pink/20"
				/>
			</div>

			<!-- Sort -->
			<div>
				<label for="sort" class="mb-2 block font-rubik text-sm text-fetch-gray-light">Sort By</label
				>
				<select
					id="sort"
					bind:value={filters.sort}
					onchange={handleFilterChange}
					class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-rubik text-white focus:border-fetch-hot-pink focus:bg-white/10 focus:ring focus:ring-fetch-hot-pink/20"
				>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>
	{/if}
</div>
