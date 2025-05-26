<script lang="ts">
	import type { PartialSelectResponse } from '$lib/types';
	import { colorClasses, type Color } from '$lib/types/colors';
	import Badge from './badge.svelte';

	export let title: string;
	export let url: string;
	export let abstract: string;
	export let releaseDate: string;
	// export let publishedDate: string;
	export let tags: PartialSelectResponse[] = [];
</script>

<article
	class="overflow-hidden shadow-xl bg-gray6 hover:scale-105 rounded-xl transition-transform ease-in-out duration-500 flex flex-col"
>
	<a href={url} class="no-underline flex flex-col h-full" target="_blank">
		<section class="p-5 flex flex-col gap-5 flex-grow">
			<h5 class="text-md sm:text-lg md:text-xl font-bold text-white w-full">{title}</h5>
			<div class="-mt-4">
				{new Date(releaseDate).toLocaleDateString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</div>
			<p class="text-gray3 font-semibold flex-grow text-justify line-clamp-3">
				{abstract}
			</p>
			<div class="w-full text-white text-xs flex flex-wrap gap-x-2 gap-y-2 mt-auto">
				{#if tags.length > 0}
					{#each tags as tag}
						<Badge color={tag.color}>{tag.name}</Badge>
					{/each}
				{/if}
			</div>
		</section>
	</a>
</article>
