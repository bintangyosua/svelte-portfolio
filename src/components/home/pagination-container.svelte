<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type T = $$Generic;

	export let items: T[] = [];
	export let itemsPerPage: number = 12;
	export let showCounter: boolean = true;
	export let showPageNumbers: boolean = true;
	export let maxPageNumbers: number = 2; // How many page numbers to show
	export let containerClass: string = '';
	export let wrapperClass: string = ''; // For items wrapper
	export let paginationClass: string = 'flex items-center justify-center space-x-2 mt-8';
	export let pageButtonClass: string =
		'bg-gray font-bold text-black hover:bg-gray-50 hover:cursor-pointer';
	export let activePageClass: string =
		'bg-red font-bold text-black hover:brightness-120 hover:cursor-pointer';
	export let navButtonClass: string =
		'bg-gray text-black font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer';

	const dispatch = createEventDispatcher<{
		pageChange: { currentPage: number; totalPages: number; displayedItems: T[] };
	}>();

	// Pagination state
	let currentPage = 1;

	// Reactive calculations
	$: totalPages = Math.ceil(items.length / itemsPerPage);
	$: startIndex = (currentPage - 1) * itemsPerPage;
	$: endIndex = startIndex + itemsPerPage;
	$: displayedItems = items.slice(startIndex, endIndex);

	// Page numbers to display
	$: pageNumbers = getPageNumbers(currentPage, totalPages, maxPageNumbers);

	// Functions
	function getPageNumbers(current: number, total: number, max: number): number[] {
		if (total <= max) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		const half = Math.floor(max / 2);
		let start = Math.max(1, current - half);
		let end = Math.min(total, start + max - 1);

		if (end - start + 1 < max) {
			start = Math.max(1, end - max + 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			currentPage = page;
			dispatch('pageChange', {
				currentPage,
				totalPages,
				displayedItems
			});
		}
	}

	function nextPage() {
		goToPage(currentPage + 1);
	}

	function prevPage() {
		goToPage(currentPage - 1);
	}

	function firstPage() {
		goToPage(1);
	}

	function lastPage() {
		goToPage(totalPages);
	}

	// Reset to first page when items change
	$: if (items) {
		currentPage = 1;
	}
</script>

<div class={containerClass}>
	{#if items.length === 0}
		<slot name="empty">
			<p>No items found</p>
		</slot>
	{:else}
		<!-- Items wrapper -->
		<div class={wrapperClass}>
			{#each displayedItems as item, index (item)}
				<slot {item} {index} absoluteIndex={startIndex + index} />
			{/each}
		</div>

		<!-- Pagination Controls -->
		{#if totalPages > 1}
			<div class={paginationClass}>
				<!-- First Page -->
				{#if currentPage > 1}
					<button class={navButtonClass} on:click={firstPage} type="button" title="First page">
						<slot name="firstButton">«</slot>
					</button>
				{/if}

				<!-- Previous Page -->
				<button
					class={navButtonClass}
					on:click={prevPage}
					disabled={currentPage === 1}
					type="button"
					title="Previous page"
				>
					<slot name="prevButton">PREV</slot>
				</button>

				<!-- Page Numbers -->
				{#if showPageNumbers}
					{#if pageNumbers[0] > 1}
						<span class="px-2 text-gray-500">...</span>
					{/if}

					{#each pageNumbers as pageNum}
						<button
							class={pageNum === currentPage ? activePageClass : pageButtonClass}
							on:click={() => goToPage(pageNum)}
							type="button"
						>
							{pageNum}
						</button>
					{/each}

					{#if pageNumbers[pageNumbers.length - 1] < totalPages}
						<span class="px-2 text-gray-500">...</span>
					{/if}
				{/if}

				<!-- Next Page -->
				<button
					class={navButtonClass}
					on:click={nextPage}
					disabled={currentPage === totalPages}
					type="button"
					title="Next page"
				>
					<slot name="nextButton">NEXT</slot>
				</button>

				<!-- Last Page -->
				{#if currentPage < totalPages}
					<button class={navButtonClass} on:click={lastPage} type="button" title="Last page">
						<slot name="lastButton">»</slot>
					</button>
				{/if}
			</div>
		{/if}

		<!-- Counter -->
		{#if showCounter}
			<div class="text-center mt-4">
				<slot
					name="counter"
					{currentPage}
					{totalPages}
					{startIndex}
					{endIndex}
					totalItems={items.length}
					displayedCount={displayedItems.length}
				>
					<p class="text-gray-600 text-sm">
						Showing {startIndex + 1}-{Math.min(endIndex, items.length)} of {items.length} items
						{#if totalPages > 1}
							(Page {currentPage} of {totalPages})
						{/if}
					</p>
				</slot>
			</div>
		{/if}
	{/if}
</div>
