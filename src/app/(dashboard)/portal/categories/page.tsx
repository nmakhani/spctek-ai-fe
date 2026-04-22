'use client';

import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

import { categoriesApi } from '@/lib/api';
import { StatCard } from '@/components/portal/StatCard';
import { PageHeader } from '@/components/portal/PageHeader';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { type Category } from '@/components/portal/content-editor/types';

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function CategoriesContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryName, setCategoryName] = useState('');
	const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
	const [editingCategoryName, setEditingCategoryName] = useState('');
	const [categoryActionLoadingId, setCategoryActionLoadingId] = useState<string | null>(null);
	const [creatingCategory, setCreatingCategory] = useState(false);
	const [pendingCategoryDeleteId, setPendingCategoryDeleteId] = useState<string | null>(null);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			const response = await categoriesApi.list();
			setCategories(response.data as Category[]);
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

					<div className="flex flex-wrap gap-2">
						{categories.length === 0 ? (
							<p className="text-sm text-white/55">No categories yet</p>
						) : (
							categories.map((category) => {
								const isEditing = editingCategoryId === category.id;
								const isWorking = categoryActionLoadingId === category.id;

								return (
									<div
										key={category.id}
										className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5"
									>
										{isEditing ? (
											<>
												<input
													type="text"
													value={editingCategoryName}
													onChange={(e) => setEditingCategoryName(e.target.value)}
													className="w-40 rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm text-white outline-none"
												/>
												<button
													type="button"
													onClick={saveCategoryEdit}
													disabled={isWorking}
													className="text-emerald-300 hover:text-emerald-200 text-xs font-semibold disabled:opacity-60"
												>
													{isWorking ? 'Saving...' : 'Save'}
												</button>
												<button
													type="button"
													onClick={() => {
														setEditingCategoryId(null);
														setEditingCategoryName('');
													}}
													className="text-xs font-semibold text-white/70 hover:text-white"
												>
													Cancel
												</button>
											</>
										) : (
											<>
												<span className="text-sm text-white/90">{category.name}</span>
												<button
													type="button"
													onClick={() => startEditCategory(category)}
													className="text-xs font-semibold text-[#a9b2ff] hover:text-[#c7ceff]"
												>
													Edit
												</button>
												<button
													type="button"
													onClick={() => setPendingCategoryDeleteId(category.id)}
													disabled={isWorking}
													className="text-rose-300 hover:text-rose-200 text-xs font-semibold disabled:opacity-60"
												>
													Delete
												</button>
											</>
										)}
									</div>
								);
							})
						)}
					</div>
				</section>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
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
