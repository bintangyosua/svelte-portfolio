<script lang="ts">
	import { type Color } from '$lib/types/colors';
	import CardLayout from '../components/home/card-layout.svelte';
	import MainSectionLayout from '../components/home/main-section-layout.svelte';

	export let data;
	console.log(data.pages);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col gap-8">
	<div class="h-[35rem] flex items-center flex-col justify-center">
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
		<button class="bg-green text-background font-[900] hover:bg-green/80 hover:cursor-pointer"
			>CONTACT ME</button
		>
	</div>

	<MainSectionLayout
		title="PROJECTS"
		description="A showcase of my hands-on creations—where ideas meet execution to solve real-world problems."
		viewAll="/projects"
	>
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
		{/each}
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
