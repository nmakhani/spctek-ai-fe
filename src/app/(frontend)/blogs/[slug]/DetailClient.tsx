'use client';

import { ArticleSection, DetailHero, type PublicContent } from '@/components/content';
import { SectionDivider } from '@/components/ui/SectionDivider';

interface DetailClientProps {
	initialBlog: PublicContent;
}

export default function DetailClient({ initialBlog }: DetailClientProps) {
	const blog = initialBlog;

	return (
		<div className="noise-overlay relative flex min-h-screen flex-col">
			<main className="flex-1">
				<section id="hero">
					<DetailHero content={blog} />
				</section>
				<SectionDivider />
				<section id="article">
					<ArticleSection content={blog} />
				</section>
			</main>
		</div>
	);
}
