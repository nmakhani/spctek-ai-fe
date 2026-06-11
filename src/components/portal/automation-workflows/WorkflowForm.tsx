import { R2ImageUpload } from '@/components/portal/content-editor/R2ImageUpload';
import type { Category } from '@/components/portal/content-editor/types';
import type { WorkflowClass, WorkflowFormData } from './types';

interface WorkflowFormProps {
	formData: WorkflowFormData;
	categories: Category[];
	editing: boolean;
	saving: boolean;
	onChange: (formData: WorkflowFormData) => void;
	onSubmit: (event: React.FormEvent) => void;
	onCancel: () => void;
}

export function WorkflowForm({
	formData,
	categories,
	editing,
	saving,
	onChange,
	onSubmit,
	onCancel,
}: WorkflowFormProps) {
	const updateField = <K extends keyof WorkflowFormData>(field: K, value: WorkflowFormData[K]) => {
		onChange({ ...formData, [field]: value });
	};

	const toggleCategory = (categoryId: string) => {
		const categoryIds = formData.categoryIds.includes(categoryId)
			? formData.categoryIds.filter((id) => id !== categoryId)
			: [...formData.categoryIds, categoryId];

		updateField('categoryIds', categoryIds);
	};

	return (
		<div className="my-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
			<h2 className="mb-4 text-xl font-semibold text-white">{editing ? 'Edit Workflow' : 'New Workflow'}</h2>
			<form onSubmit={onSubmit} className="space-y-5">
				<div className="grid gap-5 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-medium text-white/75">Name *</label>
						<input
							type="text"
							value={formData.name}
							onChange={(event) => updateField('name', event.target.value)}
							placeholder="Lead Qualification Agent"
							className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-white/75">Class *</label>
						<select
							value={formData.workflowClass}
							onChange={(event) => updateField('workflowClass', event.target.value as WorkflowClass)}
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
						onChange={(event) => updateField('teaser', event.target.value)}
						placeholder="Qualify inbound leads and route the best-fit opportunities."
						className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-white/75">Description Body *</label>
					<textarea
						value={formData.descriptionBody}
						onChange={(event) => updateField('descriptionBody', event.target.value)}
						rows={4}
						placeholder="Explain what the workflow does and when to use it."
						className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
				</div>

				<div className="grid gap-5 md:grid-cols-2">
					<div className="space-y-5">
						<div>
							<label className="mb-2 block text-sm font-medium text-white/75">Bullets</label>
							<textarea
								value={formData.descriptionBullets}
								onChange={(event) => updateField('descriptionBullets', event.target.value)}
								rows={5}
								placeholder="One bullet per line"
								className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
							/>
						</div>

						<div>
							<label className="mb-2 block text-sm font-medium text-white/75">Link</label>
							<input
								type="text"
								value={formData.link}
								onChange={(event) => updateField('link', event.target.value)}
								placeholder="/contact"
								className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
							/>
						</div>
					</div>

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
							onChange={(url, file) => onChange({ ...formData, thumbnailUrl: url, thumbnailFile: file || null })}
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
						{saving ? 'Saving...' : editing ? 'Update' : 'Create'}
					</button>
					<button
						type="button"
						onClick={onCancel}
						disabled={saving}
						className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 text-white/85 transition hover:bg-white/[0.14] disabled:opacity-60"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
