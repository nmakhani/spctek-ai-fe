import Image from 'next/image';

import { resolveR2PublicUrl } from '@/lib/r2';
import Newsletter from '../generic-sections/Newsletter';
import { extractHeadingsWithIds } from '../portal/content-editor/utils';
import { TableOfContents } from './TableOfContents';
import type { PublicContent } from './types';

export default function ArticleSection({ content }: { content: PublicContent }) {
	const { htmlWithIds, headings } = extractHeadingsWithIds(content.content);
	const thumbnailUrl = content.thumbnail_url ? resolveR2PublicUrl(content.thumbnail_url) : '';

	return (
		<div className="px-4 pb-2 md:px-6 lg:px-12">
			<div className="mx-auto max-w-[120rem]">
				<div className="mb-6 lg:hidden">
					<TableOfContents headings={headings} />
				</div>

				{/* 2. Adjusted grid columns: Slimmer sidebars (14rem/16rem) and larger center */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-[14rem_minmax(0,1fr)_14rem] xl:grid-cols-[16rem_minmax(0,1fr)_16rem]">
					<aside className="hidden lg:block">
						<div className="sticky top-24 self-start">
							<TableOfContents headings={headings} />
						</div>
					</aside>

					{/* 1. Content Container */}
					<div className="min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
						{/* 1. Moved Image inside the main container, removed bottom margin to sit flush */}
						{thumbnailUrl && (
							<div className="rounded-2xl border-b border-white/15">
								<Image
									src={thumbnailUrl}
									alt={content.title}
									width={1600}
									height={900}
									priority
									className="h-auto w-full object-cover"
								/>
							</div>
						)}

						<div
							className="prose prose-invert w-full max-w-none p-8 prose-h1:text-lg prose-h1:font-semibold prose-h1:leading-normal prose-h1:text-white sm:prose-h1:text-xl md:p-8 md:prose-h1:text-2xl lg:prose-h1:text-2xl"
							dangerouslySetInnerHTML={{ __html: htmlWithIds }}
						/>
					</div>

					<aside className="hidden lg:block">
						<div className="sticky top-24 self-start">
							<Newsletter compact />
						</div>
					</aside>
				</div>

				<div className="mt-8 lg:hidden">
					<Newsletter compact />
				</div>
			</div>
		</div>
	);
}
