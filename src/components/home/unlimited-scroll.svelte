<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type T = $$Generic;

	export let items: T[] = [];
	export let itemsPerPage: number = 5;
	export let loadMoreText: string = 'Load More';
	export let showCounter: boolean = true;
	export let containerClass: string = '';
	export let wrapperClass: string = ''; // New prop for wrapper div
	export let buttonClass: string =
		'bg-gradient-to-r from-blue to-purple hover:from-blue hover:brightness-110 hover:to-purple text-white font-medium py-3 px-6 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:translate-y-0 hover:cursor-pointer';

	const dispatch = createEventDispatcher<{
		loadMore: { currentPage: number; displayedCount: number };
	}>();

	// Pagination state
	let currentPage = 1;

	// Reactive calculations
	$: displayedItems = items.slice(0, currentPage * itemsPerPage);
	$: hasMore = displayedItems.length < items.length;
	$: remainingItems = items.length - displayedItems.length;

	// Load more function
	function loadMore() {
		currentPage += 1;
		dispatch('loadMore', {
			currentPage,
			displayedCount: displayedItems.length
		});
	}

	// Reset pagination when items change
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
		<!-- Wrapper div for items with customizable class -->
		<div class={wrapperClass}>
			{#each displayedItems as item, index (item)}
				<slot {item} {index} />
			{/each}
		</div>

		<!-- Load More Button -->
		{#if hasMore}
			<div class="flex justify-center my-8">
				<button class={buttonClass} on:click={loadMore} type="button">
					<slot name="loadMoreButton" {remainingItems}>
						{loadMoreText} ({remainingItems} remaining)
					</slot>
				</button>
			</div>
		{/if}

		<!-- Counter -->
		{#if showCounter}
			<div class="text-center mt-4">
				<slot name="counter" displayedCount={displayedItems.length} totalCount={items.length}>
					<p class="text-gray-600 text-sm">
						Showing {displayedItems.length} of {items.length} items
					</p>
				</slot>
			</div>
		{/if}
	{/if}
</div>
