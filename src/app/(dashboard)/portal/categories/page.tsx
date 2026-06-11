'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { CategoriesTable } from '@/components/portal/categories/CategoriesTable';
import { CategoryCreateForm } from '@/components/portal/categories/CategoryCreateForm';
import type { CategoryUsageCountMap } from '@/components/portal/categories/types';
import { getCategoryUsageCounts, getErrorMessage } from '@/components/portal/categories/utils';
import { type Category, type Content } from '@/components/portal/content-editor/types';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { automationWorkflowsApi, categoriesApi, contentApi } from '@/lib/api';

function CategoriesContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryUsageCounts, setCategoryUsageCounts] = useState<CategoryUsageCountMap>({});
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

			setCategories(nextCategories);
			setCategoryUsageCounts(
				getCategoryUsageCounts({
					categories: nextCategories,
					blogs,
					caseStudies,
					workflows: workflowsResponse.data,
				})
			);
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

	const cancelEditCategory = () => {
		setEditingCategoryId(null);
		setEditingCategoryName('');
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
			cancelEditCategory();
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

			<PageHeader title="Categories" subtitle="Dashboard" backLink="/portal" backText="Back to Home" />

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<StatCard label="Total Categories" loading={loading} count={categories.length} />
					<StatCard label="Ready for Use" loading={loading} count={categories.length} />
				</div>

				<CategoryCreateForm
					name={categoryName}
					creating={creatingCategory}
					onNameChange={setCategoryName}
					onCreate={createCategory}
				/>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				<CategoriesTable
					categories={categories}
					usageCounts={categoryUsageCounts}
					loading={loading}
					editingCategoryId={editingCategoryId}
					editingCategoryName={editingCategoryName}
					actionLoadingId={categoryActionLoadingId}
					onEditingNameChange={setEditingCategoryName}
					onEdit={startEditCategory}
					onCancelEdit={cancelEditCategory}
					onSaveEdit={saveCategoryEdit}
					onRequestDelete={setPendingCategoryDeleteId}
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
