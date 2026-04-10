'use client';

import React from 'react';

import {
	Hero,
	Problems,
	Issues,
	Testimonials,
	OperationalFramework,
	TargetedSolutions,
	CuratedTechnologies,
	BusinessAdoption,
	Tools,
	PrivateAiStack,
	AIPlaybook,
	Contact,
	FAQSection,
} from '@/components/home-page';

import { SectionDivider } from '@/components/ui/SectionDivider';

export default function HomePage() {
	const SECTIONS = [
		{ Component: Hero, id: 'hero' },
		{ Component: Problems, id: 'problems' },
		{ Component: Issues, id: 'issues' },
		{ Component: Testimonials, id: 'testimonials' },
		{ Component: OperationalFramework, id: 'framework' },
		{ Component: TargetedSolutions, id: 'solutions' },
		{ Component: CuratedTechnologies, id: 'technologies' },
		{ Component: BusinessAdoption, id: 'adoption' },
		{ Component: Tools, id: 'tools' },
		{ Component: PrivateAiStack, id: 'stack' },
		{ Component: AIPlaybook, id: 'playbook' },
		{ Component: Contact, id: 'contact' },
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
