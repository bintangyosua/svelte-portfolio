import { notionService } from '$lib/api/notion';
import { NotionRenderer } from '@notion-render/client';
import type { PageServerLoad } from './$types';
import { NOTION_BLOG_DATABASE_ID } from '$env/static/private';

export const load = (async ({ params }) => {
	const pages = await notionService.getPages(NOTION_BLOG_DATABASE_ID);

	const filteredPage = pages.find(
		(page) =>
			page.properties.Slug &&
			page.properties.Slug.type === 'url' &&
			page.properties.Slug.url === params.slug
	);

	if (filteredPage) {
		const page = (await notionService.getBlocks(filteredPage.id)) as any;

		const renderer = new NotionRenderer();

		const html = await renderer.render(...page);

		return {
			html,
			page: filteredPage
		};
	} else {
		return {
			page: null
		};
	}
}) satisfies PageServerLoad;
