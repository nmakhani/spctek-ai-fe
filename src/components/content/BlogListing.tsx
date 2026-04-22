'use client';

import { useEffect, useMemo, useState } from 'react';

import BlogCard from './BlogCard';
import FilterBar from './FilterBar';
import Playbook from '../generic-sections/Playbook';
import Newsletter from '../generic-sections/Newsletter';

import type { PublicContent } from './types';
import { categoriesApi, contentApi } from '@/lib/api';
import type { Category } from '@/components/portal/content-editor/types';

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export default function BlogListing() {
	const [contents, setContents] = useState<PublicContent[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [searchInput, setSearchInput] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const contentType = 'BLOG';
	const errorText = 'Failed to load blogs';

	const handleSearchSubmit = () => {
		setSearchTerm(searchInput.trim());
	};

	useEffect(() => {
		let isMounted = true;

		const fetchCategories = async () => {
			try {
				const response = await categoriesApi.list();
				if (!isMounted) {
					return;
				}
				setCategories(response.data as Category[]);
			} catch {
				if (isMounted) {
					setCategories([]);
				}
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
				if (!isMounted) {
					return;
				}
				setContents(response.data as PublicContent[]);
				setError('');
			} catch (err: unknown) {
				if (!isMounted) {
					return;
				}
				setError(getErrorMessage(err, errorText));
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
	}, [contentType, searchTerm, selectedCategory, errorText]);

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

				<div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
					<div className="pt-2">
						{error && (
							<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">
								{error}
							</div>
						)}

						{loading ? (
							<div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
								Loading articles...
							</div>
						) : publishedContents.length === 0 ? (
							<div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
								No published blogs yet. Please check back soon.
							</div>
						) : (
							<div className="flex flex-col gap-12">
								{publishedContents.map((content, index) => (
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
