import type { Category, Content } from '@/components/portal/content-editor/types';

export interface AutomationWorkflowCategoryCountSource {
	categories?: Category[];
}

export interface CategoryUsageCounts {
	blogs: number;
	caseStudies: number;
	workflows: number;
}

export type CategoryUsageCountMap = Record<string, CategoryUsageCounts>;

export interface CategoryUsageSources {
	categories: Category[];
	blogs: Content[];
	caseStudies: Content[];
	workflows: AutomationWorkflowCategoryCountSource[];
}
