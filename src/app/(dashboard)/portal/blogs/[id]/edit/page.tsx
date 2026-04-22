'use client';

import { useParams } from 'next/navigation';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ContentEditorScreen } from '@/components/portal/content-editor/ContentEditorScreen';

export default function EditBlogPage() {
	const params = useParams<{ id: string }>();
	const blogId = params?.id;

	if (!blogId) {
		return null;
	}

	return (
		<ProtectedRoute>
			<ContentEditorScreen
				mode="edit"
				contentId={blogId}
				contentType="BLOG"
				entityLabel="Blog"
				backPath="/portal/blogs"
			/>
		</ProtectedRoute>
	);
}
