'use client';

import { useParams } from 'next/navigation';

import { ContentEditorScreen } from '@/components/portal/content-editor/ContentEditorScreen';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function EditCaseStudyPage() {
	const params = useParams<{ id: string }>();
	const caseStudyId = params?.id;

	if (!caseStudyId) {
		return null;
	}

	return (
		<ProtectedRoute>
			<ContentEditorScreen
				mode="edit"
				contentId={caseStudyId}
				contentType="CASE_STUDY"
				entityLabel="Case Study"
				backPath="/portal/case-studies"
			/>
		</ProtectedRoute>
	);
}
