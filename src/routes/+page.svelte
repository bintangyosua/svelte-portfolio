<script lang="ts">
	import { config } from '$lib/config';
	import CardGridLayout from '../components/home/card-grid-layout.svelte';
	import CardLayout from '../components/home/card-layout.svelte';
	import MainSectionLayout from '../components/home/main-section-layout.svelte';
	import PublicationLayout from '../components/home/publication-layout.svelte';

	export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col gap-8">
	<div class="h-[25rem] my-12 flex items-center flex-col justify-center">
		<h1 class="text-6xl font-mochiy text-center text-white">
			BINTANG <span
				class="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent"
				>YOSUA</span
			>
		</h1>
		<p class="font-semibold my-6 text-xl text-center w-full md:w-2/3">
			Computer Science undergraduate student with a strong foundation in <span
				class="font-bold text-yellow">programming</span
			>
			and a keen interest in
			<span class="font-bold text-red">web development and machine learning</span>
		</p>
		<div class="flex flex-wrap gap-4">
			<a href={config.mailto}
				><button class="bg-green text-background font-[900] hover:bg-green/80 hover:cursor-pointer"
					>CONTACT ME</button
				></a
			>
			<a href={config.resume} target="_blank"
				><button class="bg-blue text-background font-[900] hover:bg-blue/80 hover:cursor-pointer"
					>RESUME</button
				></a
			>
		</div>
	</div>

	<MainSectionLayout
		class="mt-20"
		title="PROJECTS"
		description="A showcase of my hands-on creations—where ideas meet execution to solve real-world problems."
		viewAll="/projects"
	>
		<CardGridLayout>
			{#if data.projects.length === 0}
				<p>Projects not found</p>
			{:else}
				{#each data.projects as project}
					{#if project?.properties.Name.type === 'title' && project?.properties.Description.type === 'rich_text' && project?.properties.Tags.type === 'multi_select' && project?.properties.URL.type === 'url'}
						<CardLayout
							name={project?.properties.Name.title[0].plain_text}
							description={project?.properties.Description.rich_text[0].plain_text}
							tags={project?.properties.Tags.multi_select.map((tag) => ({
								name: tag.name,
								color: tag.color
							}))}
							image={project?.images[0]}
							url={project?.properties.URL.url ?? '#'}
						/>
					{/if}
				{/each}
			{/if}
		</CardGridLayout>
	</MainSectionLayout>

	<MainSectionLayout
		class="mt-20"
		title="PUBLICATIONS"
		description="A curated collection of research publications and academic contributions, each reflecting my commitment to solving real-world problems through rigorous analysis, thoughtful design, and data-driven insights."
		viewAll="/publications"
	>
		{#if data.publications.length === 0}
			<p>Publications not found</p>
		{:else}
			<div class="flex flex-col gap-8">
				{#each data.publications as page}
					{#if page?.properties?.Title?.type === 'title' && page?.properties?.Title?.title?.length > 0 && page?.properties?.URL?.type === 'url' && page?.properties?.URL?.url && page?.properties?.['Release Date']?.type === 'date' && page?.properties?.['Release Date']?.date?.start && page?.properties?.Abstract?.type === 'rich_text' && page?.properties?.Tags?.type === 'multi_select'}
						<PublicationLayout
							releaseDate={page.properties['Release Date'].date.start}
							title={page.properties.Title.title[0].plain_text}
							abstract={page.properties.Abstract.rich_text[0].plain_text}
							url={page.properties.URL.url}
							tags={page?.properties.Tags.multi_select.map((tag) => ({
								name: tag.name,
								color: tag.color
							}))}
						></PublicationLayout>
					{/if}
				{/each}
			</div>
		{/if}
	</MainSectionLayout>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
