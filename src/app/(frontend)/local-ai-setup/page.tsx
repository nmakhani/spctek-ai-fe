'use client';

import React from 'react';

import {
	Hero,
	WhyMove,
	DeploymentProcess,
	RoadmapForm,
	AiPowered,
	FAQs,
} from '@/components/local-ai-setup';

import { SectionDivider } from '@/components/ui/SectionDivider';

export default function LocalAiSetupPage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: WhyMove, id: 'why-move' },
		{ Component: DeploymentProcess, id: 'deployment-process' },
		{ Component: RoadmapForm, id: 'roadmap-form' },
		{ Component: AiPowered, id: 'ai-powered' },
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
