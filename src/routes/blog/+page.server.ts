import { NOTION_BLOG_DATABASE_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { notionService } from '$lib/api/notion';

export const load = (async () => {
	try {
		const pages = await notionService.getPages(NOTION_BLOG_DATABASE_ID, [
			{
				property: 'Publication Date',
				direction: 'descending'
			}
		]);
		return {
			pages
		};
	} catch (error) {
		console.error('Error fetching database:', error);
		return {
			pages: []
		};
	}
}) satisfies PageServerLoad;
