<script>
	import ImageViewer from './image-viewer.svelte';

	export let title = 'Flobamora';
	export let images = [
		'https://img.freepik.com/free-photo/homepage-seen-computer-screen_23-2149416723.jpg?semt=ais_hybrid&w=740',
		'https://unblast.com/wp-content/uploads/2020/05/Website-Mockup.jpg'
	];
	export let thumbnail = images[0];

	export let arr;

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

{#each arr as _}
	<article
		class="max-w-sm overflow-hidden shadow-xl bg-gray6 y-6 hover:scale-105 rounded-xl transition-transform ease-in-out duration-500"
	>
		<a href="/courses/nextjs/" class="no-underline">
			<img
				class="w-full m-0 mb-1 rounded-t-xl"
				src="https://fireship.io/courses/nextjs/img/featured.webp"
				alt="Next.js Full Course"
			/>

			<section class="p-5 flex flex-col gap-5">
				<h5 class="text-xl font-bold text-white w-full">Next.js Full Course</h5>
				<p class="text-gray3 min-h-[100px] font-bold">
					Master the fundamentals of Next.js 14 and the App Router
				</p>

				<div class="w-full">
					<span class="tag tag-react">#react</span>
					<span class="tag tag-nextjs">#nextjs</span>
					<span class="tag tag-postgres">#postgres</span>
					<span class="tag tag-pro">#pro</span>
				</div>
			</section>
		</a>
	</article>
{/each}

{#if isViewerOpen}
	<ImageViewer {images} bind:selectedIndex onClose={closeViewer} />
{/if}
