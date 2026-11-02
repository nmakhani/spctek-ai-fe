import { BlogListing, Hero } from '@/components/content';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { generateStaticMetadata } from '@/lib/metadata';
import { getPublishedContent } from '@/lib/public-content';

export const generateMetadata = async () => await generateStaticMetadata('/blogs');

export default async function BlogsPage() {
	const contents = await getPublishedContent('BLOG');
	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				<section id="hero">
					<Hero
						titleContent={
							<>
								Practical Insights on <span className="text-[#606bfa]">AI, Operations, and Scalable Growth</span>
							</>
						}
						description="Practical ideas, real-world strategies, and actionable guides to help you improve processes and implement AI effectively."
					/>
				</section>

				<SectionDivider />

				<section id="listing">
					<BlogListing initialContents={contents} />
				</section>
			</main>
		</div>
	);
}
