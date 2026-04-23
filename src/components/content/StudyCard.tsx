'use client';

import Link from 'next/link';
import Image from 'next/image';

import { resolveR2PublicUrl } from '@/lib/r2';
import { extractPreviewText, parseContentPayload } from '@/components/portal/content-editor/utils';

import { GlassGlow } from '../ui/GlassGlow';
import { GradientBorder } from '../ui/GradientBorder';
import { GradientNumber } from '../ui/GradientNumber';

import type { PublicContent } from './types';

function formatContentDate(value?: string) {
	if (!value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export default function StudyCard({ index, content }: { index: number; content: PublicContent }) {
	const previewText = extractPreviewText(content.content);
	const { kpis } = parseContentPayload(content.content);
	const thumbnailUrl = resolveR2PublicUrl(content.thumbnail_url);
	const publishedDate = formatContentDate(content.updated_at || content.created_at);
	const displayText = content.summary || previewText;

	const reversed = index % 2 === 1;

	return (
		<Link
			href={`/case-studies/${content.slug}`}
			className={`group mb-16 block transition-transform duration-500 ${reversed ? 'md:ml-36' : 'md:mr-36'}`}
		>
			<div className="relative rounded-2xl transition duration-300 hover:-translate-y-1">
				<GradientBorder thickness={1.5} radius="24px" />
				<GlassGlow angle={105} opacity={0.3} start={10} end={90} radius="24px" />

				{/* Floating Stats Badges (30% in, 70% out) */}
				<div
					className={`absolute top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 sm:flex ${
						reversed ? '-left-24' : '-right-24'
					}`}
				>
					{kpis.map((item, idx) => (
						<div key={idx} className={idx === 1 ? 'relative mt-4' : 'relative'}>
							<GradientNumber
								value={item.stat || '0%'}
								subValue={item.description}
								width="160px"
								height="80px"
								borderRadius="12px"
								rotation={0}
							/>
						</div>
					))}
				</div>

				<div
					className={`relative z-10 flex flex-col overflow-hidden md:min-h-[380px] ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}
				>
					{/* Square Image Section */}
					{thumbnailUrl && (
						<div className="relative flex w-full shrink-0 items-center p-6 md:w-[40%]">
							<div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-2xl">
								<Image
									src={thumbnailUrl}
									alt={content.title}
									fill
									unoptimized
									className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
								/>
								<div className="pointer-events-none absolute inset-0 z-20">
									<GradientBorder thickness={2} radius="12px" subtle={true} />
								</div>
							</div>
						</div>
					)}

					{/* Content Section */}
					<div
						className={`flex flex-1 flex-col justify-center p-6 md:p-12 ${
							reversed ? 'items-start text-left md:pl-28 md:pr-12' : 'items-end text-right md:pl-12 md:pr-28'
						}`}
					>
						<div>
							<div
								className={`mb-4 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 ${
									!reversed && 'md:justify-end'
								}`}
							>
								<span className="text-[#a9b2ff]">{content.author?.trim() ? content.author : 'SPCTEK Team'}</span>
								{publishedDate && (
									<>
										<span className="h-1 w-1 rounded-full bg-white/20" />
										<span>{publishedDate}</span>
									</>
								)}
							</div>

							<h3 className="line-clamp-2 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-[#a9b2ff] sm:text-4xl">
								{content.title}
							</h3>
							{displayText && (
								<p className="mt-6 line-clamp-3 text-sm leading-relaxed text-white/60 md:text-base">{displayText}</p>
							)}
						</div>

						<div className="mt-8 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#a9b2ff]">
							View Case Study <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
