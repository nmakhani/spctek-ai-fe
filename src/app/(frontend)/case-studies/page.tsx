'use client';

import { Hero, StudyListing } from '@/components/content';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function CaseStudiesPage() {
	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				<section id="hero">
					<Hero
						titleContent={
							<>
								<span className="text-[#606bfa]">Real Results</span> from <br /> Real Business Operations
							</>
						}
						description="See how we identify process gaps, fix inefficiencies, and implement AI systems that drive measurable impact."
					/>
				</section>
				<SectionDivider />
				<section id="listing">
					<StudyListing />
				</section>
			</main>
		</div>
	);
}
