'use client';

import React from 'react';

import { Hero, ListingSection } from '@/components/blog';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function ListingPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: ListingSection, id: 'listing' },
	];

	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				{SECTIONS.map(({ Component, id }, index) => (
					<React.Fragment key={index}>
						<section id={id}>
							<Component />
						</section>
						{index < SECTIONS.length - 1 && <SectionDivider />}
					</React.Fragment>
				))}
			</main>
		</div>
	);
}
