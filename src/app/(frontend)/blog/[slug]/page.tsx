'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { blogsApi } from '@/lib/api';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { DetailHero, ArticleSection, type PublicBlog } from '@/components/blog';

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export default function DetailPage() {
	const params = useParams<{ slug: string }>();
	const slug = params?.slug || '';
	const [blogs, setBlogs] = useState<PublicBlog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!slug) {
			return;
		}

		let isMounted = true;

		const fetchBlogs = async () => {
			try {
				setLoading(true);
				const response = await blogsApi.list();
				if (!isMounted) {
					return;
				}
				setBlogs(response.data as PublicBlog[]);
				setError('');
			} catch (err: unknown) {
				if (!isMounted) {
					return;
				}
				setError(getErrorMessage(err, 'Failed to load blog'));
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		void fetchBlogs();

		return () => {
			isMounted = false;
		};
	}, [slug]);

	const blog = useMemo(() => {
		if (!slug) {
			return null;
		}
		return blogs.find((item) => item.slug === slug && item.is_published) ?? null;
	}, [blogs, slug]);

	if (loading || !slug) {
		return (
			<div className="noise-overlay relative flex min-h-screen flex-col">
				<main className="flex flex-1 items-center justify-center px-6 pt-24 text-white/65">Loading article...</main>
			</div>
		);
	}

	if (error) {
		return (
			<div className="noise-overlay relative flex min-h-screen flex-col">
				<main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-6 pt-24">
					<div className="border-red-300/35 bg-red-500/18 text-red-200 rounded-2xl border px-5 py-4">{error}</div>
				</main>
			</div>
		);
	}

	if (!blog) {
		return (
			<div className="noise-overlay relative flex min-h-screen flex-col">
				<main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pt-24 text-center">
					<h1 className="text-3xl font-semibold text-white">Blog not found</h1>
					<p className="mt-3 text-white/65">This article is unavailable or not published yet.</p>
					<Link
						href="/blog"
						className="mt-6 rounded-xl bg-[#606bfa] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6f79ff]"
					>
						Back to Blogs
					</Link>
				</main>
			</div>
		);
	}

	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				<section id="hero">
					<DetailHero blog={blog} />
				</section>
				<SectionDivider />
				<section id="article">
					<ArticleSection blog={blog} />
				</section>
			</main>
		</div>
	);
}
