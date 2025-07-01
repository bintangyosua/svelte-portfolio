<script lang="ts">
	import DiscordIcon from './icons/discord-icon.svelte';
	import DockerIcon from './icons/docker-icon.svelte';
	import GithubIcon from './icons/github-icon.svelte';
	import HuggingfaceIcon from './icons/huggingface-icon.svelte';
	import InstagramIcon from './icons/instagram-icon.svelte';
	import LinkedinIcon from './icons/linkedin-icon.svelte';
	import TableauIcon from './icons/tableau-icon.svelte';

	const year = new Date().getFullYear();

	const socialMedia = [
		{
			name: 'Github',
			url: 'https://github.com/bintangyosua',
			icon: GithubIcon
		},
		{
			name: 'Linkedin',
			url: 'https://www.linkedin.com/in/bintangyosua',
			icon: LinkedinIcon
		},
		{
			name: 'Discord',
			url: 'https://discord.gg/uYpcJcpxgv',
			icon: DiscordIcon
		},
		{
			name: 'Instagram',
			url: 'https://instagram.com/itzbintangyosua',
			icon: InstagramIcon
		},
		{
			name: 'Huggingface',
			url: 'https://huggingface.co/bintangyosua',
			icon: HuggingfaceIcon
		},
		{
			name: 'Tableau',
			url: 'https://public.tableau.com/app/profile/panky.bintang.pradana.yosua/vizzes',
			icon: TableauIcon
		},
		{
			name: 'Docker',
			url: 'https://hub.docker.com/u/skyfellinlove',
			icon: DockerIcon
		}
	];
</script>

<footer class="p-6 max-w-8xl w-full mx-auto font-semibold mt-10">
	<div class="text-center flex items-center gap-3 w-full justify-center flex-col">
		<div>
			<span>Find an issue with this page?</span>
			<a href="https://github.com/bintangyosua" class="text-blue hover:brightness-150">
				Fix it on GitHub
			</a>
		</div>
		<div>
			Need help? Email
			<a href="mailto:itzbintangyosua@gmail.com" class="text-blue hover:brightness-150">
				itzbintangyosua@gmail.com
			</a>
		</div>
		<div class="font-mochiy text-sm">HELPFUL LINKS</div>
		<div class="flex gap-3 items-center my-2">
			{#each socialMedia as { url, icon, name }}
				<a href={url} class="flex items-center" aria-label={name} target="_blank">
					<svelte:component this={icon} color="currentColor" />
				</a>
			{/each}
		</div>
		<div class="text-xs">
			© {year} Bintang Yosua. All Rights Reserved.
		</div>
	</div>
</footer>
