<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/publications', label: 'Publications' }
	];
</script>

<header>
	<nav class="mx-auto w-full max-w-7xl p-4">
		<div class="w-full">
			<div class="flex flex-col md:flex-row justify-between items-center w-full">
				<a href="/" class="p-0">
					<h1 class="text-xl font-bold p-0 flex items-center gap-1">
						<img src="/logo.svg" alt="logo" class="h-5" />
						<span class="flex items-center">inuettaro</span>
					</h1>
				</a>
				<ul class="flex items-center gap-5 text-lg">
					{#each navItems as item}
						<li>
							<a href={item.href}>
								<span class={page.url.pathname === item.href ? 'text-sky-700' : ''}>
									{item.label}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<h1 class="text-left text-3xl font-semibold">Bintang Yosua</h1>
				<h2>Jenderal Soedirman University, Major in Computer Science</h2>
			</div>
			<hr class="w-full border-gray-200 mt-4" />
		</div>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	/* .corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	} */

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}
	/* 
	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	} */

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
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
