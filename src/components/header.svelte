<script lang="ts">
	import { page } from '$app/state';

	const navItems: {
		href: string;
		label: string;
		target?: string;
	}[] = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/publications', label: 'Publications' }
		// { href: 'https://cv.bintangyosua.my.id', label: 'CV', target: '_blank' }
	];
</script>

<header>
	<nav class="mx-auto w-full max-w-8xl p-6">
		<div class="w-full">
			<div class="flex flex-col gap-y-4 md:flex-row justify-between items-center w-full">
				<a href="/" class="p-0">
					<h1 class="text-xl font-bold p-0 flex items-center gap-1">
						<img src="/logo.png" alt="logo" class="h-10" />
						<span class="flex items-center font-mochi text-3xl text-white font-mochiy"
							>inuettaro</span
						>
					</h1>
				</a>
				<ul class="flex flex-wrap items-center gap-3 gap-y-0 sm:gap-4 md:gap-5 text-lg">
					{#each navItems as item}
						<li>
							<a href={item.href} target={item.target}>
								<span
									class={`normal-case text-lg ${page.url.pathname === item.href ? 'text-blue hover:text-blue hover:brightness-150' : 'hover:text-white'}`}
								>
									{item.label.toLowerCase()}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		/* background: var(--background); */
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}
</style>
