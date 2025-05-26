<script lang="ts">
	import { formatDate } from '$lib/date.';
	import type { PartialSelectResponse } from '$lib/types';
	import { colorClasses, type Color } from '$lib/types/colors';
	import Badge from './badge.svelte';

	export let title: string;
	export let publicationDate: string;
	export let slug: string;
	export let category: {
		name: string;
		color: Color;
	} | null = null;
	export let image: string;
	export let tags: PartialSelectResponse[];
</script>

<article
	class="overflow-hidden shadow-xl bg-gray6 hover:scale-105 rounded-xl transition-transform ease-in-out duration-500 flex flex-col"
>
	<a href={`/blog/${slug}`} class="no-underline flex flex-col h-full">
		<img
			class="w-full h-[200px] object-cover m-0 mb-1 rounded-t-xl"
			src={image}
			alt="Next.js Full Course"
		/>
		<section class="p-5 flex flex-col gap-5 flex-grow">
			{#if category}
				<Badge color={category.color}>{category.name}</Badge>
			{/if}
			<h5 class="text-xl font-bold text-white w-full">{title}</h5>
			<div class="flex items-center gap-x-2 -mt-3">
				{formatDate(publicationDate)}
			</div>
			<div class="w-full text-white text-xs flex flex-wrap gap-x-2 gap-y-2 mt-auto">
				{#if tags.length >= 0}
					{#each tags as tag}
						<Badge color={tag.color}>#{tag.name}</Badge>
					{/each}
				{/if}
			</div>
		</section>
	</a>
</article>
