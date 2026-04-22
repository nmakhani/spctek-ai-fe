'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ContentEditorScreen } from '@/components/portal/content-editor/ContentEditorScreen';

export default function NewBlogPage() {
	return (
		<ProtectedRoute>
			<ContentEditorScreen mode="create" contentType="BLOG" entityLabel="Blog" backPath="/portal/blogs" />
		</ProtectedRoute>
	);
}
