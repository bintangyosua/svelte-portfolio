import { notionService } from '$lib/api/notion';
import { NotionRenderer } from '@notion-render/client';
import type { PageServerLoad } from './$types';
import { NOTION_BLOG_DATABASE_ID } from '$env/static/private';

export const load = (async ({ params }) => {
	const pages = await notionService.getPages(NOTION_BLOG_DATABASE_ID, [], {
		property: 'Slug',
		rich_text: {
			contains: ''
		}
	});

	const filteredPage = pages.find(
		(page) =>
			page.properties.Slug &&
			page.properties.Slug.type === 'rich_text' &&
			page.properties.Slug.rich_text[0].plain_text === params.slug
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
