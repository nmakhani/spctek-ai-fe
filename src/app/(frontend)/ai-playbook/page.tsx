import React from 'react';

import { Breaks, FixGaps, Hero, PlaybookFormSection } from '@/components/ai-playbook';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { generateStaticMetadata } from '@/lib/metadata';

export const generateMetadata = async () => await generateStaticMetadata('/ai-playbook');

export default function AiPlaybookPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: Breaks, id: 'breaks' },
		{ Component: FixGaps, id: 'fix-gaps' },
		{ Component: PlaybookFormSection, id: 'playbook-form' },
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
