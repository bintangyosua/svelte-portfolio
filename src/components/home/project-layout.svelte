<script lang="ts">
	import type { ProjectType } from '$lib/types';

	export let project: ProjectType;

	const { name, start, end, details, tags } = project;
</script>

<div class="overflow-hidden">
	<header>
		<img
			src={'https://www.sliderrevolution.com/wp-content/uploads/2024/10/cool-website-effects-f.jpg'}
			alt="banner"
			class="object-cover"
		/>
	</header>
	<article class="space-y-4 py-2">
		<div class="flex items-center justify-between">
			<a href={`/projects/${name.toLowerCase().split(' ').join('-')}`}>
				<h2 class="text-lg font-semibold">{name}</h2>
			</a>
			<small class="opacity-60 font-semibold">{start} - {end}</small>
		</div>
		<p class="opacity-80">{details[0].slice(0, 125)}...</p>
	</article>
	<footer class="flex items-center gap-1 gap-y-2 flex-wrap">
		{#each tags as tag}
			<span class="badge bg-gray-300 px-2 rounded-xl text-sm">{tag}</span>
		{/each}
	</footer>
</div>
