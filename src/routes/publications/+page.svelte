<script lang="ts">
	import { type Color } from '$lib/types/colors';
	import type { PageObjectResponse } from '@notionhq/client';
	import MainSectionLayout from '../../components/home/main-section-layout.svelte';
	import PublicationLayout from '../../components/home/publication-layout.svelte';
	import UnlimitedScroll from '../../components/home/unlimited-scroll.svelte';

	export let data;

	// Simpler inline approach - filter and cast in one step
	$: validPublications = data.pages.filter((page) => {
		const props = page?.properties;

		return (
			props?.Title?.type === 'title' &&
			props?.Title?.title?.length > 0 &&
			props?.URL?.type === 'url' &&
			props?.URL?.url &&
			props?.['Release Date']?.type === 'date' &&
			props?.['Release Date']?.date?.start &&
			props?.Abstract?.type === 'rich_text' &&
			props?.Abstract?.rich_text?.length > 0 &&
			props?.Tags?.type === 'multi_select'
		);
	});

	function handleLoadMore(event: { detail: any }) {
		// console.log('Loading more publications:', event.detail);
	}

	// Helper function to safely access properties
	function getPublicationData(page: PageObjectResponse) {
		const props = page.properties;

		return {
			releaseDate:
				props['Release Date'] && 'date' in props['Release Date']
					? (props['Release Date'].date?.start ?? '')
					: '',
			title: props.Title && 'title' in props.Title ? props.Title.title?.[0]?.plain_text : '',
			abstract:
				props.Abstract && 'rich_text' in props.Abstract
					? props.Abstract.rich_text?.[0]?.plain_text
					: '',
			url: props.URL && 'url' in props.URL ? (props.URL.url ?? '') : '',
			tags:
				props.Tags && 'multi_select' in props.Tags
					? props.Tags.multi_select.map((tag) => ({
							name: tag.name,
							color: tag.color
						}))
					: []
		};
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
	<UnlimitedScroll
		items={validPublications}
		itemsPerPage={3}
		loadMoreText="LOAD MORE"
		wrapperClass="flex flex-col gap-6"
		on:loadMore={handleLoadMore}
		let:item={page}
	>
		{@const pubData = getPublicationData(page)}
		<PublicationLayout
			releaseDate={pubData.releaseDate}
			title={pubData.title}
			abstract={pubData.abstract}
			url={pubData.url}
			tags={pubData.tags}
		/>

		<svelte:fragment slot="empty">
			<p>Publications not found</p>
		</svelte:fragment>

		<svelte:fragment slot="counter" let:displayedCount let:totalCount>
			<p class="text-gray-600 text-sm">
				Showing {displayedCount} of {totalCount} publications
			</p>
		</svelte:fragment>
	</UnlimitedScroll>
</MainSectionLayout>
