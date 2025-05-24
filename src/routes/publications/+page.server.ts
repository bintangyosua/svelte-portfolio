import type { PageServerLoad } from './$types';
import { notionService } from '$lib/api/notion';
import { NOTION_PUBLICATIONS_DATABASE_ID } from '$env/static/private';

export const ssr = true;

export const load = (async () => {
	try {
		const pages = await notionService.getPages(NOTION_PUBLICATIONS_DATABASE_ID);

		const pagesWithBlocks = await Promise.all(
			pages.map(async (page, i) => {
				return {
					...page
				};
			})
		);

		return {
			pages: pagesWithBlocks
		};
	} catch (error) {
		console.error('Error fetching database:', error);
		return {
			pages: []
		};
	}
}) satisfies PageServerLoad;
