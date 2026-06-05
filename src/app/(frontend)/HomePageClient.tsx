import React from 'react';

import {
	AIPlaybook,
	BusinessAdoption,
	Contact,
	CuratedTechnologies,
	FAQs,
	Hero,
	Issues,
	OperationalFramework,
	PrivateAiStack,
	Problems,
	TargetedSolutions,
	Testimonials,
	Tools,
} from '@/components/landing-page';
import { NewsletterPopup } from '@/components/landing-page/NewsletterPopup';
import { SectionDivider } from '@/components/ui/SectionDivider';

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
	{ Component: FAQs, id: 'faq' },
];

export default function HomePageClient() {
	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<NewsletterPopup />
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
