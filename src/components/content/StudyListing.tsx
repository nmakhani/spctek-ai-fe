'use client';

import { useEffect, useMemo, useState } from 'react';

import type { Category } from '@/components/portal/content-editor/types';
import { categoriesApi, contentApi } from '@/lib/api';
import FilterBar from './FilterBar';
import StudyCard from './StudyCard';
import type { PublicContent } from './types';

export default function StudyListing() {
	const [contents, setContents] = useState<PublicContent[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchInput, setSearchInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const contentType = 'CASE_STUDY';

	const handleSearchSubmit = () => {
		setSearchTerm(searchInput.trim());
	};

	useEffect(() => {
		let isMounted = true;

		const fetchCategories = async () => {
			try {
				const response = await categoriesApi.list();
				if (!isMounted) return;
				setCategories(response.data as Category[]);
			} catch {
				if (isMounted) setCategories([]);
			}
		};

		void fetchCategories();
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		let isMounted = true;

		const fetchContents = async () => {
			try {
				setLoading(true);
				const response = await contentApi.list({
					type: contentType,
					search: searchTerm || undefined,
					category: selectedCategory !== 'all' ? selectedCategory : undefined,
				});
				if (!isMounted) return;
				setContents(response.data as PublicContent[]);
			} catch {
				if (!isMounted) return;
				setContents([]);
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		void fetchContents();
		return () => {
			isMounted = false;
		};
	}, [contentType, searchTerm, selectedCategory]);

	const publishedContents = useMemo(() => contents.filter((content) => content.is_published), [contents]);
	const filterCategories = useMemo(
		() => [{ label: 'All', value: 'all' }, ...categories.map((item) => ({ label: item.name, value: item.slug }))],
		[categories]
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

				<div className="mx-auto max-w-5xl pt-2">
					{loading ? (
						<div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
							Loading case studies...
						</div>
					) : publishedContents.length === 0 ? (
						<div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
							No published case studies yet. Please check back soon.
						</div>
					) : (
						<div className="flex flex-col gap-12">
							{publishedContents.map((content, index) => (
								<StudyCard key={content.id} content={content} index={index} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
