<script lang="ts">
	import Header from '../components/header.svelte';
	import '../app.css';
	import '@fontsource-variable/tilt-warp';
	import '@fontsource-variable/lora';
	import '@fontsource/fira-mono';
	import '@fontsource/mochiy-pop-one';
	import '@fontsource/alegreya-sans';
	import '@fontsource/mouse-memoirs';
	import '@fontsource-variable/noto-sans';
	import Footer from '../components/footer.svelte';
	import { PUBLIC_NODE_ENV } from '$env/static/public';

	let { children } = $props();
</script>

<svelte:head>
	{#if PUBLIC_NODE_ENV === 'production'}
		<script
			defer
			src="https://analytics.bintangyosua.my.id/script.js"
			data-website-id="0906875d-d645-48a8-8c61-c01a8bb89c1b"
		></script>
	{/if}
</svelte:head>

<div class="min-h-screen flex flex-col bg-gradient-to-t from-blue/10 to-transparent">
	<Header />

	<main class="flex-1 mx-auto p-6 max-w-8xl w-full">
		{@render children()}
	</main>

	<Footer />
</div>
