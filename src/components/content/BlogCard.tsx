'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { resolveR2PublicUrl } from '@/lib/r2';
import { GlassGlow } from '../ui/GlassGlow';
import { GradientBorder } from '../ui/GradientBorder';
import type { PublicContent } from './types';

function formatContentDate(value?: string) {
	if (!value) {
		return null;
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export default function BlogCard({ content }: { index: number; content: PublicContent }) {
	const router = useRouter();
	const publishedDate = formatContentDate(content.created_at);
	const thumbnailUrl = resolveR2PublicUrl(content.thumbnail_url);

	const authorLink = `/authors/${content.author_id}`;
	const authorName = content.author?.name || 'SPCTEK Team';

	const categories = content.categories || [];
	const displayedCategories = categories.slice(0, 2);
	const remainingCount = categories.length - displayedCategories.length;

	return (
		<div onClick={() => router.push(`/blogs/${content.slug}`)} className="group block cursor-pointer">
			<div className="relative rounded-2xl transition duration-300 hover:-translate-y-1">
				<GradientBorder thickness={1.5} radius="24px" />
				<GlassGlow angle={105} opacity={0.3} start={10} end={90} radius="24px" />

				<div className="relative z-10 flex flex-col overflow-hidden md:flex-row">
					{thumbnailUrl && (
						<div className="relative flex w-full shrink-0 items-start p-4 sm:p-6 md:w-[42%]">
							<div className="relative aspect-video w-full overflow-hidden rounded-xl md:aspect-[4/3]">
								<Image
									src={thumbnailUrl}
									alt={content.title}
									fill
									unoptimized
									className="object-cover opacity-90 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
								/>
								<div className="pointer-events-none absolute inset-0 z-20">
									<GradientBorder thickness={2} radius="12px" subtle={true} />
								</div>
							</div>
						</div>
					)}

					<div className="flex flex-1 flex-col justify-start p-4 sm:p-6 md:pl-2 md:pr-10 md:pt-7">
						<div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
							{authorLink ? (
								<Link
									target="_blank"
									href={authorLink}
									onClick={(e) => e.stopPropagation()}
									className="z-30 text-[#a9b2ff] transition hover:text-white"
								>
									{authorName}
								</Link>
							) : (
								<span className="text-[#a9b2ff]">{authorName}</span>
							)}

							{publishedDate && (
								<>
									<span className="h-1 w-1 rounded-full bg-white/20" />
									<span>{publishedDate}</span>
								</>
							)}
						</div>

						{categories.length > 0 && (
							<div className="mb-3 flex flex-wrap gap-2">
								{displayedCategories.map((category) => (
									<span
										key={category.id}
										className="rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-3 py-1 text-[11px] font-medium text-[#cfd5ff]"
									>
										{category.name}
									</span>
								))}
								{remainingCount > 0 && (
									<span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/60">
										+{remainingCount} more
									</span>
								)}
							</div>
						)}

						<div className="flex flex-col">
							<h3 className="line-clamp-2 text-xl font-bold leading-tight text-white transition-colors group-hover:text-[#a9b2ff] sm:text-2xl">
								{content.title}
							</h3>
							{content.summary && (
								<div className="mt-3">
									<p className="line-clamp-3 text-sm leading-relaxed text-white/60">{content.summary}</p>

									<div className="mt-2 inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#a9b2ff] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										Read More →
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
