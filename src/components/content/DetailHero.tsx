'use client';

import Image from 'next/image';
import Link from 'next/link';

import { resolveR2PublicUrl } from '@/lib/r2';
import type { PublicContent } from './types';

function formatContentDate(value?: string) {
	if (!value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export default function DetailHero({ content }: { content: PublicContent }) {
	const thumbnailUrl = resolveR2PublicUrl(content.thumbnail_url);
	const publishedDate = formatContentDate(content.created_at || content.updated_at);
	const authorName = content.author?.name || 'SPCTEK Team';
	const authorPosition = content.author?.position;
	const authorPictureUrl = content.author?.profile_picture_url
		? resolveR2PublicUrl(content.author.profile_picture_url)
		: null;
	const authorId = content.author_id;
	const authorLink = authorId ? `/authors/${authorId}` : null;

	return (
		<div className="relative overflow-hidden px-4 pb-8 pt-28 md:px-6 md:pb-10 md:pt-36 lg:px-12">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(125,137,255,0.28)_0%,transparent_42%),radial-gradient(circle_at_82%_6%,rgba(255,255,255,0.14)_0%,transparent_34%)]" />
			<div className="relative mx-auto max-w-6xl rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_40%,rgba(96,107,250,0.11)_100%)] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6 md:p-10">
				<h1 className="mt-4 text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
					{content.title}
				</h1>
				{content.summary && (
					<p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base md:mt-5 md:text-lg">
						{content.summary}
					</p>
				)}

				{authorLink && (
					<div className="mt-6 flex items-center justify-between gap-4">
						<Link
							href={authorLink}
							className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 transition hover:bg-white/10 hover:text-white"
						>
							{authorPictureUrl ? (
								<div className="relative h-8 w-8 overflow-hidden rounded-full">
									<Image src={authorPictureUrl} alt={authorName} fill unoptimized className="object-cover" />
								</div>
							) : (
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
									<span className="text-sm font-bold text-white/50">{authorName.charAt(0).toUpperCase()}</span>
								</div>
							)}
							<div className="flex flex-col">
								<span className="font-medium text-white">{authorName}</span>
								{authorPosition && <span className="text-xs text-white/60">{authorPosition}</span>}
							</div>
						</Link>
						{publishedDate && <div className="text-sm text-white/60">{publishedDate}</div>}
					</div>
				)}
				{!authorLink && (
					<div className="mt-6 flex items-center justify-between gap-4">
						<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
							<span>By {authorName}</span>
						</div>
						{publishedDate && <div className="text-sm text-white/60">{publishedDate}</div>}
					</div>
				)}
				{thumbnailUrl && (
					<div className="mt-8 flex justify-center overflow-hidden">
						<Image
							src={thumbnailUrl}
							alt={content.title}
							width={1200}
							height={675}
							priority
							className="h-auto w-full max-w-[60%] object-cover"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
