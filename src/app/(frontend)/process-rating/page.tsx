import React from 'react';

import { Bottlenecks, FAQs, FixGaps, Hero, ProcessDiagnostics } from '@/components/process-rating';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { generateStaticMetadata } from '@/lib/metadata';

export const generateMetadata = async () => await generateStaticMetadata('/process-rating');

export default function ProcessRatingPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: Bottlenecks, id: 'bottlenecks' },
		{ Component: ProcessDiagnostics, id: 'process-diagnostic' },
		{ Component: FixGaps, id: 'fix-gaps' },
		{ Component: FAQs, id: 'faq' },
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
