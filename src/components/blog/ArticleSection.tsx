import { BlogRenderer } from '@/components/portal/blog-editor/BlogRenderer';
import { parseEditorData } from '@/components/portal/blog-editor/utils';

import type { PublicBlog } from './types';

interface BlogArticleSectionProps {
	blog: PublicBlog;
}

export default function BlogArticleSection({ blog }: BlogArticleSectionProps) {
	const data = parseEditorData(blog.content);

	return (
		<div className="px-4 pb-2 md:px-6 lg:px-12">
			<div className="mx-auto max-w-5xl">
				<BlogRenderer data={data} title="" />
			</div>
		</div>
	);
}
