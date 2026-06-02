'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { type Category, type Content } from '@/components/portal/content-editor/types';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { automationWorkflowsApi, categoriesApi, contentApi } from '@/lib/api';

interface AutomationWorkflowCategoryCountSource {
	categories?: Category[];
}

interface CategoryUsageCounts {
	blogs: number;
	caseStudies: number;
	workflows: number;
}

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function CategoriesContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryUsageCounts, setCategoryUsageCounts] = useState<Record<string, CategoryUsageCounts>>({});
	const [categoryName, setCategoryName] = useState('');
	const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
	const [editingCategoryName, setEditingCategoryName] = useState('');
	const [categoryActionLoadingId, setCategoryActionLoadingId] = useState<string | null>(null);
	const [creatingCategory, setCreatingCategory] = useState(false);
	const [pendingCategoryDeleteId, setPendingCategoryDeleteId] = useState<string | null>(null);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			const [categoriesResponse, blogsResponse, caseStudiesResponse, workflowsResponse] = await Promise.all([
				categoriesApi.list(),
				contentApi.list({ type: 'BLOG', limit: 1000 }),
				contentApi.list({ type: 'CASE_STUDY', limit: 1000 }),
				automationWorkflowsApi.list(),
			]);
			const nextCategories = categoriesResponse.data as Category[];
			const blogs = blogsResponse.data as Content[];
			const caseStudies = caseStudiesResponse.data as Content[];
			const workflows = workflowsResponse.data as AutomationWorkflowCategoryCountSource[];

			const nextUsageCounts = nextCategories.reduce<Record<string, CategoryUsageCounts>>((counts, category) => {
				counts[category.id] = {
					blogs: blogs.filter((item) => item.categories?.some((itemCategory) => itemCategory.id === category.id))
						.length,
					caseStudies: caseStudies.filter((item) =>
						item.categories?.some((itemCategory) => itemCategory.id === category.id)
					).length,
					workflows: workflows.filter((item) =>
						item.categories?.some((itemCategory) => itemCategory.id === category.id)
					).length,
				};
				return counts;
			}, {});

			setCategories(nextCategories);
			setCategoryUsageCounts(nextUsageCounts);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load categories');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchCategories();
	}, []);

	const createCategory = async () => {
		const name = categoryName.trim();
		if (!name) {
			toast.error('Category name is required');
			return;
		}

		try {
			setCreatingCategory(true);
			await categoriesApi.create({ name });
			setCategoryName('');
			await fetchCategories();
			toast.success('Category created');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to create category');
			setError(message);
			toast.error(message);
		} finally {
			setCreatingCategory(false);
		}
	};

	const startEditCategory = (category: Category) => {
		setEditingCategoryId(category.id);
		setEditingCategoryName(category.name);
	};

	const saveCategoryEdit = async () => {
		if (!editingCategoryId) return;

		const name = editingCategoryName.trim();
		if (!name) {
			toast.error('Category name is required');
			return;
		}

		try {
			setCategoryActionLoadingId(editingCategoryId);
			await categoriesApi.update(editingCategoryId, { name });
			setEditingCategoryId(null);
			setEditingCategoryName('');
			await fetchCategories();
			toast.success('Category updated');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to update category');
			setError(message);
			toast.error(message);
		} finally {
			setCategoryActionLoadingId(null);
		}
	};

	const deleteCategory = async () => {
		if (!pendingCategoryDeleteId) return;

		try {
			setCategoryActionLoadingId(pendingCategoryDeleteId);
			await categoriesApi.delete(pendingCategoryDeleteId);
			setPendingCategoryDeleteId(null);
			await fetchCategories();
			toast.success('Category deleted');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete category');
			setError(message);
			toast.error(message);
		} finally {
			setCategoryActionLoadingId(null);
		}
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={Boolean(pendingCategoryDeleteId)}
				title="Delete category"
				message="Deleting a category removes it from assigned content. Continue?"
				confirmLabel="Delete"
				loading={Boolean(categoryActionLoadingId)}
				onConfirm={deleteCategory}
				onCancel={() => {
					if (!categoryActionLoadingId) {
						setPendingCategoryDeleteId(null);
					}
				}}
			/>

			<PageHeader title="Categories" subtitle="Dashboard" backLink="/portal" backText="← Back to Home" />

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<StatCard label="Total Categories" loading={loading} count={categories.length} />
					<StatCard label="Ready for Use" loading={loading} count={categories.length} />
				</div>

				<section className="border-white/18 mb-8 mt-6 rounded-3xl border bg-white/[0.04] p-5 md:p-6">
					<div className="mb-4 flex flex-wrap items-end gap-3">
						<div className="min-w-[240px] flex-1">
							<label className="mb-2 block text-sm text-white/70">Add Category</label>
							<input
								type="text"
								value={categoryName}
								onChange={(e) => setCategoryName(e.target.value)}
								placeholder="e.g. AI Workflows"
								className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
							/>
						</div>
						<button
							type="button"
							onClick={createCategory}
							disabled={creatingCategory}
							className="rounded-xl bg-[#606bfa] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
						>
							{creatingCategory ? 'Creating...' : 'Create Category'}
						</button>
					</div>
				</section>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				{loading ? (
					<div className="py-12 text-center text-white/55">Loading categories...</div>
				) : categories.length === 0 ? (
					<div className="py-12 text-center text-white/55">No categories yet</div>
				) : (
					<div className="overflow-x-auto rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] shadow-[0_20px_50px_rgba(0,0,0,0.58)] backdrop-blur-xl">
						<table className="w-full min-w-[820px]">
							<thead className="border-b border-white/10 bg-black/25">
								<tr>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Category</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Slug</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Blogs</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Case Studies</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Workflows</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Actions</th>
								</tr>
							</thead>
							<tbody>
								{categories.map((category) => {
									const isEditing = editingCategoryId === category.id;
									const isWorking = categoryActionLoadingId === category.id;
									const usageCounts = categoryUsageCounts[category.id] || {
										blogs: 0,
										caseStudies: 0,
										workflows: 0,
									};

									return (
										<tr key={category.id} className="border-b border-white/10 transition hover:bg-white/[0.05]">
											<td className="px-6 py-3 text-white">
												{isEditing ? (
													<input
														type="text"
														value={editingCategoryName}
														onChange={(e) => setEditingCategoryName(e.target.value)}
														className="w-full min-w-44 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
													/>
												) : (
													<span className="font-medium">{category.name}</span>
												)}
											</td>
											<td className="px-6 py-3 text-white/60">{category.slug}</td>
											<td className="px-6 py-3 text-white/75">{usageCounts.blogs}</td>
											<td className="px-6 py-3 text-white/75">{usageCounts.caseStudies}</td>
											<td className="px-6 py-3 text-white/75">{usageCounts.workflows}</td>
											<td className="px-6 py-3">
												{isEditing ? (
													<div className="flex gap-2">
														<button
															type="button"
															onClick={saveCategoryEdit}
															disabled={isWorking}
															className="rounded-lg bg-[#10b981] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#34d399] disabled:opacity-60"
														>
															{isWorking ? 'Saving...' : 'Save'}
														</button>
														<button
															type="button"
															onClick={() => {
																setEditingCategoryId(null);
																setEditingCategoryName('');
															}}
															disabled={isWorking}
															className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.14] disabled:opacity-60"
														>
															Cancel
														</button>
													</div>
												) : (
													<div className="flex gap-2">
														<button
															type="button"
															onClick={() => startEditCategory(category)}
															disabled={isWorking}
															className="rounded-lg bg-[#606bfa] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
														>
															Edit
														</button>
														<button
															type="button"
															onClick={() => setPendingCategoryDeleteId(category.id)}
															disabled={isWorking}
															className="rounded-lg bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#ff5a5a] disabled:opacity-60"
														>
															Delete
														</button>
													</div>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</div>
	);
}

export default function CategoriesPage() {
	return (
		<ProtectedRoute>
			<CategoriesContent />
		</ProtectedRoute>
	);
}
