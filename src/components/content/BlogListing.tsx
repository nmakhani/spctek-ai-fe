'use client';

import { useEffect, useMemo, useState } from 'react';

import { contentApi } from '@/lib/api';
import Newsletter from '../generic-sections/Newsletter';
import Playbook from '../generic-sections/Playbook';
import BlogCard from './BlogCard';
import FilterBar from './FilterBar';
import type { PublicContent } from './types';

export default function BlogListing() {
	const [contents, setContents] = useState<PublicContent[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchInput, setSearchInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const contentType = 'BLOG';

	const handleSearchSubmit = () => {
		setSearchTerm(searchInput.trim());
	};

	useEffect(() => {
		let isMounted = true;

		const fetchContents = async () => {
			try {
				setLoading(true);
				const response = await contentApi.list({
					type: contentType,
					search: searchTerm || undefined,
				});
				if (!isMounted) {
					return;
				}
				setContents(response.data as PublicContent[]);
			} catch {
				if (!isMounted) {
					return;
				}
				setContents([]);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		void fetchContents();

		return () => {
			isMounted = false;
		};
	}, [contentType, searchTerm]);

	const publishedContents = useMemo(() => contents.filter((content) => content.is_published), [contents]);

	const filteredContents = useMemo(() => {
		if (selectedCategory === 'all') {
			return publishedContents;
		}
		return publishedContents.filter((content) =>
			content.categories?.some((category) => category.slug === selectedCategory)
		);
	}, [publishedContents, selectedCategory]);

	const filterCategories = useMemo(
		() =>
			Array.from(
				publishedContents
					.flatMap((content) => content.categories || [])
					.reduce((categoryMap, category) => categoryMap.set(category.slug, category.name), new Map<string, string>())
			).map(([value, label]) => ({ label, value })),
		[publishedContents]
	);

	useEffect(() => {
		if (selectedCategory !== 'all' && !filterCategories.some((category) => category.value === selectedCategory)) {
			setSelectedCategory('all');
		}
	}, [filterCategories, selectedCategory]);

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
					categoriesLoading={loading}
				/>

				<div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
					<div className="pt-2">
						{loading ? (
							<div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
								Loading articles...
							</div>
						) : filteredContents.length === 0 ? (
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
