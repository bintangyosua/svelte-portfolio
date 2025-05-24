<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="Blog Page" />
</svelte:head>

<section class="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
	{#if data.pages.length > 0}
		{#each data.pages as page}
			{#if page.properties.Slug && page.properties.Slug.type === 'url'}
				<a
					href={`/blog/${page.properties.Slug.url}`}
					class="flex flex-col h-full bg-white rounded shadow overflow-hidden"
				>
					<header>
						{#if page.cover?.type === 'file'}
							<!-- svelte-ignore a11y_missing_attribute -->
							<img
								src={page.cover.file.url}
								class="object-cover aspect-[21/9] transition-transform duration-300 group-hover:scale-110"
							/>
						{:else if page.cover?.type === 'external'}
							<!-- svelte-ignore a11y_missing_attribute -->
							<img
								src={page.cover.external.url}
								class="object-cover aspect-[21/9] transition-transform duration-300 group-hover:scale-110"
							/>
						{/if}
					</header>
					<article class="flex-1 space-y-4 p-4">
						<div>
							{#if page.properties.Title.type === 'title'}
								<h2 class="h3">{page.properties.Title.title[0].plain_text}</h2>
							{/if}
						</div>
					</article>
					<footer class="flex items-center justify-between gap-4 p-4">
						<small class="opacity-60">
							<!-- Hello -->
						</small>
						<small class="opacity-60">
							{#if page.properties['Publication Date'] && page.properties['Publication Date'].type === 'date' && page.properties['Publication Date'].date && page.properties['Publication Date'].date.start}
								On {page.properties['Publication Date'].date.start}
							{/if}
						</small>
					</footer>
				</a>
			{/if}
		{/each}
	{:else}
		<p>No pages found.</p>
	{/if}
</section>
