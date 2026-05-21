'use client';

import React, { useEffect, useState } from 'react';

import Newsletter from '@/components/generic-sections/Newsletter';
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
import { SectionDivider } from '@/components/ui/SectionDivider';
import { hasCooldownElapsed, markSeen, normalizePopupPath } from '@/lib/popupCooldown';

const NEWSLETTER_SCOPE = normalizePopupPath('/');

export default function HomePageClient() {
	const [showNewsletterModal, setShowNewsletterModal] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		if (!hasCooldownElapsed(NEWSLETTER_SCOPE)) return;

		const timer = window.setTimeout(() => {
			setShowNewsletterModal(true);
			markSeen(NEWSLETTER_SCOPE);
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
					className="fixed inset-0 z-[70] grid place-items-end bg-black/70 p-3 backdrop-blur-sm sm:place-items-center sm:p-4"
					onClick={() => setShowNewsletterModal(false)}
				>
					<button
						type="button"
						onClick={() => setShowNewsletterModal(false)}
						className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white/20 sm:right-5 sm:top-5"
					>
						Close
					</button>
					<div
						className="max-h-[90vh] w-full max-w-md overflow-y-auto overscroll-contain"
						onClick={(e) => e.stopPropagation()}
					>
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
