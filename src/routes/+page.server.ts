// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

import { NOTION_PROJECTS_DATABASE_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { notionService } from '$lib/api/notion';

export const ssr = true;

export const load = (async () => {
	try {
		const pages = await notionService.getPages(NOTION_PROJECTS_DATABASE_ID);

		const pagesWithBlocks = await Promise.all(
			pages.map(async (page, i) => {
				if (i >= 2) {
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
			pages: pagesWithBlocks.slice(0, 2)
		};
	} catch (error) {
		console.error('Error fetching database:', error);
		return {
			pages: []
		};
	}
}) satisfies PageServerLoad;
