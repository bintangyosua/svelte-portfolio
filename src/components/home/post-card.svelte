<script lang="ts">
	import { formatDate } from '$lib/date.';
	import { colorClasses, type Color } from '$lib/types/colors';

	export let title: string;
	export let publicationDate: string;
	export let slug: string;
	export let category: {
		name: string;
		color: Color;
	};
	export let image: string;
	export let tags: {
		name: string;
		color: Color;
	}[];
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
			<span class={`${colorClasses[category.color]} text-xs px-2 py-1 rounded-lg w-fit`}
				>{category.name}</span
			>
			<h5 class="text-xl font-bold text-white w-full">{title}</h5>
			<div class="flex items-center gap-x-2">
				<span>{formatDate(publicationDate)}</span>
			</div>
			<div class="w-full text-white text-xs flex flex-wrap gap-x-2 gap-y-2 mt-auto">
				{#each tags as tag}
					<span class={`${colorClasses[tag.color]} px-2 py-1 rounded-lg`}>#{tag.name}</span>
				{/each}
			</div>
		</section>
	</a>
</article>
