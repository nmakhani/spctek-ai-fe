import { Hero, StudyListing } from '@/components/content';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { generateStaticMetadata } from '@/lib/metadata';
import { getPublishedContent } from '@/lib/public-content';

export const generateMetadata = async () => await generateStaticMetadata('/case-studies');

export default async function CaseStudiesPage() {
	const contents = await getPublishedContent('CASE_STUDY');
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
					<StudyListing initialContents={contents} />
				</section>
			</main>
		</div>
	);
}
