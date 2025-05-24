<script lang="ts">
	import GithubIcon from './icons/github-icon.svelte';
	import HuggingfaceIcon from './icons/huggingface-icon.svelte';
	import LinkedinIcon from './icons/linkedin-icon.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="p-6 border-t-gray-200 border-t-1">
	<div class="text-center flex items-center gap-2 w-full justify-center">
		<a href="https://kit.svelte.dev">© {year} Bintang Yosua | </a>
		<div class="flex gap-1 items-center">
			<a href="https://github.com/bintangyosua"><GithubIcon color="black" /></a>
			<a href="https://www.linkedin.com/in/bintangyosua"><LinkedinIcon color="#0a66c2" /></a>
			<a href="https://huggingface.co/bintangyosua"><HuggingfaceIcon /></a>
		</div>
	</div>
</footer>
