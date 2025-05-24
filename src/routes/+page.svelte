<script lang="ts">
	import MainSectionLayout from '../components/home/main-section-layout.svelte';
	import CareerLayout from '../components/home/career-layout.svelte';

	import { careers } from '$lib/data/careers';
	import ProjectCard from '../components/home/project-card.svelte';

	export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex flex-col gap-8">
	<div class="flex flex-col gap-2 justify-left">
		<div class="grid grid-cols-1 sm:grid-cols-4 gap-6 items-start">
			<!-- About -->
			<div class="grid col-span-3 gap-6">
				<MainSectionLayout title="In Memory of Me">
					<p class="text-justify">
						Motivated Computer Science undergraduate student with a strong foundation in programming
						and a keen interest in web development and machine learning. Experienced in building
						websites with payment integration using the Midtrans payment gateway, and developing
						machine learning models in Python for tasks such as customer segmentation, credit risk
						classification, and mental health diagnosis. Seeking opportunities in web development
						and machine learning.
					</p>
				</MainSectionLayout>

				<MainSectionLayout title="Careers">
					{#each careers as career}
						<CareerLayout {career}></CareerLayout>
					{/each}
				</MainSectionLayout>
			</div>
			<div class="w-full col-span-3 sm:col-span-1">
				<div class="flex flex-col gap-2">
					<a href="/Resume.pdf" target="_blank">Download My Resume</a>
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-semibold">Projects</h2>
						<a href="/projects">See All</a>
					</div>
					{#each data.pages as page}
						{#if page?.properties.Name.type === 'title'}
							<ProjectCard images={page.images} title={page.properties.Name.title[0].plain_text} />
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	/* h1 {
		text-align: left;
	} */
</style>
