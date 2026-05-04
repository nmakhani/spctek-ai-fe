import { cache } from 'react';
import { notFound } from 'next/navigation';

import type { PublicContent } from '@/components/content/types';
import { contentApi } from '@/lib/api';
import { generateMetadata as generateSeoMetadata } from '@/lib/metadata';
import DetailClient from './DetailClient';

export const getBlogData = cache(async (slug: string) => {
	const response = await contentApi.get(slug, 'BLOG', 'slug');
	return response.data as PublicContent;
});

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params;

	try {
		const blog = await getBlogData(slug);
		const metaTitle = typeof blog.meta_tags?.title === 'string' ? blog.meta_tags.title : blog.title;
		const metaDescription =
			typeof blog.meta_tags?.description === 'string' ? blog.meta_tags.description : (blog.summary ?? '');

		return generateSeoMetadata({
			title: metaTitle,
			description: metaDescription,
			pageUrl: `blogs/${slug}`,
			type: 'article',
		});
	} catch {
		return { title: 'Post Not Found' };
	}
}

export default async function Page({ params }: Props) {
	const { slug } = await params;

	let blog: PublicContent | null = null;

	try {
		blog = await getBlogData(slug);
	} catch {
		notFound();
	}

	if (!blog || !blog.is_published) {
		notFound();
	}

	return <DetailClient initialBlog={blog} />;
}
