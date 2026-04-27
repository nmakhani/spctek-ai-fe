'use client';

import { ContentEditorScreen } from '@/components/portal/content-editor/ContentEditorScreen';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function NewBlogPage() {
	return (
		<ProtectedRoute>
			<ContentEditorScreen mode="create" contentType="BLOG" entityLabel="Blog" backPath="/portal/blogs" />
		</ProtectedRoute>
	);
}
