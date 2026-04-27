import { ContentRenderer } from '@/components/portal/content-editor/ContentRenderer';
import { parseEditorData } from '@/components/portal/content-editor/utils';
import type { PublicContent } from './types';

export default function ArticleSection({ content }: { content: PublicContent }) {
	const data = parseEditorData(content.content);

	return (
		<div className="px-4 pb-2 md:px-6 lg:px-12">
			<div className="mx-auto max-w-5xl">
				<ContentRenderer data={data} title="" />
			</div>
		</div>
	);
}
