import Newsletter from '../generic-sections/Newsletter';
import { extractHeadingsWithIds } from '../portal/content-editor/utils';
import { TableOfContents } from './TableOfContents';
import type { PublicContent } from './types';

export default function ArticleSection({ content }: { content: PublicContent }) {
	const { htmlWithIds, headings } = extractHeadingsWithIds(content.content);

	return (
		<div className="px-4 pb-2 md:px-6 lg:px-12">
			<div className="mx-auto max-w-[96rem]">
				<div className="flex items-stretch gap-8">
					<aside className="hidden w-64 flex-shrink-0 lg:block">
						<div className="sticky top-24 self-start">
							<TableOfContents headings={headings} />
						</div>
					</aside>
					<div className="min-w-0 flex-1">
						<div
							className="prose prose-invert w-full max-w-none rounded-2xl border border-white/15 bg-white/[0.04] p-6 prose-h1:text-lg prose-h1:font-semibold prose-h1:leading-normal prose-h1:text-white sm:prose-h1:text-xl md:p-8 md:prose-h1:text-2xl lg:prose-h1:text-2xl"
							dangerouslySetInnerHTML={{ __html: htmlWithIds }}
						/>
					</div>
					<aside className="hidden w-64 flex-shrink-0 lg:block">
						<div className="sticky top-24 self-start">
							<Newsletter compact />
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
