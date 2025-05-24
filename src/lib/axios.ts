import axios from 'axios';
import { NOTION_API_KEY } from '$env/static/private';

const api = axios.create({
	baseURL: 'https://api.notion.com/v1',
	headers: {
		Authorization: `Bearer ${NOTION_API_KEY}`,
		'Notion-Version': '2022-06-28'
	},
	withCredentials: true
});

export default api;
