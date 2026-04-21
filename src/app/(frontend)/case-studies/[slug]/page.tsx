'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { contentApi } from '@/lib/api';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { DetailHero, ArticleSection, type PublicBlog } from '@/components/blog';

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export default function CaseStudyDetailPage() {
	const params = useParams<{ slug: string }>();
	const slug = params?.slug || '';
	const [items, setItems] = useState<PublicBlog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!slug) {
			return;
		}

		let isMounted = true;

		const fetchItems = async () => {
			try {
				setLoading(true);
				const response = await contentApi.list({ type: 'CASE_STUDY' });
				if (!isMounted) {
					return;
				}
				setItems(response.data as PublicBlog[]);
				setError('');
			} catch (err: unknown) {
				if (!isMounted) {
					return;
				}
				setError(getErrorMessage(err, 'Failed to load case study'));
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		void fetchItems();

		return () => {
			isMounted = false;
		};
	}, [slug]);

	const caseStudy = useMemo(() => {
		if (!slug) {
			return null;
		}
		return items.find((item) => item.slug === slug && item.is_published) ?? null;
	}, [items, slug]);

	if (loading || !slug) {
		return (
			<div className="noise-overlay relative flex min-h-screen flex-col">
				<main className="flex flex-1 items-center justify-center px-4 pt-24 text-white/65 md:px-6">
					Loading case study...
				</main>
			</div>
		);
	}

	if (error) {
		return (
			<div className="noise-overlay relative flex min-h-screen flex-col">
				<main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-4 pt-24 md:px-6">
					<div className="border-red-300/35 bg-red-500/18 text-red-200 rounded-2xl border px-5 py-4">{error}</div>
				</main>
			</div>
		);
	}

	if (!caseStudy) {
		return (
			<div className="noise-overlay relative flex min-h-screen flex-col">
				<main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pt-24 text-center md:px-6">
					<h1 className="text-3xl font-semibold text-white">Case study not found</h1>
					<p className="mt-3 text-white/65">This case study is unavailable or not published yet.</p>
					<Link
						href="/case-studies"
						className="mt-6 rounded-xl bg-[#606bfa] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6f79ff]"
					>
						Back to Case Studies
					</Link>
				</main>
			</div>
		);
	}

	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				<section id="hero">
					<DetailHero blog={caseStudy} eyebrow="SPCTEK Case Study" />
				</section>
				<SectionDivider />
				<section id="article">
					<ArticleSection blog={caseStudy} />
				</section>
			</main>
		</div>
	);
}
