'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ContentEditorScreen } from '@/components/portal/content-editor/ContentEditorScreen';

export default function NewCaseStudyPage() {
	return (
		<ProtectedRoute>
			<ContentEditorScreen
				mode="create"
				contentType="CASE_STUDY"
				entityLabel="Case Study"
				backPath="/portal/case-studies"
			/>
		</ProtectedRoute>
	);
}
