<script lang="ts">
	import '@notion-render/client/sass/theme.scss';
	export let data;

	console.log(data.page);
</script>

<svelte:head>
	{#if data.page?.properties.Title.type === 'title'}
		<title>{data.page?.properties.Title.title[0].plain_text}</title>
		<meta name="description" content={data.page?.properties.Title.title[0].plain_text} />
	{/if}
</svelte:head>

<section class="notion text-justify w-full">
	<div class="grid-cols-1 grid md:grid-cols-3">
		<div class="md:col-span-3 max-w-5xl">
			{#if data.page?.properties.Title.type === 'title'}
				<h1 class="text-2xl font-bold">{data.page.properties.Title.title[0].plain_text}</h1>
			{/if}

			{#if data.page?.cover?.type === 'file'}
				<!-- svelte-ignore a11y_missing_attribute -->
				<img src={data.page?.cover.file.url} class="object-cover aspect-[21/9]" />
			{:else if data.page?.cover?.type === 'external'}
				<!-- svelte-ignore a11y_missing_attribute -->
				<img src={data.page?.cover.external.url} class="object-cover aspect-[21/9]" />
			{/if}

			{@html data.html}
		</div>
	</div>
</section>
