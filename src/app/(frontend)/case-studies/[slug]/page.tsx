import { cache } from 'react';
import { notFound } from 'next/navigation';

import type { PublicContent } from '@/components/content/types';
import { contentApi } from '@/lib/api';
import { generateMetadata as generateSeoMetadata } from '@/lib/metadata';
import DetailClient from './DetailClient';

export const getCaseStudyData = cache(async (slug: string) => {
	const response = await contentApi.get(slug, 'CASE_STUDY', 'slug');
	return response.data as PublicContent;
});

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { slug } = await params;

	try {
		const caseStudy = await getCaseStudyData(slug);

		return generateSeoMetadata({
			title: caseStudy.title,
			description: caseStudy.summary || '',
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
	} catch {
		notFound();
	}

	if (!caseStudy || !caseStudy.is_published) {
		notFound();
	}

	return <DetailClient initialCaseStudy={caseStudy} />;
}
