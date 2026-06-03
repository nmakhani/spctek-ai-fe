'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { type Category, type Content } from '@/components/portal/content-editor/types';
import { PageHeader } from '@/components/portal/PageHeader';
import { PortalTable, type PortalTableAction, type PortalTableColumn } from '@/components/portal/PortalTable';
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

	const categoryColumns: PortalTableColumn<Category>[] = [
		{
			header: 'Category',
			type: 'custom',
			render: (category) =>
				editingCategoryId === category.id ? (
					<input
						type="text"
						value={editingCategoryName}
						onChange={(e) => setEditingCategoryName(e.target.value)}
						className="w-full min-w-44 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
				) : (
					<span className="font-medium">{category.name}</span>
				),
		},
		{ header: 'Slug', accessor: 'slug', className: 'text-white/60' },
		{
			header: 'Blogs',
			type: 'number',
			accessor: (category) => categoryUsageCounts[category.id]?.blogs ?? 0,
		},
		{
			header: 'Case Studies',
			type: 'number',
			accessor: (category) => categoryUsageCounts[category.id]?.caseStudies ?? 0,
		},
		{
			header: 'Workflows',
			type: 'number',
			accessor: (category) => categoryUsageCounts[category.id]?.workflows ?? 0,
		},
	];

	const getCategoryActions = (category: Category): PortalTableAction<Category>[] => {
		const isEditing = editingCategoryId === category.id;
		const isWorking = categoryActionLoadingId === category.id;

		if (isEditing) {
			return [
				{
					label: 'Save',
					loadingLabel: 'Saving...',
					loading: isWorking,
					variant: 'success',
					onClick: saveCategoryEdit,
				},
				{
					label: 'Cancel',
					disabled: isWorking,
					variant: 'secondary',
					onClick: () => {
						setEditingCategoryId(null);
						setEditingCategoryName('');
					},
				},
			];
		}

		return [
			{
				label: 'Edit',
				disabled: isWorking,
				onClick: startEditCategory,
			},
			{
				label: 'Delete',
				disabled: isWorking,
				variant: 'danger',
				onClick: (selectedCategory) => setPendingCategoryDeleteId(selectedCategory.id),
			},
		];
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

				<PortalTable
					columns={categoryColumns}
					loading={loading}
					loadingMessage="Loading categories..."
					empty={categories.length === 0}
					emptyMessage="No categories yet"
					minWidthClassName="min-w-[820px]"
					data={categories}
					getRowKey={(category) => category.id}
					actions={getCategoryActions}
				/>
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
