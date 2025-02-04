<script lang="ts">
	/**
	 * Component props
	 * @prop {number} currentPage - The currently active page number
	 * @prop {number} totalPages - Total number of available pages
	 * @prop {number} total - Total number of items across all pages
	 * @prop {number} dogsPerPage - Number of items displayed per page
	 * @prop {(page: number) => void} onPageChange - Callback function when page changes
	 */
	let { currentPage, totalPages, total, dogsPerPage, onPageChange } = $props<{
		currentPage: number;
		totalPages: number;
		total: number;
		dogsPerPage: number;
		onPageChange: (page: number) => void;
	}>();

	/**
	 * Generates an array of page numbers to display
	 * Shows current page and adjacent pages with ellipsis for skipped ranges
	 */
	function generatePages() {
		const pageNumbers: (number | string)[] = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			// If we have fewer pages than our max, show all pages
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			// Always show first page
			pageNumbers.push(1);

			// Calculate range around current page
			let start = Math.max(2, currentPage - 1);
			let end = Math.min(totalPages - 1, currentPage + 1);

			// Adjust range if at edges
			if (currentPage <= 2) {
				end = 4;
			} else if (currentPage >= totalPages - 1) {
				start = totalPages - 3;
			}

			// Add ellipsis before range if needed
			if (start > 2) {
				pageNumbers.push('...');
			}

			// Add range
			for (let i = start; i <= end; i++) {
				pageNumbers.push(i);
			}

			// Add ellipsis after range if needed
			if (end < totalPages - 1) {
				pageNumbers.push('...');
			}

			// Always show last page
			pageNumbers.push(totalPages);
		}

		return pageNumbers;
	}

	/**
	 * Computed array of page numbers to display
	 */
	let pages = $derived(generatePages());

	/**
	 * Handles page change requests
	 * Validates the requested page number before calling the change handler
	 */
	function handlePageChange(page: number) {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	}
</script>

<!-- Pagination.svelte
	- A reusable pagination component that handles page navigation and display
  - Features include page numbers, previous/next buttons, and total count display -->

<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
	<!-- Page Info -->
	<div class="text-sm text-fetch-gray-light">
		Showing <span class="font-medium">{(currentPage - 1) * dogsPerPage + 1}</span> to
		<span class="font-medium">{Math.min(currentPage * dogsPerPage, total)}</span> of
		<span class="font-medium">{total}</span>
		results
	</div>

	<!-- Page Navigation -->
	<nav class="flex items-center gap-2">
		<!-- Previous Button -->
		<button
			aria-label="Previous Page"
			class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:border-fetch-hot-pink/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/10 disabled:hover:bg-white/5"
			disabled={currentPage === 1}
			onclick={() => handlePageChange(currentPage - 1)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		<!-- Page Numbers -->
		{#each pages as page}
			{#if typeof page === 'number'}
				<button
					aria-label={`Page ${page}`}
					class="flex h-8 min-w-[2rem] items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-white transition-colors hover:border-fetch-hot-pink/50 hover:bg-white/10 {page ===
					currentPage
						? 'border-fetch-hot-pink bg-fetch-hot-pink/10 text-fetch-hot-pink hover:bg-fetch-hot-pink/20'
						: ''}"
					onclick={() => handlePageChange(page)}
				>
					{page}
				</button>
			{:else}
				<span class="text-fetch-gray-light">...</span>
			{/if}
		{/each}

		<!-- Next Button -->
		<button
			aria-label="Next Page"
			class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:border-fetch-hot-pink/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/10 disabled:hover:bg-white/5"
			disabled={currentPage === totalPages}
			onclick={() => handlePageChange(currentPage + 1)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</nav>
</div>
