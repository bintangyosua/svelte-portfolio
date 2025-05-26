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

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-t from-blue/10 to-transparent">
	<Header />

	<main class="flex-1 mx-auto p-6 max-w-8xl w-full">
		{@render children()}
	</main>

	<Footer />
</div>
