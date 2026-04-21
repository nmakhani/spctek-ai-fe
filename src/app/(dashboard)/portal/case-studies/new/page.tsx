'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BlogEditorScreen } from '@/components/portal/blog-editor/BlogEditorScreen';

export default function NewCaseStudyPage() {
	return (
		<ProtectedRoute>
			<BlogEditorScreen
				mode="create"
				contentType="CASE_STUDY"
				entityLabel="Case Study"
				backPath="/portal/case-studies"
			/>
		</ProtectedRoute>
	);
}
