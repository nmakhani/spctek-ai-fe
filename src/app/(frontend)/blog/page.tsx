'use client';

import { Hero, ListingSection } from '@/components/content';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function BlogsPage() {
	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				<section id="hero">
					<Hero
						titlePrefix="Practical Insights on"
						titleAccent="AI, Operations, and Scalable Growth"
						description="Practical ideas, real-world strategies, and actionable guides to help you improve processes and implement AI effectively."
					/>
				</section>

				<SectionDivider />

				<section id="listing">
					<ListingSection
						contentType="BLOG"
						basePath="/blog"
						emptyText="No published blogs yet. Please check back soon."
						errorText="Failed to load blogs"
						loadingText="Loading articles..."
					/>
				</section>
			</main>
		</div>
	);
}
