import 'server-only';

import { cache } from 'react';

import type { PublicContent } from '@/components/content/types';
import type { AuthorRead } from '@/components/portal/content-editor/types';
import type { ContentType } from './api';

// Fetch at request time so publishing or unpublishing does not require a frontend rebuild.
async function getPublicData<T>(path: string, params?: Record<string, string>): Promise<T> {
	const baseUrl =
		process.env.NEXT_PUBLIC_DEV_MODE === '1'
			? process.env.NEXT_PUBLIC_API_URL_DEV
			: process.env.NEXT_PUBLIC_API_URL_PROD;
	if (!baseUrl) throw new Error('The public content API URL is not configured.');
	const url = new URL(`${baseUrl.replace(/\/$/, '')}${path}`);
	url.search = new URLSearchParams(params).toString();
	const response = await fetch(url, { cache: 'no-store' });
	if (!response.ok) throw new PublicContentError(response.status);
	return response.json() as Promise<T>;
}

export class PublicContentError extends Error {
	constructor(public readonly status: number) {
		super(`Public content request failed (${status}).`);
	}
}

export const getPublishedContent = cache(async (type: ContentType, author?: string): Promise<PublicContent[]> => {
	const contents = new Map<string, PublicContent>();
	let skip = 0;
	while (true) {
		const page = await getPublicData<PublicContent[]>('/content', {
			type,
			skip: String(skip),
			limit: '100',
			...(author ? { author } : {}),
		});
		if (!Array.isArray(page)) throw new Error('Unexpected public content response.');
		if (page.length === 0) break;
		const previousSize = contents.size;
		for (const item of page) contents.set(item.id, item);
		if (contents.size === previousSize) throw new Error('The content API did not advance pagination.');
		skip += page.length;
	}
	return [...contents.values()].filter((item) => item.is_published && item.slug);
});

export const getPublicContent = cache((slug: string, type: ContentType) =>
	getPublicData<PublicContent>(`/content/${encodeURIComponent(slug)}`, { type, lookup_field: 'slug' })
);

export const getPublicAuthors = cache(() => getPublicData<AuthorRead[]>('/authors'));
export const getPublicAuthor = cache((id: string) => getPublicData<AuthorRead>(`/authors/${encodeURIComponent(id)}`));
