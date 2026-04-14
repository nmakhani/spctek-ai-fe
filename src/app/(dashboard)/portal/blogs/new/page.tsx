'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BlogEditorScreen } from '@/components/portal/blog-editor/BlogEditorScreen';

export default function NewBlogPage() {
	return (
		<ProtectedRoute>
			<BlogEditorScreen mode="create" />
		</ProtectedRoute>
	);
}
