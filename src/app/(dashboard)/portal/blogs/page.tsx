'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { blogsApi, categoriesApi } from '@/lib/api';
import { StatCard } from '@/components/portal/StatCard';
import { PageHeader } from '@/components/portal/PageHeader';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { type Blog, type Category } from '@/components/portal/blog-editor/types';
import { extractPreviewText } from '@/components/portal/blog-editor/utils';

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function BlogsContent() {
	const router = useRouter();
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryName, setCategoryName] = useState('');
	const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
	const [editingCategoryName, setEditingCategoryName] = useState('');
	const [categoryActionLoadingId, setCategoryActionLoadingId] = useState<string | null>(null);
	const [creatingCategory, setCreatingCategory] = useState(false);
	const [pendingCategoryDeleteId, setPendingCategoryDeleteId] = useState<string | null>(null);

	const publishedCount = useMemo(() => blogs.filter((item) => item.is_published).length, [blogs]);

	const fetchBlogs = async () => {
		try {
			setLoading(true);
			const response = await blogsApi.list();
			setBlogs(response.data);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load blogs');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await categoriesApi.list();
			setCategories(response.data as Category[]);
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load categories');
			setError(message);
			toast.error(message);
		}
	};

	useEffect(() => {
		void fetchBlogs();
		void fetchCategories();
	}, []);

	const requestDelete = (id: string) => {
		setPendingDeleteId(id);
	};

	const handleDelete = async () => {
		if (!pendingDeleteId) {
			return;
		}

		try {
			setDeletingId(pendingDeleteId);
			setError('');
			await blogsApi.delete(pendingDeleteId);
			setBlogs((prev) => prev.filter((blog) => blog.id !== pendingDeleteId));
			toast.success('Blog deleted');
			setPendingDeleteId(null);
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete blog');
			setError(message);
			toast.error(message);
		} finally {
			setDeletingId(null);
		}
	};

	const cancelDelete = () => {
		if (!deletingId) {
			setPendingDeleteId(null);
		}
	};

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
			await fetchBlogs();
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
				isOpen={Boolean(pendingDeleteId)}
				title="Delete blog"
				message="This action cannot be undone. Are you sure you want to continue?"
				confirmLabel="Delete"
				loading={Boolean(deletingId)}
				onConfirm={handleDelete}
				onCancel={cancelDelete}
			/>
			<ConfirmDialog
				isOpen={Boolean(pendingCategoryDeleteId)}
				title="Delete category"
				message="Deleting a category removes it from assigned blogs. Continue?"
				confirmLabel="Delete"
				loading={Boolean(categoryActionLoadingId)}
				onConfirm={deleteCategory}
				onCancel={() => {
					if (!categoryActionLoadingId) {
						setPendingCategoryDeleteId(null);
					}
				}}
			/>

			<PageHeader
				title="Blogs"
				subtitle="Dashboard"
				backLink="/portal"
				backText="← Back to Home"
				buttonText="+ New Blog"
				buttonOnClick={() => router.push('/portal/blogs/new')}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<StatCard label="Total Blogs" loading={loading} count={blogs.length} />
					<StatCard label="Published" loading={loading} count={publishedCount} />
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

				{loading ? (
					<div className="py-12 text-center text-white/55">Loading blogs...</div>
				) : blogs.length === 0 ? (
					<div className="py-12 text-center text-white/55">No blogs yet</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{blogs.map((blog) => (
							<div
								key={blog.id}
								className="flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] shadow-[0_18px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#7d89ff]/60"
							>
								{blog.thumbnail_url && (
									<div className="relative h-48 w-full shrink-0 overflow-hidden bg-black/40">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={blog.thumbnail_url}
											alt={blog.title}
											className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
										/>
									</div>
								)}
								<div className="flex flex-1 flex-col p-6">
									<h3 className="mb-2 line-clamp-2 text-xl font-semibold text-white">{blog.title}</h3>
									<p className="mb-2 text-xs text-[#a9b2ff]">/{blog.slug}</p>
									{blog.author && <p className="mb-3 text-sm text-white/60">By {blog.author}</p>}
									{blog.summary && <p className="text-white/78 mb-3 line-clamp-2 text-sm">{blog.summary}</p>}
									{blog.categories && blog.categories.length > 0 && (
										<div className="mb-3 flex flex-wrap gap-1.5">
											{blog.categories.map((category) => (
												<span
													key={`${blog.id}-${category.id}`}
													className="rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-2 py-0.5 text-[11px] text-[#cfd5ff]"
												>
													{category.name}
												</span>
											))}
										</div>
									)}
									<p className="mb-4 line-clamp-3 flex-1 text-sm text-white/65">{extractPreviewText(blog.content)}</p>

									<div className="mb-4 flex items-center justify-between text-xs">
										<span
											className={`rounded-full border px-2.5 py-1 ${
												blog.is_published
													? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
													: 'border-amber-400/40 bg-amber-400/10 text-amber-300'
											}`}
										>
											{blog.is_published ? 'Published' : 'Draft'}
										</span>
										{blog.created_at && (
											<span className="text-white/60">Created {new Date(blog.created_at).toLocaleDateString()}</span>
										)}
									</div>

									<div className="flex gap-2">
										<Link
											href={`/portal/blogs/${blog.id}/edit`}
											className="flex-1 rounded-lg bg-[#606bfa] px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-[#6f79ff]"
										>
											Edit
										</Link>
										<button
											onClick={() => requestDelete(blog.id)}
											disabled={deletingId === blog.id}
											className="flex-1 rounded-lg bg-[#ef4444] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#ff5a5a] disabled:opacity-60"
										>
											{deletingId === blog.id ? 'Deleting...' : 'Delete'}
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

export default function BlogsPage() {
	return (
		<ProtectedRoute>
			<BlogsContent />
		</ProtectedRoute>
	);
}
