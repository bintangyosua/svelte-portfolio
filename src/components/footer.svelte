<script lang="ts">
	import DiscordIcon from './icons/discord-icon.svelte';
	import GithubIcon from './icons/github-icon.svelte';
	import HuggingfaceIcon from './icons/huggingface-icon.svelte';
	import InstagramIcon from './icons/instagram-icon.svelte';
	import LinkedinIcon from './icons/linkedin-icon.svelte';
	import TableauIcon from './icons/tableau-icon.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="p-6 max-w-8xl w-fuil mx-auto font-semibold mt-10">
	<div class="text-center flex items-center gap-3 w-full justify-center flex-col">
		<div>
			<span>Find an issue with this page?</span>
			<a href="https://github.com/bintangyosua" class="text-blue hover:brightness-150"
				>Fix it on GitHub</a
			>
		</div>
		<data
			>Need help? Email <a
				href="mailto:itzbintangyosua@gmail"
				class="text-blue hover:brightness-150">itzbintangyosua@gmail.com</a
			></data
		>
		<div class="flex gap-3 items-center my-2">
			<a href="https://github.com/bintangyosua"><GithubIcon color="currentColor" /></a>
			<a href="https://www.linkedin.com/in/bintangyosua"><LinkedinIcon color="currentColor" /></a>
			<a href="https://discord.gg/uYpcJcpxgv"><DiscordIcon color="currentColor" /></a>
			<a href="https://instagram.com/itzbintangyosua"><InstagramIcon color="currentColor" /></a>
			<a href="https://huggingface.co/bintangyosua"><HuggingfaceIcon color="currentColor" /></a>
			<a href="https://public.tableau.com/app/profile/panky.bintang.pradana.yosua/vizzes"
				><TableauIcon color="currentColor" /></a
			>
		</div>
		<a href="https://kit.svelte.dev" class="text-xs"
			>© {year} Bintang Yosua. All Rights Reserved.</a
		>
	</div>
</footer>
