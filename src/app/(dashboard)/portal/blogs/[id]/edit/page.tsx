'use client';

import { useParams } from 'next/navigation';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BlogEditorScreen } from '@/components/portal/blog-editor/BlogEditorScreen';

export default function EditBlogPage() {
	const params = useParams<{ id: string }>();
	const blogId = params?.id;

	if (!blogId) {
		return null;
	}

	return (
		<ProtectedRoute>
			<BlogEditorScreen mode="edit" blogId={blogId} />
		</ProtectedRoute>
	);
}
