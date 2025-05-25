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

<style>
	/* .app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	} */
</style>
