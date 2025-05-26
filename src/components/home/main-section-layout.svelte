<script lang="ts">
	export let title: string;
	export let description: string;

	export let children;
	export let viewAll: string = '';

	let className: string = '';
	export { className as class };

	$: loading = false;
</script>

<div class={`flex flex-col items-center gap-6 ${className}`}>
	<h2 class="font-mochiy text-4xl md:text-5xl text-white">{title}</h2>
	<p class="text-center max-w-7xl">
		{description}
	</p>
	<div class="my-8 bg-gradient-to-r from-gray-700 to-gray-500 h-1 w-32 rounded-xl"></div>
	{@render children()}
	{#if viewAll !== ''}
		<div class="w-full mx-auto flex justify-center mt-12">
			<a href={viewAll}>
				<button
					disabled={loading}
					on:click={() => (loading = true)}
					class="bg-green text-background font-[900] mx-auto hover:bg-green/80 hover:cursor-pointer flex items-center gap-2"
				>
					{#if loading}
						<!-- Spinner -->
						<svg
							class="animate-spin h-5 w-5 text-background"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							/>
						</svg>
						<span>LOADING ...</span>
					{:else}
						VIEW ALL
					{/if}
				</button>
			</a>
		</div>
	{/if}
</div>
