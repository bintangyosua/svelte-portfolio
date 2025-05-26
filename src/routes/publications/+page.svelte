<script lang="ts">
	import { type Color } from '$lib/types/colors';
	import MainSectionLayout from '../../components/home/main-section-layout.svelte';
	import PublicationLayout from '../../components/home/publication-layout.svelte';

	export let data;

	// Pagination state
	let itemsPerPage = 3; // Show 5 publications initially
	let currentPage = 1;

	// Calculate displayed items
	$: displayedItems = data.pages.slice(0, currentPage * itemsPerPage);
	$: hasMore = displayedItems.length < data.pages.length;
	$: remainingItems = data.pages.length - displayedItems.length;

	// Load more function
	function loadMore() {
		currentPage += 1;
	}
</script>

<svelte:head>
	<title>Publications</title>
	<meta name="description" content="Publications Page" />
</svelte:head>
<MainSectionLayout
	title="PUBLICATIONS"
	description="A curated collection of research publications and academic contributions, each reflecting my commitment to solving real-world problems through rigorous analysis, thoughtful design, and data-driven insights."
>
	{#if data.pages.length === 0}
		<p>Projects not found</p>
	{:else}
		{#each displayedItems as page (page.id)}
			{#if page?.properties?.Title?.type === 'title' && page?.properties?.Title?.title?.length > 0 && page?.properties?.URL?.type === 'url' && page?.properties?.URL?.url && page?.properties?.['Release Date']?.type === 'date' && page?.properties?.['Release Date']?.date?.start && page?.properties?.Abstract?.type === 'rich_text' && page?.properties?.Tags?.type === 'multi_select'}
				<PublicationLayout
					releaseDate={page.properties['Release Date'].date.start}
					abstractLength={540}
					title={page.properties.Title.title[0].plain_text}
					abstract={page.properties.Abstract.rich_text[0].plain_text}
					url={page.properties.URL.url}
					tags={page?.properties.Tags.multi_select.map((tag) => ({
						name: tag.name,
						color: tag as unknown as { color: Color }
					}))}
				></PublicationLayout>
			{/if}
		{/each}

		<!-- Load More Button -->
		{#if hasMore}
			<div class="flex justify-center my-8">
				<button
					class="bg-gradient-to-r from-blue to-purple hover:from-blue hover:brightness-110 hover:to-purple text-white font-medium py-3 px-6 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:translate-y-0 hover:cursor-pointer"
					on:click={loadMore}
					type="button"
				>
					Load More ({remainingItems} remaining)
				</button>
			</div>
		{/if}

		<!-- Show total count -->
		<div class="text-center mt-4">
			<p class="text-gray-600 text-sm">
				Showing {displayedItems.length} of {data.pages.length} publications
			</p>
		</div>
	{/if}
</MainSectionLayout>
