import type { ContentFormData } from './types';
import { R2ImageUpload } from './R2ImageUpload';
import type { Category } from './types';

interface ContentMetaFormProps {
	formData: ContentFormData;
	categories: Category[];
	onTitleChange: (value: string) => void;
	onSlugChange: (value: string) => void;
	onSummaryChange: (value: string) => void;
	onAuthorChange: (value: string) => void;
	onToggleCategory: (categoryId: string) => void;
	onThumbnailUrlChange: (value: string, file?: File | null) => void;
	highlightErrors?: boolean;
}

export function ContentMetaForm({
	formData,
	categories,
	onTitleChange,
	onSlugChange,
	onSummaryChange,
	onAuthorChange,
	onToggleCategory,
	onThumbnailUrlChange,
	highlightErrors = false,
}: ContentMetaFormProps) {
	return (
		<div className="space-y-5 rounded-2xl border border-white/15 bg-white/[0.04] p-5 md:p-6">
			<div>
				<label className="mb-2 block text-sm font-medium text-white/75">Title *</label>
				<input
					type="text"
					required
					value={formData.title}
					onChange={(e) => onTitleChange(e.target.value)}
					className={`w-full rounded-xl border px-4 py-2.5 text-white outline-none transition focus:ring-2 ${
						highlightErrors && !formData.title.trim()
							? 'border-red-500/80 bg-red-500/10 focus:border-red-500 focus:ring-red-500/40'
							: 'border-white/15 bg-white/[0.06] focus:border-[#8c96ff] focus:ring-[#606bfa]/45'
					}`}
					placeholder="Content title"
				/>
			</div>

			<div>
				<label className="mb-2 block text-sm font-medium text-white/75">Slug *</label>
				<input
					type="text"
					required
					value={formData.slug}
					onChange={(e) => onSlugChange(e.target.value)}
					className={`w-full rounded-xl border px-4 py-2.5 text-white outline-none transition focus:ring-2 ${
						highlightErrors && !formData.slug.trim()
							? 'border-red-500/80 bg-red-500/10 focus:border-red-500 focus:ring-red-500/40'
							: 'border-white/15 bg-white/[0.06] focus:border-[#8c96ff] focus:ring-[#606bfa]/45'
					}`}
					placeholder="fastapi-best-practices"
				/>
			</div>

			<div>
				<label className="mb-2 block text-sm font-medium text-white/75">Author *</label>
				<input
					type="text"
					required
					value={formData.author}
					onChange={(e) => onAuthorChange(e.target.value)}
					className={`w-full rounded-xl border px-4 py-2.5 text-white outline-none transition focus:ring-2 ${
						highlightErrors && !formData.author.trim()
							? 'border-red-500/80 bg-red-500/10 focus:border-red-500 focus:ring-red-500/40'
							: 'border-white/15 bg-white/[0.06] focus:border-[#8c96ff] focus:ring-[#606bfa]/45'
					}`}
					placeholder="Author name"
				/>
			</div>

			<div>
				<label className="mb-2 block text-sm font-medium text-white/75">Summary *</label>
				<textarea
					required
					value={formData.summary}
					onChange={(e) => onSummaryChange(e.target.value)}
					className={`h-32 w-full rounded-xl border px-4 py-2.5 text-white outline-none transition focus:ring-2 ${
						highlightErrors && !formData.summary.trim()
							? 'border-red-500/80 bg-red-500/10 focus:border-red-500 focus:ring-red-500/40'
							: 'border-white/15 bg-white/[0.06] focus:border-[#8c96ff] focus:ring-[#606bfa]/45'
					}`}
					placeholder="Short summary used in listings"
				/>
			</div>

			<div>
				<label className="mb-2 block text-sm font-medium text-white/75">Categories</label>
				<details className="group rounded-xl border border-white/15 bg-white/[0.06]">
					<summary className="cursor-pointer list-none px-4 py-2.5 text-sm text-white/85">
						<div className="flex items-center justify-between gap-2">
							<span>
								{formData.category_ids.length > 0 ? `${formData.category_ids.length} selected` : 'Select categories'}
							</span>
							<span className="text-white/50 transition group-open:rotate-180">▾</span>
						</div>
					</summary>
					<div className="max-h-52 overflow-auto border-t border-white/10 px-3 py-2">
						{categories.length === 0 ? (
							<p className="px-1 py-2 text-sm text-white/50">No categories yet</p>
						) : (
							<div className="space-y-1.5">
								{categories.map((category) => {
									const checked = formData.category_ids.includes(category.id);
									return (
										<label
											key={category.id}
											className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/90 hover:bg-white/10"
										>
											<input
												type="checkbox"
												checked={checked}
												onChange={() => onToggleCategory(category.id)}
												className="h-4 w-4 accent-[#606bfa]"
											/>
											<span>{category.name}</span>
										</label>
									);
								})}
							</div>
						)}
					</div>
				</details>
			</div>

			<div
				className={
					highlightErrors && !formData.thumbnail_url.trim()
						? 'border-red-500/80 bg-red-500/10 rounded-xl border p-3'
						: ''
				}
			>
				<R2ImageUpload
					label="Thumbnail *"
					value={formData.thumbnail_url}
					onChange={onThumbnailUrlChange}
					hint="Upload a thumbnail before saving. This is required for create and update."
				/>
			</div>
		</div>
	);
}
