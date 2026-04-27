'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import BlogCard from '@/components/content/BlogCard';
import type { PublicContent } from '@/components/content/types';
import { GlassGlow } from '@/components/ui/GlassGlow';
import { GradientBorder } from '@/components/ui/GradientBorder';
import { authorsApi, contentApi } from '@/lib/api';
import { resolveR2PublicUrl } from '@/lib/r2';

interface AuthorPageProps {
	params: Promise<{
		id: string;
	}>;
}

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

export default function AuthorPage({ params }: AuthorPageProps) {
	const [author, setAuthor] = useState<Author | null>(null);
	const [blogs, setBlogs] = useState<PublicContent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [authorId, setAuthorId] = useState<string>('');

	useEffect(() => {
		const unwrapParams = async () => {
			const resolvedParams = await params;
			setAuthorId(resolvedParams.id);
		};

		void unwrapParams();
	}, [params]);

	useEffect(() => {
		if (!authorId) return;

		let isMounted = true;

		const fetchData = async () => {
			try {
				setLoading(true);
				const [authorResponse, blogsResponse] = await Promise.all([
					authorsApi.get(authorId),
					contentApi.list({ type: 'BLOG', author: authorId }),
				]);

				if (!isMounted) return;

				setAuthor(authorResponse.data as Author);
				setBlogs((blogsResponse.data as PublicContent[]).filter((blog) => blog.is_published));
				setError('');
			} catch (err: unknown) {
				if (!isMounted) return;
				setError(err instanceof Error ? err.message : 'Failed to load author');
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		void fetchData();

		return () => {
			isMounted = false;
		};
	}, [authorId]);

	if (loading) {
		return (
			<div className="noise-overlay flex min-h-screen items-center justify-center">
				<div className="text-white/60">Loading author...</div>
			</div>
		);
	}

	if (error || !author) {
		return (
			<div className="noise-overlay flex min-h-screen items-center justify-center">
				<div className="text-red-400">{error || 'Author not found'}</div>
			</div>
		);
	}

	const profilePictureUrl = author.profile_picture_url ? resolveR2PublicUrl(author.profile_picture_url) : null;

	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				{/* Content Section */}
				<section className="px-4 py-12 pt-28 md:px-6 lg:px-12">
					<div className="mx-auto max-w-7xl">
						<div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-16">
							{/* Left: About and Blogs */}
							<div className="space-y-12">
								{/* About Section */}
								{author.about && (
									<div className="relative">
										<GradientBorder thickness={1.5} radius="24px" />
										<GlassGlow angle={105} opacity={0.3} start={10} end={90} radius="24px" />
										<div className="relative rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_40%,rgba(96,107,250,0.11)_100%)] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 md:p-10">
											<h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">
												About <span className="text-[#606bfa]">{author.name}</span>
											</h2>
											<p className="whitespace-pre-wrap leading-relaxed text-white/80">{author.about}</p>
										</div>
									</div>
								)}

								{/* Blogs Section */}
								<div>
									<h2 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">
										Articles by <span className="text-[#606bfa]">{author.name}</span>
									</h2>
									{blogs.length === 0 ? (
										<div className="relative">
											<GradientBorder thickness={1.5} radius="24px" />
											<GlassGlow angle={105} opacity={0.3} start={10} end={90} radius="24px" />
											<div className="relative rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_40%,rgba(96,107,250,0.11)_100%)] p-6 text-center shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 md:p-10">
												<p className="text-white/60">No articles published yet.</p>
											</div>
										</div>
									) : (
										<div className="flex flex-col gap-12">
											{blogs.map((blog, index) => (
												<BlogCard key={blog.id} content={blog} index={index} />
											))}
										</div>
									)}
								</div>
							</div>

							{/* Right: Profile Card */}
							<div className="lg:sticky lg:top-10">
								<div className="relative">
									<GradientBorder thickness={1.5} radius="24px" />
									<GlassGlow angle={105} opacity={0.3} start={10} end={90} radius="24px" />
									<div className="relative rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_40%,rgba(96,107,250,0.11)_100%)] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
										{/* Profile Picture */}
										{profilePictureUrl ? (
											<div className="relative mb-6 aspect-square overflow-hidden rounded-2xl">
												<Image src={profilePictureUrl} alt={author.name} fill unoptimized className="object-cover" />
											</div>
										) : (
											<div className="mb-6 flex aspect-square items-center justify-center rounded-2xl bg-white/10">
												<span className="text-4xl font-bold text-white/30">{author.name.charAt(0).toUpperCase()}</span>
											</div>
										)}

										{/* Author Info */}
										<h3 className="text-xl font-semibold text-white">{author.name}</h3>
										{author.position && <p className="mt-1 text-sm text-[#a9b2ff]">{author.position}</p>}
										{author.organization && <p className="text-sm text-white/50">{author.organization}</p>}

										{/* Social Links */}
										{author.social_links && Object.keys(author.social_links).length > 0 && (
											<div className="mt-6 space-y-3">
												<h4 className="text-sm font-semibold text-white/80">Connect</h4>
												{Object.entries(author.social_links).map(([platform, url]) => (
													<a
														key={platform}
														href={url}
														target="_blank"
														rel="noopener noreferrer"
														className="block rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
													>
														{platform.charAt(0).toUpperCase() + platform.slice(1)}
													</a>
												))}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
