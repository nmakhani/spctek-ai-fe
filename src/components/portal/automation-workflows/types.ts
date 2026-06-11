import type { Category } from '@/components/portal/content-editor/types';

export type WorkflowClass = 'system' | 'plugin';

export interface AutomationWorkflow {
	id: string;
	name: string;
	teaser: string;
	class: WorkflowClass;
	description: {
		body: string;
		bullets: string[];
	};
	link?: string | null;
	thumbnail_url?: string | null;
	categories: Category[];
	created_at: string;
	updated_at: string;
}

export interface WorkflowFormData {
	name: string;
	teaser: string;
	workflowClass: WorkflowClass;
	descriptionBody: string;
	descriptionBullets: string;
	link: string;
	thumbnailUrl: string;
	thumbnailFile: File | null;
	categoryIds: string[];
}

export interface WorkflowPayload extends Record<string, unknown> {
	name: string;
	teaser: string;
	class: WorkflowClass;
	description: {
		body: string;
		bullets: string[];
	};
	link: string | null;
	thumbnail_url: string | null;
	category_ids: string[];
}
