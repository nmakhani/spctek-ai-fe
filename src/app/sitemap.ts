import type { MetadataRoute } from 'next';

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

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = getSiteUrl();

	return PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
		url: new URL(path, siteUrl).toString(),
		priority,
		changeFrequency,
		lastModified: new Date(),
	}));
}
