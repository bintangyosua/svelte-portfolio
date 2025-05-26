<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let el: HTMLDivElement;
	let visible = false;

	// Props
	export let x: number = -100; // slide in dari kiri
	export let y: number = 0;
	export let duration: number = 3000;
	export let delay: number = 0;
	export let threshold: number = 0.1;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visible = true;
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold }
		);

		if (el) observer.observe(el);
	});
</script>

<div bind:this={el}>
	{#if visible}
		<div transition:fly={{ x, y, duration, delay }}>
			<slot />
		</div>
	{/if}
</div>
