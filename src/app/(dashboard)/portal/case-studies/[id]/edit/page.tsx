'use client';

import { useParams } from 'next/navigation';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BlogEditorScreen } from '@/components/portal/blog-editor/BlogEditorScreen';

export default function EditCaseStudyPage() {
	const params = useParams<{ id: string }>();
	const caseStudyId = params?.id;

	if (!caseStudyId) {
		return null;
	}

	return (
		<ProtectedRoute>
			<BlogEditorScreen
				mode="edit"
				blogId={caseStudyId}
				contentType="CASE_STUDY"
				entityLabel="Case Study"
				backPath="/portal/case-studies"
			/>
		</ProtectedRoute>
	);
}
