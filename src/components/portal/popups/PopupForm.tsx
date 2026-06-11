import type { PopupFormData } from './types';

interface PopupFormProps {
	formData: PopupFormData;
	editing: boolean;
	saving: boolean;
	onChange: (formData: PopupFormData) => void;
	onSubmit: (event: React.FormEvent) => void;
	onCancel: () => void;
}

export function PopupForm({ formData, editing, saving, onChange, onSubmit, onCancel }: PopupFormProps) {
	const updateField = <K extends keyof PopupFormData>(field: K, value: PopupFormData[K]) => {
		onChange({ ...formData, [field]: value });
	};

	return (
		<div className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
			<h2 className="mb-4 text-xl font-semibold text-white">{editing ? 'Edit Popup' : 'New Popup'}</h2>
			<form onSubmit={onSubmit} className="space-y-5">
				<div>
					<label className="mb-2 block text-sm font-medium text-white/75">Path *</label>
					<input
						type="text"
						value={formData.path}
						onChange={(event) => updateField('path', event.target.value)}
						placeholder="/about"
						className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-white/75">Title *</label>
					<input
						type="text"
						value={formData.title}
						onChange={(event) => updateField('title', event.target.value)}
						placeholder="Free Strategy Review"
						className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-white/75">Content *</label>
					<textarea
						value={formData.content}
						onChange={(event) => updateField('content', event.target.value)}
						rows={3}
						placeholder="Short popup body text"
						className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
				</div>

				<div className="grid gap-5 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-medium text-white/75">CTA Text *</label>
						<input
							type="text"
							value={formData.cta_text}
							onChange={(event) => updateField('cta_text', event.target.value)}
							placeholder="Book a Call"
							className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-white/75">CTA Link *</label>
						<input
							type="text"
							value={formData.cta_link}
							onChange={(event) => updateField('cta_link', event.target.value)}
							placeholder="/contact"
							className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
						/>
					</div>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-white/75">Delay (milliseconds) *</label>
					<input
						type="number"
						min={0}
						value={formData.delay}
						onChange={(event) => updateField('delay', event.target.value)}
						className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
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
