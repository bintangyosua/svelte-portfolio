<script lang="ts">
	import { type Color } from '$lib/types/colors';
	import type { PageObjectResponse } from '@notionhq/client';
	import MainSectionLayout from '../../components/home/main-section-layout.svelte';
	import PaginationContainer from '../../components/home/pagination-container.svelte';
	import PostCard from '../../components/home/post-card.svelte';

	export let data;

	// Simpler inline approach - filter and cast in one step
	$: validPosts = data.pages.filter((post) => {
		const props = post?.properties;
		const hasValidCategory =
			!props?.Category || // kalau Category tidak ada, dianggap valid
			props.Category.type === 'select';

		const hasValidTags =
			!props?.Tags || // kalau Tags tidak ada, dianggap valid
			props.Tags.type === 'multi_select';

		return (
			props?.Title?.type === 'title' &&
			props.Title.title?.length > 0 &&
			props?.['Publication Date']?.type === 'date' &&
			props['Publication Date'].date?.start &&
			props?.Slug?.type === 'rich_text' &&
			props.Slug.rich_text?.length > 0 &&
			hasValidCategory &&
			hasValidTags
		);
	});

	function handlePageChange(event: { detail: any }) {
		// You can add analytics or other side effects here
		// Scroll to top on page change
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Helper function to safely access properties
	function getPostData(post: PageObjectResponse) {
		const props = post.properties;
		return {
			title: props.Title && 'title' in props.Title ? props.Title.title?.[0]?.plain_text : '',
			publicationDate:
				props['Publication Date'] && 'date' in props['Publication Date']
					? props['Publication Date'].date?.start
					: '',
			slug: props.Slug && 'rich_text' in props.Slug ? props.Slug.rich_text?.[0]?.plain_text : '',
			category: {
				name:
					props.Category && 'select' in props.Category ? (props.Category.select?.name ?? '') : '',
				color: (props.Category && 'select' in props.Category
					? (props.Category.select?.color ?? '')
					: '') as Color
			},
			tags:
				props.Tags && 'multi_select' in props.Tags
					? props.Tags.multi_select?.map((tag) => ({
							name: tag.name,
							color: tag.color
						}))
					: [],
			image:
				post.cover && 'file' in post.cover
					? post.cover.file?.url
					: (post.cover?.external?.url ?? '')
		};
	}
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="Blog Page" />
</svelte:head>

<MainSectionLayout
	title="BLOG"
	description="Where ideas take shape in words—exploring creativity, code, and problem-solving through every post."
>
	<PaginationContainer
		items={validPosts}
		itemsPerPage={4}
		wrapperClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10"
		on:pageChange={handlePageChange}
		let:item={post}
	>
		{@const postData = getPostData(post)}
		<PostCard
			title={postData.title}
			category={postData.category}
			publicationDate={postData.publicationDate ?? ''}
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
