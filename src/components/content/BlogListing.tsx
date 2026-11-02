'use client';

import { useMemo, useState } from 'react';

import Newsletter from '../generic-sections/Newsletter';
import Playbook from '../generic-sections/Playbook';
import FilterBar from '../ui/FilterBar';
import BlogCard from './BlogCard';
import type { PublicContent } from './types';

export default function BlogListing({ initialContents }: { initialContents: PublicContent[] }) {
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchInput, setSearchInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearchSubmit = () => {
		setSearchTerm(searchInput.trim());
	};

	const publishedContents = useMemo(() => initialContents.filter((content) => content.is_published), [initialContents]);

	const filteredContents = useMemo(() => {
		const query = searchTerm.toLowerCase();
		return publishedContents.filter((content) => {
			const matchesCategory =
				selectedCategory === 'all' || content.categories?.some((category) => category.slug === selectedCategory);
			const matchesSearch =
				!query || [content.title, content.summary, content.content].join(' ').toLowerCase().includes(query);
			return matchesCategory && matchesSearch;
		});
	}, [publishedContents, selectedCategory, searchTerm]);

	const filterCategories = useMemo(
		() =>
			Array.from(
				publishedContents
					.flatMap((content) => content.categories || [])
					.reduce((categoryMap, category) => categoryMap.set(category.slug, category.name), new Map<string, string>())
			).map(([value, label]) => ({ label, value })),
		[publishedContents]
	);

	return (
		<div className="px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-7xl">
				<FilterBar
					categories={filterCategories}
					selectedCategory={selectedCategory}
					searchTerm={searchInput}
					onCategoryChange={setSelectedCategory}
					onSearchChange={setSearchInput}
					onSearchSubmit={handleSearchSubmit}
				/>

				<div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
					<div className="pt-2">
						{filteredContents.length === 0 ? (
							<div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
								No published blogs yet. Please check back soon.
							</div>
						) : (
							<div className="flex flex-col gap-12">
								{filteredContents.map((content, index) => (
									<BlogCard key={content.id} content={content} index={index} />
								))}
							</div>
						)}
					</div>

					<div className="flex w-full flex-col gap-6 lg:sticky lg:top-10">
						<Newsletter />
						<Playbook />
					</div>
				</div>
			</div>
		</div>
	);
}
