<script lang="ts">
	import type { CareerType } from '$lib/types';

	export let career: CareerType;

	const { company, position, start, end, place, projects } = career;
</script>

<div class="grid grid-cols-2 justify-between">
	<h3 class="font-semibold">{company}</h3>
	<p class="text-right">{place}</p>
	<p>{position}</p>
	<p class="text-right">{start}-{end}</p>
	<div class="col-span-2">
		<ol class="list-disc ml-4">
			{#each projects as project}
				<li>{project}</li>
			{/each}
		</ol>
	</div>
</div>
