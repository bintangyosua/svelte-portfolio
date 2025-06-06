<script lang="ts">
	import { type Color } from '$lib/types/colors';
	import type { PageObjectResponse } from '@notionhq/client';
	import CardLayout from '../../components/home/card-layout.svelte';
	import MainSectionLayout from '../../components/home/main-section-layout.svelte';
	import PaginationContainer from '../../components/home/pagination-container.svelte';

	export let data;

	// Simpler inline approach - filter and cast in one step
	$: validProjects = data.pages.filter((project) => {
		const props = project?.properties;
		return (
			props?.Name?.type === 'title' &&
			props?.Name?.title?.length > 0 &&
			props?.Description?.type === 'rich_text' &&
			props?.Description?.rich_text?.length > 0 &&
			props?.Tags?.type === 'multi_select' &&
			props?.URL?.type === 'url'
		);
	});

	function handlePageChange(event: { detail: any }) {
		// You can add analytics or other side effects here
		// Scroll to top on page change
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Helper function to safely access properties
	function getProjectData(project: PageObjectResponse & { images: string[] }) {
		const props = project.properties;
		return {
			// name: props.Name?.title?.[0]?.plain_text || '',
			name: props.Name && 'title' in props.Name ? props.Name.title?.[0]?.plain_text : '',
			description:
				props.Description && 'rich_text' in props.Description
					? props.Description.rich_text?.[0]?.plain_text
					: 'No Description',
			tags:
				props.Tags && 'multi_select' in props.Tags
					? props.Tags.multi_select?.map((tag) => ({
							name: tag.name,
							color: tag.color
						}))
					: [],
			url: (props.URL && 'url' in props.URL ? props.URL.url : '#') ?? '#',
			image: project?.images?.[0]
		};
	}
</script>

<svelte:head>
	<title>Projects</title>
	<meta name="description" content="Projects Page" />
</svelte:head>

<MainSectionLayout
	title="PROJECTS"
	description="A showcase of my hands-on creations—where ideas meet execution to solve real-world problems."
>
	<PaginationContainer
		items={validProjects}
		itemsPerPage={8}
		wrapperClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10 "
		on:pageChange={handlePageChange}
		let:item={project}
	>
		{@const projectData = getProjectData(project)}
		<CardLayout
			name={projectData.name}
			description={projectData.description}
			tags={projectData.tags}
			image={projectData.image}
			url={projectData.url}
		/>

		<svelte:fragment slot="empty">
			<div class="text-center py-12">
				<p class="text-xl text-gray-500">No projects found.</p>
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
				Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} projects
				{#if totalPages > 1}
					(Page {currentPage} of {totalPages})
				{/if}
			</p>
		</svelte:fragment>
	</PaginationContainer>
</MainSectionLayout>
