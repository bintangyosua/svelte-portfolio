<script lang="ts">
	export let title: string;
	export let description: string;

	export let children;
	export let viewAll: string = '';
</script>

<div class=" flex flex-col items-center gap-6">
	<h2 class="font-mochiy text-5xl text-white">{title}</h2>
	<p>
		{description}
	</p>
	<div class="my-8 bg-gradient-to-r from-gray-700 to-gray-500 h-1 w-32 rounded-xl"></div>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
		{@render children()}
	</div>
	{#if viewAll !== ''}
		<div class="w-full mx-auto flex justify-center mt-12">
			<a href={viewAll}>
				<button
					class="bg-green text-background font-[900] mx-auto hover:bg-green/80 hover:cursor-pointer"
					>VIEW ALL</button
				>
			</a>
		</div>
	{/if}
</div>
