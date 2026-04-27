'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { extractPreviewText } from '@/components/portal/content-editor/utils';
import { resolveR2PublicUrl } from '@/lib/r2';
import { GlassGlow } from '../ui/GlassGlow';
import { GradientBorder } from '../ui/GradientBorder';
import { GradientNumber } from '../ui/GradientNumber';
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

export default function BlogCard({ index, content }: { index: number; content: PublicContent }) {
	const router = useRouter();
	const previewText = extractPreviewText(content.content);
	const thumbnailUrl = resolveR2PublicUrl(content.thumbnail_url);
	const publishedDate = formatContentDate(content.updated_at || content.created_at);
	const displayId = String(index + 1).padStart(2, '0');
	const displayText = content.summary || previewText;
	const authorName = content.author?.name || 'SPCTEK Team';
	const authorId = content.author_id;
	const authorLink = authorId ? `/authors/${authorId}` : null;

	const handleAuthorClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (authorLink) {
			router.push(authorLink);
		}
	};

	return (
		<Link href={`/blogs/${content.slug}`} className="group block">
			<div className="relative rounded-2xl transition duration-300 hover:-translate-y-1">
				<GradientBorder thickness={1.5} radius="24px" />
				<GlassGlow angle={105} opacity={0.3} start={10} end={90} radius="24px" />

				{/* ID Badge */}
				<div className="absolute right-4 top-0 z-30 hidden -translate-y-1/2 sm:right-6 sm:block">
					<GradientNumber value={displayId} width="108px" height="72px" borderRadius="8px" rotation={0} />
				</div>

				<div className="relative z-10 flex flex-col overflow-hidden md:flex-row">
					{thumbnailUrl && (
						/* Changed items-center to items-start to align with top of text */
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

					{/* Changed justify-center to justify-start and matched padding (p-6) */}
					<div className="flex flex-1 flex-col justify-start p-4 sm:p-6 md:pl-2 md:pr-10 md:pt-7">
						<div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
							{authorLink ? (
								<span className="cursor-pointer text-[#a9b2ff] transition hover:text-white" onClick={handleAuthorClick}>
									{authorName}
								</span>
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

						<div>
							<h3 className="line-clamp-2 text-xl font-bold leading-tight text-white transition-colors group-hover:text-[#a9b2ff] sm:text-2xl">
								{content.title}
							</h3>
							{displayText && <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-white/60">{displayText}</p>}
						</div>

						<div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#a9b2ff] opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:translate-x-2 sm:group-hover:opacity-100">
							Read More →
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
