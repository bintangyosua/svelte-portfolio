<script lang="ts">
	export let images: string[] = [];
	export let selectedIndex: number = 0;
	export let onClose: () => void = () => {};

	function next() {
		selectedIndex = (selectedIndex + 1) % images.length;
	}

	function prev() {
		selectedIndex = (selectedIndex - 1 + images.length) % images.length;
	}

	function selectImage(index: number) {
		selectedIndex = index;
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		} else if (event.key === 'ArrowLeft') {
			prev();
		} else if (event.key === 'ArrowRight') {
			next();
		}
	}

	// Close on background click
	function handleBackgroundClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
</script>

{#if images.length}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 bg-black/75 z-50 flex items-center justify-center flex-col p-4"
		on:keydown={handleKeydown}
		on:click={handleBackgroundClick}
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label="Image viewer"
	>
		<!-- Close button -->
		<button
			class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
			on:click={onClose}
			aria-label="Close image viewer"
		>
			✕
		</button>

		<!-- Main image -->
		<img
			src={images[selectedIndex]}
			alt="Preview {selectedIndex + 1} of {images.length}"
			class="max-h-[70vh] max-w-[90vw] object-contain rounded-lg shadow-lg mb-4"
		/>

		<!-- Navigation & thumbnail section -->
		<div class="flex items-center gap-4 w-full justify-center flex-wrap mt-4">
			<!-- Prev button -->
			<button
				on:click={prev}
				class="text-white text-2xl px-3 py-1roundeddisabled:opacity-50 hover:cursor-pointer"
				disabled={images.length <= 1}
				aria-label="Previous image"
			>
				‹
			</button>

			<!-- Thumbnails -->
			<div class="flex gap-2 overflow-x-auto max-w-[70vw] px-2">
				{#each images as img, i}
					<button
						on:click={() => selectImage(i)}
						class="border-2 rounded-lg overflow-hidden transition-all hover:cursor-pointer
						{selectedIndex === i ? 'border-white' : 'border-transparent hover:border-gray-400'}"
						aria-label="View image {i + 1}"
					>
						<img src={img} alt="Thumbnail {i + 1}" class="w-14 h-14 object-cover" />
					</button>
				{/each}
			</div>

			<!-- Next button -->
			<button
				on:click={next}
				class="text-white text-2xl px-3 py-1 rounded disabled:opacity-50 hover:cursor-pointer"
				disabled={images.length <= 1}
				aria-label="Next image"
			>
				›
			</button>
		</div>

		<!-- Image counter -->
		<div class="text-white text-sm mt-2">
			{selectedIndex + 1} / {images.length}
		</div>
	</div>
{/if}
