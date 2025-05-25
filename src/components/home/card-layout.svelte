<script lang="ts">
	import { colorClasses, type Color } from '$lib/types/colors';

	export let name: string;
	export let image: string;
	export let description: string;
	export let url: string;
	export let tags: {
		name: string;
		color: {
			color: Color;
		};
	}[];
</script>

<article
	class="overflow-hidden shadow-xl bg-gray6 hover:scale-105 rounded-xl transition-transform ease-in-out duration-500 flex flex-col"
>
	<a href={url} class="no-underline flex flex-col h-full" target="_blank">
		<img
			class="w-full h-[200px] object-cover m-0 mb-1 rounded-t-xl"
			src={image}
			alt="Next.js Full Course"
		/>
		<section class="p-5 flex flex-col gap-5 flex-grow">
			<h5 class="text-xl font-bold text-white w-full">{name}</h5>
			<p class="text-gray3 font-semibold flex-grow">
				{description}
			</p>
			<div class="w-full text-white text-xs flex flex-wrap gap-x-2 gap-y-2 mt-auto">
				{#each tags as tag}
					<span class={`${colorClasses[tag.color.color]} px-2 py-1 rounded-lg`}>#{tag.name}</span>
				{/each}
			</div>
		</section>
	</a>
</article>
