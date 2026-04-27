'use client';

import React from 'react';

import { Approach, Building, Hero, Learned, Started } from '@/components/about';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function AboutPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: Learned, id: 'learned' },
		{ Component: Started, id: 'started' },
		{ Component: Approach, id: 'approach' },
		{ Component: Building, id: 'building' },
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
