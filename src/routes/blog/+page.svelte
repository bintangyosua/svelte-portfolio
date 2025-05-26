<script lang="ts">
	import { type Color } from '$lib/types/colors';
	import MainSectionLayout from '../../components/home/main-section-layout.svelte';
	import PaginationContainer from '../../components/home/pagination-container.svelte';
	import PostCard from '../../components/home/post-card.svelte';

	export let data;

	// Simpler inline approach - filter and cast in one step
	$: validPosts = data.pages.filter((post) => {
		const props = post?.properties;
		return (
			props?.Title.type === 'title' &&
			props?.Title?.title?.length > 0 &&
			props?.['Publication Date']?.type === 'date' &&
			props?.['Publication Date']?.date?.start &&
			props?.Slug?.type === 'rich_text' &&
			props?.Slug?.rich_text?.length > 0 &&
			props?.Category?.type === 'select' &&
			props?.Category?.select?.name &&
			props?.Tags?.type === 'multi_select'
		);
	});

	function handlePageChange(event: { detail: any }) {
		console.log('Page changed:', event.detail);
		// You can add analytics or other side effects here
		// Scroll to top on page change
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Helper function to safely access properties
	function getPostData(post: any) {
		const props = post.properties;
		console.log({ props });
		return {
			title: (props.Title as any)?.title?.[0]?.plain_text || '',
			publicationDate: (props['Publication Date'] as any)?.date?.start || '',
			slug: (props.Slug as any)?.rich_text?.[0]?.plain_text || '',
			category: {
				name: (props.Category as any)?.select?.name || '',
				color: (props.Category as any)?.select?.color || ''
			},
			tags:
				(props.Tags as any)?.multi_select?.map((tag: any) => ({
					name: tag.name,
					color: tag.color as unknown as Color
				})) || [],
			image: post.cover?.file?.url ?? post.cover?.external?.url
		};
	}
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="Blog Page" />
</svelte:head>

<MainSectionLayout
	title="BLOG"
	description="A showcase of my hands-on creations—where ideas meet execution to solve real-world problems."
>
	<PaginationContainer
		items={validPosts}
		itemsPerPage={4}
		wrapperClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10 "
		on:pageChange={handlePageChange}
		let:item={post}
	>
		{@const postData = getPostData(post)}
		<PostCard
			title={postData.title}
			category={postData.category}
			publicationDate={postData.publicationDate}
			slug={postData.slug}
			tags={postData.tags}
			image={postData.image}
		/>

		<svelte:fragment slot="empty">
			<div class="text-center py-12">
				<p class="text-xl text-gray-500">No posts found.</p>
			</div>
		</svelte:fragment>

		<svelte:fragment
			slot="counter"
			let:currentPage
			let:totalPages
			let:startIndex
			let:endIndex
			let:totalItems
		>
			<p class="text-gray-600 text-sm">
				Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} posts
				{#if totalPages > 1}
					(Page {currentPage} of {totalPages})
				{/if}
			</p>
		</svelte:fragment>
	</PaginationContainer>
</MainSectionLayout>
