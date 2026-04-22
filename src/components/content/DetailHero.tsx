'use client';

import Image from 'next/image';
import type { PublicContent } from './types';
import { resolveR2PublicUrl } from '@/lib/r2';

function formatContentDate(value?: string) {
	if (!value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export default function DetailHero({ content }: { content: PublicContent }) {
	const thumbnailUrl = resolveR2PublicUrl(content.thumbnail_url);
	const publishedDate = formatContentDate(content.created_at || content.updated_at);

	return (
		<div className="relative overflow-hidden px-4 pb-8 pt-28 md:px-6 md:pb-10 md:pt-36 lg:px-12">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(125,137,255,0.28)_0%,transparent_42%),radial-gradient(circle_at_82%_6%,rgba(255,255,255,0.14)_0%,transparent_34%)]" />
			<div className="relative mx-auto max-w-5xl rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_40%,rgba(96,107,250,0.11)_100%)] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6 md:p-10">
				<h1 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
					{content.title}
				</h1>
				{content.summary && (
					<p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base md:mt-5 md:text-lg">
						{content.summary}
					</p>
				)}

				<div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
					<span>{content.author?.trim() ? `By ${content.author}` : 'By SPCTEK Team'}</span>
					{publishedDate && <span>{publishedDate}</span>}
				</div>

				{thumbnailUrl && (
					<div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
						<Image
							src={thumbnailUrl}
							alt={content.title}
							width={1200}
							height={675}
							priority
							className="h-auto w-full object-cover"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
