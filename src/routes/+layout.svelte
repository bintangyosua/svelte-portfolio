<script lang="ts">
	import Header from '../components/header.svelte';
	import '@fontsource-variable/lora';
	import '../app.css';
	import Footer from '../components/footer.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<Header />

	<main class="flex-1 mx-auto p-4 max-w-7xl">
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
