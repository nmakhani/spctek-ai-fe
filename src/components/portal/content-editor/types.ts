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
	author?: AuthorRead;
	author_id?: string;
	type: ContentType;
	is_published: boolean;
	categories?: Category[];
	created_at?: string;
	updated_at?: string;
}

export interface AuthorRead {
	id: string;
	name: string;
	profile_picture_url?: string | null;
	about?: string | null;
	organization?: string | null;
	position?: string | null;
	social_links?: Record<string, string>;
	created_at: string;
	updated_at: string;
}

export type CaseStudyKpi = {
	stat: string;
	description: string;
};

export type ContentFormData = {
	title: string;
	slug: string;
	summary: string;
	author_id: string;
	thumbnail_url: string;
	is_published: boolean;
	category_ids: string[];
	kpis: CaseStudyKpi[];
};

export const EMPTY_KPIS: CaseStudyKpi[] = [
	{ stat: '', description: '' },
	{ stat: '', description: '' },
];

export const EMPTY_EDITOR_DATA: OutputData = {
	time: 0,
	blocks: [],
	version: '2.31.0',
};

export const EMPTY_CONTENT_FORM: ContentFormData = {
	title: '',
	slug: '',
	summary: '',
	author_id: '',
	thumbnail_url: '',
	is_published: false,
	category_ids: [],
	kpis: EMPTY_KPIS.map((item) => ({ ...item })),
};
