// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

import { NOTION_PROJECTS_DATABASE_ID, NOTION_PUBLICATIONS_DATABASE_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { notionService } from '$lib/api/notion';
import { projects } from '$lib/data/projects';

export const ssr = true;

export const load = (async () => {
	try {
		const projects = await notionService.getPages(NOTION_PROJECTS_DATABASE_ID);

		const publications = await notionService.getPages(NOTION_PUBLICATIONS_DATABASE_ID, [
			{ property: 'Release Date', direction: 'descending' }
		]);

		const publicationsWithBlocks = await Promise.all(
			publications.map(async (page, i) => {
				if (i >= 3) {
					return;
				}
				return {
					...page
				};
			})
		);

		const projectsWithBlocks = await Promise.all(
			projects.map(async (page, i) => {
				if (i >= 4) {
					return;
				}

				const blocks = await notionService.getBlocks(page.id);
				const images: string[] = [];

				blocks.forEach((block: any) => {
					switch (block.type) {
						case 'image':
							images.push(block.image.file.url);
							break;
						case 'embed':
							images.push(block.embed.url);
							break;
					}
				});

				return {
					...page,
					images
				};
			})
		);

		return {
			projects: projectsWithBlocks,
			publications: publicationsWithBlocks
		};
	} catch (error) {
		console.error('Error fetching database:', error);
		return {
			projects: [],
			publications: []
		};
	}
}) satisfies PageServerLoad;
