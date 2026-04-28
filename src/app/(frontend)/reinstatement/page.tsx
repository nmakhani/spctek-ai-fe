import React from 'react';

import {
	AccountRisk,
	ExpertHelp,
	FAQs,
	FreeAssessment,
	Hero,
	Intelligence,
	ReinstatementProcess,
} from '@/components/reinstatement';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { generateStaticMetadata } from '@/lib/metadata';

export const generateMetadata = async () => await generateStaticMetadata('/reinstatement');

export default function ReinstatementPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: AccountRisk, id: 'account-risk' },
		{ Component: ReinstatementProcess, id: 'reinstatement-process' },
		{ Component: Intelligence, id: 'intelligence' },
		{ Component: FreeAssessment, id: 'free-assessment' },
		{ Component: ExpertHelp, id: 'expert-help' },
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
