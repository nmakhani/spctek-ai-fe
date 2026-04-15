import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			allow: '/',
			userAgent: '*',
			disallow: ['/portal', '/portal/'],
		},
		sitemap: 'https://spctek.ai/sitemap.xml',
	};
}
