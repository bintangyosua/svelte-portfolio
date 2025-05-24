import { NOTION_API_KEY, NOTION_BLOG_DATABASE_ID } from '$env/static/private';
import { Client } from '@notionhq/client';
import type {
	DatabaseObjectResponse,
	PageObjectResponse,
	PartialDatabaseObjectResponse,
	PartialPageObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: NOTION_API_KEY });

// Type guard to check if page is a full PageObjectResponse
function isFullPage(
	page:
		| PartialPageObjectResponse
		| PageObjectResponse
		| PartialDatabaseObjectResponse
		| DatabaseObjectResponse
): page is PageObjectResponse {
	return 'properties' in page;
}

export const notionService = {
	async getPages(NOTION_DATABASE_ID: string): Promise<PageObjectResponse[]> {
		const response = await notion.databases.query({
			database_id: NOTION_DATABASE_ID
		});

		// Filter out partial pages and return only full pages
		const fullPages = response.results.filter(isFullPage);

		return fullPages;
	},

	async getBlocks(block_id: string) {
		let { results: children } = await notion.blocks.children.list({ block_id });

		// for (const child of children) {
		// 	const grandchildren = await this.getBlocks(child.id);
		// 	(child as any).children = grandchildren; // Bypass type checking
		// }

		return children;
	}
};
