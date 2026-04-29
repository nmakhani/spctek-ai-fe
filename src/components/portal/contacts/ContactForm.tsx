'use client';

interface ContactFormData {
	name: string;
	email: string;
	phone: string;
	company: string;
	message: string;
	source: string;
}

interface ContactFormProps {
	formData: ContactFormData;
	editingId: string | null;
	saving: boolean;
	onChange: (data: ContactFormData) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export function ContactForm({ formData, editingId, saving, onChange, onSubmit, onCancel }: ContactFormProps) {
	return (
		<div className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
			<h2 className="mb-4 text-xl font-semibold text-white">{editingId ? 'Edit Contact' : 'New Contact'}</h2>
			<form onSubmit={onSubmit} className="space-y-5">
				<FormInput
					label="Name"
					type="text"
					value={formData.name}
					placeholder="John Doe"
					onChange={(value) => onChange({ ...formData, name: value })}
				/>
				<FormInput
					label="Email"
					type="email"
					value={formData.email}
					placeholder="john@example.com"
					onChange={(value) => onChange({ ...formData, email: value })}
				/>
				<FormInput
					label="Phone"
					type="tel"
					value={formData.phone}
					placeholder="+1 555 123 4567"
					onChange={(value) => onChange({ ...formData, phone: value })}
				/>
				<FormInput
					label="Company"
					type="text"
					value={formData.company}
					placeholder="Acme Inc."
					onChange={(value) => onChange({ ...formData, company: value })}
				/>
				<div>
					<label className="mb-2 block text-sm font-medium text-white/75">Message</label>
					<textarea
						value={formData.message}
						onChange={(e) => onChange({ ...formData, message: e.target.value })}
						className="h-28 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
						placeholder="Message details"
					/>
				</div>
				<FormInput
					label="Source"
					type="text"
					value={formData.source}
					placeholder="landing_page"
					onChange={(value) => onChange({ ...formData, source: value })}
				/>
				<p className="text-xs text-white/60">Note: backend requires at least one of Email or Phone.</p>
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

interface FormInputProps {
	label: string;
	type: string;
	value: string;
	placeholder: string;
	onChange: (value: string) => void;
}

function FormInput({ label, type, value, placeholder, onChange }: FormInputProps) {
	return (
		<div>
			<label className="mb-2 block text-sm font-medium text-white/75">{label}</label>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
				placeholder={placeholder}
			/>
		</div>
	);
}
