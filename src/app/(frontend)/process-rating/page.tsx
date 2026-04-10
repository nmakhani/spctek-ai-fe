'use client';

import React from 'react';

import {
	Hero,
	Bottlenecks,
	ProcessDiagnostics,
	FixGaps,
	FAQSection,
} from '@/components/process-rating';

import { SectionDivider } from '@/components/ui/SectionDivider';

export default function ProcessRatingPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: Bottlenecks, id: 'bottlenecks' },
		{ Component: ProcessDiagnostics, id: 'process-diagnostic' },
		{ Component: FixGaps, id: 'fix-gaps' },
		{ Component: FAQSection, id: 'faq' },
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
