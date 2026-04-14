import type { BlogFormData } from './types';
import { R2ImageUpload } from './R2ImageUpload';

interface BlogMetaFormProps {
	formData: BlogFormData;
	onTitleChange: (value: string) => void;
	onSlugChange: (value: string) => void;
	onSummaryChange: (value: string) => void;
	onAuthorChange: (value: string) => void;
	onThumbnailUrlChange: (value: string, file?: File | null) => void;
	highlightErrors?: boolean;
}

export function BlogMetaForm({
	formData,
	onTitleChange,
	onSlugChange,
	onSummaryChange,
	onAuthorChange,
	onThumbnailUrlChange,
	highlightErrors = false,
}: BlogMetaFormProps) {
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
					placeholder="Blog title"
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
