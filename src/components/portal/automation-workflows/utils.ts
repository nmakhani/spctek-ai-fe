import { uploadFileToR2 } from '@/lib/r2';
import type { AutomationWorkflow, WorkflowFormData, WorkflowPayload } from './types';

export const EMPTY_WORKFLOW_FORM: WorkflowFormData = {
	name: '',
	teaser: '',
	workflowClass: 'system',
	descriptionBody: '',
	descriptionBullets: '',
	link: '',
	thumbnailUrl: '',
	thumbnailFile: null,
	categoryIds: [],
};

export function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export function workflowToFormData(workflow: AutomationWorkflow): WorkflowFormData {
	return {
		name: workflow.name,
		teaser: workflow.teaser,
		workflowClass: workflow.class,
		descriptionBody: workflow.description.body,
		descriptionBullets: workflow.description.bullets.join('\n'),
		link: workflow.link || '',
		thumbnailUrl: workflow.thumbnail_url || '',
		thumbnailFile: null,
		categoryIds: workflow.categories.map((category) => category.id),
	};
}

export async function buildWorkflowPayload(formData: WorkflowFormData): Promise<WorkflowPayload> {
	const bullets = formData.descriptionBullets
		.split('\n')
		.map((bullet) => bullet.trim())
		.filter(Boolean);
	let thumbnailUrl = formData.thumbnailUrl;

	if (formData.thumbnailFile) {
		const uploadResult = await uploadFileToR2(formData.thumbnailFile);
		thumbnailUrl = uploadResult.publicUrl;
	}

	return {
		name: formData.name.trim(),
		teaser: formData.teaser.trim(),
		class: formData.workflowClass,
		description: {
			body: formData.descriptionBody.trim(),
			bullets,
		},
		link: formData.link.trim() || null,
		thumbnail_url: thumbnailUrl || null,
		category_ids: formData.categoryIds,
	};
}
