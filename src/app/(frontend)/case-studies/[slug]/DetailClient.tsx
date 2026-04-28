'use client';

import { ArticleSection, DetailHero, type PublicContent } from '@/components/content';
import { SectionDivider } from '@/components/ui/SectionDivider';

interface DetailClientProps {
	initialCaseStudy: PublicContent;
}

export default function DetailClient({ initialCaseStudy }: DetailClientProps) {
	const caseStudy = initialCaseStudy;

	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				<section id="hero">
					<DetailHero content={caseStudy} />
				</section>
				<SectionDivider />
				<section id="article">
					<ArticleSection content={caseStudy} />
				</section>
			</main>
		</div>
	);
}
