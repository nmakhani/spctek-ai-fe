import { cache } from 'react';
import { notFound } from 'next/navigation';

import type { PublicContent } from '@/components/content/types';
import { authorsApi, contentApi } from '@/lib/api';
import { generateMetadata as generateSeoMetadata } from '@/lib/metadata';
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
	const [authorResponse, blogsResponse] = await Promise.all([
		authorsApi.get(id),
		contentApi.list({ type: 'BLOG', author: id }),
	]);

	return {
		author: authorResponse.data as Author,
		blogs: (blogsResponse.data as PublicContent[]).filter((blog) => blog.is_published),
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
	} catch {
		notFound();
	}

	if (!author) {
		notFound();
	}

	return <DetailClient initialAuthor={author} initialBlogs={blogs} />;
}
