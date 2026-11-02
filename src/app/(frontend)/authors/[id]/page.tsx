import { cache } from 'react';
import { notFound } from 'next/navigation';

import type { PublicContent } from '@/components/content/types';
import { generateMetadata as generateSeoMetadata } from '@/lib/metadata';
import { getPublicAuthor, getPublishedContent, PublicContentError } from '@/lib/public-content';
import DetailClient from './DetailClient';

interface Author {
	id: string;
	name: string;
	profile_picture_url: string | null;
	about: string | null;
	organization: string | null;
	position: string | null;
	social_links: Record<string, string> | null;
	created_at: string;
	updated_at: string;
}

export const getAuthorData = cache(async (id: string) => {
	// The API expects UUIDs; invalid route parameters are missing pages, not API failures.
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
	const [authorResponse, blogsResponse] = await Promise.all([getPublicAuthor(id), getPublishedContent('BLOG', id)]);

	return {
		author: authorResponse as Author,
		blogs: blogsResponse,
	};
});

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;

	try {
		const { author } = await getAuthorData(id);

		return generateSeoMetadata({
			title: author.name,
			description: author.about || `Articles by ${author.name}`,
			pageUrl: `authors/${id}`,
			type: 'website',
		});
	} catch {
		return { title: 'Author Not Found' };
	}
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	let author: Author | null = null;
	let blogs: PublicContent[] = [];

	try {
		const data = await getAuthorData(id);
		author = data.author;
		blogs = data.blogs;
	} catch (error) {
		if (error instanceof PublicContentError && error.status === 404) notFound();
		throw error;
	}

	if (!author) {
		notFound();
	}

	return <DetailClient initialAuthor={author} initialBlogs={blogs} />;
}
