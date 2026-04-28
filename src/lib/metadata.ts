import { metadeckApi } from './api';

interface MetadataParams {
	title: string;
	description: string;
	pageUrl: string;
	type?: 'website' | 'article';
}

interface MetadeckEntry {
	id: string;
	path: string;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
}

// Cache for metadeck data
let metadeckCache: Map<string, { title: string; description: string }> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchMetadeckCache(): Promise<Map<string, { title: string; description: string }>> {
	const now = Date.now();

	// Return cached data if still valid
	if (metadeckCache && now - cacheTimestamp < CACHE_DURATION) {
		return metadeckCache;
	}

	try {
		const response = await metadeckApi.list();
		const entries = response.data as MetadeckEntry[];

		const cache = new Map<string, { title: string; description: string }>();
		for (const entry of entries) {
			cache.set(entry.path, { title: entry.title, description: entry.description });
		}

		metadeckCache = cache;
		cacheTimestamp = now;
		return cache;
	} catch (error) {
		console.error('Failed to fetch metadeck data:', error);
		return new Map();
	}
}

export async function getPageMetadata(path: string): Promise<{ title: string; description: string } | null> {
	const cache = await fetchMetadeckCache();
	return cache.get(path) || null;
}

export async function generateStaticMetadata(path: string) {
	const metadata = await getPageMetadata(path);

	const title = metadata?.title || 'SPCTEK.AI';
	const description = metadata?.description || 'AI-native operations platform.';

	return generateMetadata({
		title,
		description,
		pageUrl: path.replace(/^\//, ''),
		type: 'website',
	});
}

export function generateMetadata({ title, description, pageUrl, type = 'website' }: MetadataParams) {
	const url = `https://spctek.ai/${pageUrl}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url,
			siteName: 'SPCTEK.AI',
			locale: 'en_US',
			type,
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
		},
	};
}
