import { cache } from 'react';
import { notFound } from 'next/navigation';

import type { PublicContent } from '@/components/content/types';
import { generateMetadata as generateSeoMetadata } from '@/lib/metadata';
import { getPublicContent, PublicContentError } from '@/lib/public-content';
import DetailClient from './DetailClient';

export const getCaseStudyData = cache(async (slug: string) => {
	return getPublicContent(slug, 'CASE_STUDY');
});

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params;

	try {
		const caseStudy = await getCaseStudyData(slug);
		const metaTitle = typeof caseStudy.meta_tags?.title === 'string' ? caseStudy.meta_tags.title : caseStudy.title;
		const metaDescription =
			typeof caseStudy.meta_tags?.description === 'string'
				? caseStudy.meta_tags.description
				: (caseStudy.summary ?? '');

		return generateSeoMetadata({
			title: metaTitle,
			description: metaDescription,
			pageUrl: `case-studies/${slug}`,
			type: 'article',
		});
	} catch {
		return { title: 'Case Study Not Found' };
	}
}

export default async function Page({ params }: Props) {
	const { slug } = await params;

	let caseStudy: PublicContent | null = null;

	try {
		caseStudy = await getCaseStudyData(slug);
	} catch (error) {
		if (error instanceof PublicContentError && error.status === 404) notFound();
		throw error;
	}

	if (!caseStudy || !caseStudy.is_published) {
		notFound();
	}

	return <DetailClient initialCaseStudy={caseStudy} />;
}
