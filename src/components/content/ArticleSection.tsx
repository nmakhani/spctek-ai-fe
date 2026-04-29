import { ContentRenderer } from '@/components/portal/content-editor/ContentRenderer';
import { parseEditorData } from '@/components/portal/content-editor/utils';
import { TableOfContents } from './TableOfContents';
import type { PublicContent } from './types';

export default function ArticleSection({ content }: { content: PublicContent }) {
	const data = parseEditorData(content.content);

	return (
		<div className="px-4 pb-2 md:px-6 lg:px-12">
			<div className="mx-auto max-w-6xl">
				<div className="flex items-stretch gap-8">
					<div className="min-w-0 flex-1">
						<ContentRenderer data={data} title="" />
					</div>
					<aside className="hidden w-64 flex-shrink-0 lg:block">
						<div className="sticky top-24 self-start">
							<TableOfContents content={data} />
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
