import type { CategoryUsageCountMap, CategoryUsageSources } from './types';

export function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export function getCategoryUsageCounts({
	categories,
	blogs,
	caseStudies,
	workflows,
}: CategoryUsageSources): CategoryUsageCountMap {
	return categories.reduce<CategoryUsageCountMap>((counts, category) => {
		counts[category.id] = {
			blogs: blogs.filter((item) => item.categories?.some((itemCategory) => itemCategory.id === category.id)).length,
			caseStudies: caseStudies.filter((item) =>
				item.categories?.some((itemCategory) => itemCategory.id === category.id)
			).length,
			workflows: workflows.filter((item) => item.categories?.some((itemCategory) => itemCategory.id === category.id))
				.length,
		};
		return counts;
	}, {});
}
