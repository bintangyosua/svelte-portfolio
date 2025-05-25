<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Publications</title>
	<meta name="description" content="Publications Page" />
</svelte:head>

<div class="flex flex-col gap-4 w-full max-w-8xl">
	{#if data.pages.length === 0}
		<p>Projects not found</p>
	{:else}
		{#each data.pages as page (page.id)}
			{console.log(page.properties)}
			{#if page?.properties?.Title?.type === 'title' && page?.properties?.Title?.title?.length > 0 && page?.properties?.URL?.type === 'url' && page?.properties?.URL?.url && page?.properties?.['Release Date']?.type === 'date' && page?.properties?.['Release Date']?.date?.start}
				<a
					href={page.properties.URL.url}
					class="hover:underline font-lora"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="text-gray font-semibold"
						>"{page.properties.Title.title[0].plain_text.length > 140
							? page.properties.Title.title[0].plain_text.substring(0, 140) + '...'
							: page.properties.Title.title[0].plain_text}"</span
					>
					-
					<span class="text-gray-400">
						{new Date(page.properties['Release Date'].date.start).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						})}
					</span>
				</a>
			{/if}
		{/each}
	{/if}
</div>
