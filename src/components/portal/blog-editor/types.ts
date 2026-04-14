import type { OutputData } from '@editorjs/editorjs';

export interface Blog {
	id: string;
	title: string;
	slug: string;
	summary?: string;
	thumbnail_url: string;
	content: string;
	author?: string;
	is_published: boolean;
	created_at?: string;
	updated_at?: string;
}

export type BlogFormData = {
	title: string;
	slug: string;
	summary: string;
	author: string;
	thumbnail_url: string;
	is_published: boolean;
};

export const EMPTY_EDITOR_DATA: OutputData = {
	time: 0,
	blocks: [],
	version: '2.31.0',
};

export const EMPTY_BLOG_FORM: BlogFormData = {
	title: '',
	slug: '',
	summary: '',
	author: '',
	thumbnail_url: '',
	is_published: false,
};
