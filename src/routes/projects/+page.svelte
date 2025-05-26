<script lang="ts">
	import { type Color } from '$lib/types/colors';
	import CardGridLayout from '../../components/home/card-grid-layout.svelte';
	import CardLayout from '../../components/home/card-layout.svelte';
	import MainSectionLayout from '../../components/home/main-section-layout.svelte';

	export let data;
</script>

<svelte:head>
	<title>Projects</title>
	<meta name="description" content="Projects Page" />
</svelte:head>

<MainSectionLayout
	title="PROJECTS"
	description="A showcase of my hands-on creations—where ideas meet execution to solve real-world problems."
>
	<CardGridLayout>
		{#each data.pages as project}
			{#if project?.properties.Name.type === 'title' && project?.properties.Description.type === 'rich_text' && project?.properties.Tags.type === 'multi_select' && project?.properties.URL.type === 'url'}
				<CardLayout
					name={project?.properties.Name.title[0].plain_text}
					description={project?.properties.Description.rich_text[0].plain_text}
					tags={project?.properties.Tags.multi_select.map((tag) => ({
						name: tag.name,
						color: tag as unknown as { color: Color }
					}))}
					image={project?.images[0]}
					url={project?.properties.URL.url ?? '#'}
				/>
			{/if}
		{/each}</CardGridLayout
	>
</MainSectionLayout>
