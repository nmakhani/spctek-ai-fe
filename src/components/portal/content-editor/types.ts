import type { OutputData } from '@editorjs/editorjs';
import type { ContentType } from '@/lib/api';

export interface Category {
	id: string;
	name: string;
	slug: string;
}

export interface Content {
	id: string;
	title: string;
	slug: string;
	summary?: string;
	thumbnail_url: string;
	content: string;
	author?: string;
	type: ContentType;
	is_published: boolean;
	categories?: Category[];
	created_at?: string;
	updated_at?: string;
}

export type ContentFormData = {
	title: string;
	slug: string;
	summary: string;
	author: string;
	thumbnail_url: string;
	is_published: boolean;
	category_ids: string[];
};

export const EMPTY_EDITOR_DATA: OutputData = {
	time: 0,
	blocks: [],
	version: '2.31.0',
};

export const EMPTY_CONTENT_FORM: ContentFormData = {
	title: '',
	slug: '',
	summary: '',
	author: '',
	thumbnail_url: '',
	is_published: false,
	category_ids: [],
};
