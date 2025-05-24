<script lang="ts">
	import ProjectCard from '../../components/home/project-card.svelte';

	export let data;
</script>

<svelte:head>
	<title>Projects</title>
	<meta name="description" content="Projects Page" />
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
	{#if data.pages.length === 0}
		<p>Projects not found</p>
	{:else}
		{#each data.pages as page}
			{#if page?.properties.Name.type === 'title'}
				<ProjectCard images={page.images} title={page.properties.Name.title[0].plain_text} />
			{/if}
		{/each}
	{/if}
</div>
