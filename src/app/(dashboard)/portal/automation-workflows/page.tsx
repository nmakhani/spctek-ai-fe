'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { R2ImageUpload } from '@/components/portal/content-editor/R2ImageUpload';
import { type Category } from '@/components/portal/content-editor/types';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { automationWorkflowsApi, categoriesApi } from '@/lib/api';
import { uploadFileToR2 } from '@/lib/r2';

type WorkflowClass = 'system' | 'plugin';

interface AutomationWorkflow {
	id: string;
	name: string;
	teaser: string;
	class: WorkflowClass;
	description: {
		body: string;
		bullets: string[];
	};
	link?: string | null;
	thumbnail_url?: string | null;
	categories: Category[];
	created_at: string;
	updated_at: string;
}

interface WorkflowFormData {
	name: string;
	teaser: string;
	workflowClass: WorkflowClass;
	descriptionBody: string;
	descriptionBullets: string;
	link: string;
	thumbnailUrl: string;
	thumbnailFile: File | null;
	categoryIds: string[];
}

const EMPTY_FORM: WorkflowFormData = {
	name: '',
	teaser: '',
	workflowClass: 'system',
	descriptionBody: '',
	descriptionBullets: '',
	link: '',
	thumbnailUrl: '',
	thumbnailFile: null,
	categoryIds: [],
};

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function AutomationWorkflowsContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [formData, setFormData] = useState<WorkflowFormData>(EMPTY_FORM);

	const fetchData = async () => {
		try {
			setLoading(true);
			const [workflowsResponse, categoriesResponse] = await Promise.all([
				automationWorkflowsApi.list(),
				categoriesApi.list(),
			]);
			setWorkflows(workflowsResponse.data as AutomationWorkflow[]);
			setCategories(categoriesResponse.data as Category[]);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load automation workflows');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchData();
	}, []);

	const resetForm = () => {
		setFormData(EMPTY_FORM);
		setEditingId(null);
		setShowForm(false);
	};

	const buildPayload = async () => {
		const bullets = formData.descriptionBullets
			.split('\n')
			.map((bullet) => bullet.trim())
			.filter(Boolean);
		let thumbnailUrl = formData.thumbnailUrl;

		if (formData.thumbnailFile) {
			const uploadResult = await uploadFileToR2(formData.thumbnailFile);
			thumbnailUrl = uploadResult.publicUrl;
		}

		return {
			name: formData.name.trim(),
			teaser: formData.teaser.trim(),
			class: formData.workflowClass,
			description: {
				body: formData.descriptionBody.trim(),
				bullets,
			},
			link: formData.link.trim() || null,
			thumbnail_url: thumbnailUrl || null,
			category_ids: formData.categoryIds,
		};
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!formData.name.trim() || !formData.teaser.trim() || !formData.descriptionBody.trim()) {
			toast.error('Name, teaser, and description are required');
			return;
		}

		try {
			setSaving(true);
			setError('');
			const payload = await buildPayload();

			if (editingId) {
				const response = await automationWorkflowsApi.update(editingId, payload);
				const updated = response.data as AutomationWorkflow;
				setWorkflows((prev) => prev.map((workflow) => (workflow.id === editingId ? updated : workflow)));
				toast.success('Workflow updated');
			} else {
				const response = await automationWorkflowsApi.create(payload);
				const created = response.data as AutomationWorkflow;
				setWorkflows((prev) => [created, ...prev]);
				toast.success('Workflow created');
			}

			resetForm();
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to save automation workflow');
			setError(message);
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = (workflow: AutomationWorkflow) => {
		setFormData({
			name: workflow.name,
			teaser: workflow.teaser,
			workflowClass: workflow.class,
			descriptionBody: workflow.description.body,
			descriptionBullets: workflow.description.bullets.join('\n'),
			link: workflow.link || '',
			thumbnailUrl: workflow.thumbnail_url || '',
			thumbnailFile: null,
			categoryIds: workflow.categories.map((category) => category.id),
		});
		setEditingId(workflow.id);
		setShowForm(true);
	};

	const toggleCategory = (categoryId: string) => {
		setFormData((prev) => {
			const categoryIds = prev.categoryIds.includes(categoryId)
				? prev.categoryIds.filter((id) => id !== categoryId)
				: [...prev.categoryIds, categoryId];

			return { ...prev, categoryIds };
		});
	};

	const handleDelete = async () => {
		if (!pendingDeleteId) return;

		try {
			setDeletingId(pendingDeleteId);
			setError('');
			await automationWorkflowsApi.delete(pendingDeleteId);
			setWorkflows((prev) => prev.filter((workflow) => workflow.id !== pendingDeleteId));
			setPendingDeleteId(null);
			toast.success('Workflow deleted');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete automation workflow');
			setError(message);
			toast.error(message);
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={Boolean(pendingDeleteId)}
				title="Delete workflow"
				message="This automation workflow will be removed from the portal. Continue?"
				confirmLabel="Delete"
				loading={Boolean(deletingId)}
				onConfirm={handleDelete}
				onCancel={() => {
					if (!deletingId) setPendingDeleteId(null);
				}}
			/>

			<PageHeader
				title="Automation Workflows"
				subtitle="Dashboard"
				backLink="/portal"
				backText="Back to Home"
				buttonText="+ New Workflow"
				buttonOnClick={() => setShowForm(!showForm)}
				showForm={showForm}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<StatCard label="Total Workflows" loading={loading} count={workflows.length} />
					<StatCard
						label="System"
						loading={loading}
						count={workflows.filter((item) => item.class === 'system').length}
					/>
					<StatCard
						label="Plugin"
						loading={loading}
						count={workflows.filter((item) => item.class === 'plugin').length}
					/>
				</div>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 mt-6 rounded-2xl border px-4 py-3">
						{error}
					</div>
				)}

				{showForm && (
					<div className="my-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
						<h2 className="mb-4 text-xl font-semibold text-white">{editingId ? 'Edit Workflow' : 'New Workflow'}</h2>
						<form onSubmit={handleSubmit} className="space-y-5">
							<div className="grid gap-5 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-sm font-medium text-white/75">Name *</label>
									<input
										type="text"
										value={formData.name}
										onChange={(event) => setFormData({ ...formData, name: event.target.value })}
										placeholder="Lead Qualification Agent"
										className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									/>
								</div>
								<div>
									<label className="mb-2 block text-sm font-medium text-white/75">Class *</label>
									<select
										value={formData.workflowClass}
										onChange={(event) =>
											setFormData({ ...formData, workflowClass: event.target.value as WorkflowClass })
										}
										className="w-full rounded-xl border border-white/15 bg-[#111827] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									>
										<option value="system">System</option>
										<option value="plugin">Plugin</option>
									</select>
								</div>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Teaser *</label>
								<input
									type="text"
									value={formData.teaser}
									onChange={(event) => setFormData({ ...formData, teaser: event.target.value })}
									placeholder="Qualify inbound leads and route the best-fit opportunities."
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Description Body *</label>
								<textarea
									value={formData.descriptionBody}
									onChange={(event) => setFormData({ ...formData, descriptionBody: event.target.value })}
									rows={4}
									placeholder="Explain what the workflow does and when to use it."
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
								/>
							</div>

							<div className="grid gap-5 md:grid-cols-2">
								{/* Left Column: Bullets + Link */}
								<div className="space-y-5">
									<div>
										<label className="mb-2 block text-sm font-medium text-white/75">Bullets</label>
										<textarea
											value={formData.descriptionBullets}
											onChange={(event) => setFormData({ ...formData, descriptionBullets: event.target.value })}
											rows={5}
											placeholder={'One bullet per line'}
											className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
										/>
									</div>

									<div>
										<label className="mb-2 block text-sm font-medium text-white/75">Link</label>
										<input
											type="text"
											value={formData.link}
											onChange={(event) => setFormData({ ...formData, link: event.target.value })}
											placeholder="/contact"
											className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
										/>
									</div>
								</div>

								{/* Right Column: Categories + Thumbnail */}
								<div className="space-y-5">
									<div>
										<label className="mb-2 block text-sm font-medium text-white/75">Categories</label>
										<div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-white/15 bg-white/[0.04] p-3">
											{categories.length === 0 ? (
												<p className="text-sm text-white/50">No categories available</p>
											) : (
												categories.map((category) => (
													<label key={category.id} className="flex items-center gap-2 text-sm text-white/80">
														<input
															type="checkbox"
															checked={formData.categoryIds.includes(category.id)}
															onChange={() => toggleCategory(category.id)}
															className="h-4 w-4 rounded border-white/20 bg-white/[0.08] accent-[#606bfa]"
														/>
														<span>{category.name}</span>
													</label>
												))
											)}
										</div>
									</div>

									<R2ImageUpload
										label="Thumbnail"
										value={formData.thumbnailUrl}
										onChange={(url, file) =>
											setFormData({ ...formData, thumbnailUrl: url, thumbnailFile: file || null })
										}
										hint="Upload a thumbnail. It will be uploaded to R2 when you save."
									/>
								</div>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									type="submit"
									disabled={saving}
									className="rounded-xl bg-[#606bfa] px-4 py-2 font-semibold text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
								>
									{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
								</button>
								<button
									type="button"
									onClick={resetForm}
									disabled={saving}
									className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 text-white/85 transition hover:bg-white/[0.14] disabled:opacity-60"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				{loading ? (
					<div className="py-12 text-center text-white/55">Loading automation workflows...</div>
				) : workflows.length === 0 ? (
					<div className="py-12 text-center text-white/55">No automation workflows yet</div>
				) : (
					<div className="mt-8 overflow-x-auto rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] shadow-[0_20px_50px_rgba(0,0,0,0.58)] backdrop-blur-xl">
						<table className="w-full">
							<thead className="border-b border-white/10 bg-black/25">
								<tr>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Name</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Thumbnail</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Class</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Categories</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Teaser</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Updated</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Actions</th>
								</tr>
							</thead>
							<tbody>
								{workflows.map((workflow) => (
									<tr key={workflow.id} className="border-b border-white/10 transition hover:bg-white/[0.05]">
										<td className="px-6 py-3 font-medium text-white">{workflow.name}</td>
										<td className="px-6 py-3">
											{workflow.thumbnail_url ? (
												<img src={workflow.thumbnail_url} alt="" className="h-12 w-16 rounded-lg object-cover" />
											) : (
												<span className="text-sm text-white/45">None</span>
											)}
										</td>
										<td className="px-6 py-3 capitalize text-white/75">{workflow.class}</td>
										<td className="px-6 py-3 text-white/75">
											{workflow.categories.length > 0
												? workflow.categories.map((category) => category.name).join(', ')
												: 'Uncategorized'}
										</td>
										<td className="max-w-md px-6 py-3 text-white/70">{workflow.teaser}</td>
										<td className="px-6 py-3 text-white/65">{new Date(workflow.updated_at).toLocaleDateString()}</td>
										<td className="px-6 py-3">
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => handleEdit(workflow)}
													disabled={deletingId === workflow.id}
													className="rounded-lg bg-[#606bfa] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
												>
													Edit
												</button>
												<button
													type="button"
													onClick={() => setPendingDeleteId(workflow.id)}
													disabled={deletingId === workflow.id}
													className="rounded-lg bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#ff5a5a] disabled:cursor-not-allowed disabled:opacity-50"
												>
													{deletingId === workflow.id ? 'Deleting...' : 'Delete'}
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</div>
	);
}

export default function AutomationWorkflowsPage() {
	return (
		<ProtectedRoute>
			<AutomationWorkflowsContent />
		</ProtectedRoute>
	);
}
