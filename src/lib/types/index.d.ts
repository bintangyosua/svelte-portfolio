import type { Color } from './colors';

export type CareerType = {
	company: string;
	position: string;
	start: string;
	end: string;
	place: string;
	projects: string[];
};

export type CardType = {
	name: string;
	start: string;
	end: string;
	description: string[];
	tags: string[];
	description: string;
};

export type PartialSelectResponse = {
	name: string;
	color: Color;
};

export type SortObject =
	| { property: string; direction: 'ascending' | 'descending' }
	| { timestamp: 'created_time' | 'last_edited_time'; direction: 'ascending' | 'descending' };

export type FilterObject =
	| PropertyFilter
	| TimestampCreatedTimeFilter
	| TimestampLastEditedTimeFilter
	| {
			or: Array<
				| PropertyFilter
				| TimestampCreatedTimeFilter
				| TimestampLastEditedTimeFilter
				| { or: Array<PropertyFilter> }
				| { and: Array<PropertyFilter> }
			>;
	  }
	| {
			and: Array<
				| PropertyFilter
				| TimestampCreatedTimeFilter
				| TimestampLastEditedTimeFilter
				| { or: Array<PropertyFilter> }
				| { and: Array<PropertyFilter> }
			>;
	  };
