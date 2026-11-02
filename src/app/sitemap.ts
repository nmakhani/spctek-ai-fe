import type { MetadataRoute } from 'next';

import { getPublicAuthors, getPublishedContent } from '@/lib/public-content';

export const dynamic = 'force-dynamic';

const PUBLIC_PATHS = [
	{ path: '/', priority: 1, changeFrequency: 'weekly' as const },
	{ path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
	{ path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
	{ path: '/local-ai-setup', priority: 0.8, changeFrequency: 'monthly' as const },
	{ path: '/process-rating', priority: 0.8, changeFrequency: 'monthly' as const },
	{ path: '/automation-workflows', priority: 0.8, changeFrequency: 'monthly' as const },
	{ path: '/blogs', priority: 0.8, changeFrequency: 'weekly' as const },
	{ path: '/case-studies', priority: 0.8, changeFrequency: 'weekly' as const },
	{ path: '/ai-playbook', priority: 0.8, changeFrequency: 'monthly' as const },
	{ path: '/reinstatement', priority: 0.8, changeFrequency: 'monthly' as const },
	{ path: '/privacy-policy', priority: 0.4, changeFrequency: 'monthly' as const },
	{ path: '/terms-of-service', priority: 0.4, changeFrequency: 'monthly' as const },
] as const;

function getSiteUrl() {
	return 'https://spctek.ai';
}

function lastModified(updatedAt?: string, createdAt?: string) {
	const value = updatedAt || createdAt;
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const siteUrl = getSiteUrl();
	const [blogs, studies, authors] = await Promise.all([
		getPublishedContent('BLOG'),
		getPublishedContent('CASE_STUDY'),
		getPublicAuthors(),
	]);

	const staticPages = PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
		url: new URL(path, siteUrl).toString(),
		priority,
		changeFrequency,
	}));
	const contentPages = [...blogs, ...studies].map((content) => ({
		url: new URL(
			`/${content.type === 'BLOG' ? 'blogs' : 'case-studies'}/${encodeURIComponent(content.slug)}`,
			siteUrl
		).toString(),
		lastModified: lastModified(content.updated_at, content.created_at),
	}));
	const authorPages = authors.map((author) => ({
		url: new URL(`/authors/${encodeURIComponent(author.id)}`, siteUrl).toString(),
		lastModified: lastModified(author.updated_at, author.created_at),
	}));
	return [...staticPages, ...contentPages, ...authorPages];
}
