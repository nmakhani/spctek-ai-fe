'use client';

import React, { useEffect, useState } from 'react';

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
	FAQs,
} from '@/components/landing-page';

import { SectionDivider } from '@/components/ui/SectionDivider';

import Newsletter from '@/components/generic-sections/Newsletter';

const NEWSLETTER_STORAGE_KEY = 'spctek-newsletter-seen';

export default function HomePage() {
	const [showNewsletterModal, setShowNewsletterModal] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		if (localStorage.getItem(NEWSLETTER_STORAGE_KEY) === 'true') return;

		const timer = window.setTimeout(() => {
			setShowNewsletterModal(true);
			localStorage.setItem(NEWSLETTER_STORAGE_KEY, 'true');
		}, 5000);

		return () => window.clearTimeout(timer);
	}, []);

	useEffect(() => {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
	}, []);

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

	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			{showNewsletterModal && (
				<div
					className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
					onClick={() => setShowNewsletterModal(false)}
				>
					<button
						type="button"
						onClick={() => setShowNewsletterModal(false)}
						className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white/20"
					>
						Close
					</button>
					<div onClick={(e) => e.stopPropagation()}>
						<Newsletter onClose={() => setShowNewsletterModal(false)} />
					</div>
				</div>
			)}
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
