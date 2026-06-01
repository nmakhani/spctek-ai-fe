import React from 'react';

import { FAQs, Hero, Workflows } from '@/components/automation-workflows';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { generateStaticMetadata } from '@/lib/metadata';

export const generateMetadata = async () => await generateStaticMetadata('/automation-workflows');

export default function AutomationWorkflowsPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: Workflows, id: 'workflows' },
		{ Component: FAQs, id: 'faqs' },
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
