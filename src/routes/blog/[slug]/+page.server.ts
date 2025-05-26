import { notionService } from '$lib/api/notion';
import { NotionRenderer } from '@notion-render/client';
import type { PageServerLoad } from './$types';
import { NOTION_API_KEY, NOTION_BLOG_DATABASE_ID } from '$env/static/private';
import hljs from '@notion-render/hljs-plugin';
import { Client } from '@notionhq/client';

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

		const client = new Client({ auth: NOTION_API_KEY });
		const renderer = new NotionRenderer({ client });

		renderer.use(hljs({}));

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
