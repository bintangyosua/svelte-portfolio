<script>
	import ImageViewer from './image-viewer.svelte';

	export let title = 'Flobamora';
	export let images = [
		'https://img.freepik.com/free-photo/homepage-seen-computer-screen_23-2149416723.jpg?semt=ais_hybrid&w=740',
		'https://unblast.com/wp-content/uploads/2020/05/Website-Mockup.jpg'
	];
	export let thumbnail = images[0];

	let isViewerOpen = false;
	let selectedIndex = 0;

	function openViewer() {
		isViewerOpen = true;
		selectedIndex = 0;
	}

	function closeViewer() {
		isViewerOpen = false;
	}
</script>

<button
	class="group relative rounded overflow-hidden shadow transition-all duration-300 ease-in-out cursor-pointer block text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/75 transform hover:scale-105"
	on:click={openViewer}
>
	<img
		src={thumbnail}
		alt={title}
		class="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
	/>
	<div class="p-4 bg-white">
		<h2 class="text-lg font-semibold text-gray-800 transition-colors">
			{title}
		</h2>
	</div>

	<!-- Optional gradient overlay on image -->
	<div class="absolute inset-0 pointer-events-none"></div>
</button>

{#if isViewerOpen}
	<ImageViewer {images} bind:selectedIndex onClose={closeViewer} />
{/if}
