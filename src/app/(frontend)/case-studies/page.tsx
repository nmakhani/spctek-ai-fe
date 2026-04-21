'use client';

import React from 'react';

import { Hero, ListingSection } from '@/components/blog';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function CaseStudiesPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: ListingSection, id: 'listing' },
	];

	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				<section id="hero">
					<Hero
						titlePrefix="Real Outcomes from"
						titleAccent="AI, Automation, and Operational Execution"
						description="Case studies from implementation work that show what changed, how it was delivered, and what results were achieved."
					/>
				</section>
				<SectionDivider />
				<section id="listing">
					<ListingSection
						contentType="CASE_STUDY"
						basePath="/case-studies"
						emptyText="No published case studies yet. Please check back soon."
						errorText="Failed to load case studies"
						loadingText="Loading case studies..."
					/>
				</section>
			</main>
		</div>
	);
}
