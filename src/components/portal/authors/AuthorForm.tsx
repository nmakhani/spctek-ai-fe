'use client';

import { R2ImageUpload } from '@/components/portal/content-editor/R2ImageUpload';

interface AuthorFormData {
	name: string;
	profile_picture_url: string;
	profile_picture_file: File | null;
	about: string;
	organization: string;
	position: string;
	social_links: Record<string, string>;
}

interface AuthorFormProps {
	formData: AuthorFormData;
	isEditing: boolean;
	saving: boolean;
	onChange: (data: AuthorFormData) => void;
	onSocialLinkChange: (platform: string, value: string) => void;
	onSave: () => void;
	onCancel: () => void;
}

export function AuthorForm({
	formData,
	isEditing,
	saving,
	onChange,
	onSocialLinkChange,
	onSave,
	onCancel,
}: AuthorFormProps) {
	return (
		<div className="mb-6 space-y-4 rounded-2xl border border-white/15 bg-white/[0.04] p-5">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormInput
					label="Name *"
					type="text"
					value={formData.name}
					placeholder="John Doe"
					onChange={(value) => onChange({ ...formData, name: value })}
				/>
				<FormInput
					label="Position"
					type="text"
					value={formData.position}
					placeholder="Software Engineer"
					onChange={(value) => onChange({ ...formData, position: value })}
				/>
				<FormInput
					label="Organization"
					type="text"
					value={formData.organization}
					placeholder="Company Name"
					onChange={(value) => onChange({ ...formData, organization: value })}
				/>
			</div>

			<div>
				<label className="mb-2 block text-sm font-medium text-white/75">About</label>
				<textarea
					value={formData.about}
					onChange={(e) => onChange({ ...formData, about: e.target.value })}
					placeholder="Brief bio or description"
					rows={3}
					className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
				/>
			</div>

			<R2ImageUpload
				label="Profile Picture"
				value={formData.profile_picture_url}
				onChange={(url, file) =>
					onChange({ ...formData, profile_picture_url: url, profile_picture_file: file || null })
				}
				hint="Upload a profile picture. It will be uploaded to R2 when you save."
			/>

			<SocialLinksSection socialLinks={formData.social_links} onChange={onSocialLinkChange} />

			<div className="flex gap-3">
				<button
					type="button"
					onClick={onSave}
					disabled={saving}
					className="rounded-xl bg-[#606bfa] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
				>
					{saving ? 'Saving...' : isEditing ? 'Update Author' : 'Create Author'}
				</button>
				<button
					type="button"
					onClick={onCancel}
					disabled={saving}
					className="rounded-xl border border-white/15 bg-white/[0.06] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:opacity-60"
				>
					Cancel
				</button>
			</div>
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
				placeholder={placeholder}
				className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
			/>
		</div>
	);
}

interface SocialLinksSectionProps {
	socialLinks: Record<string, string>;
	onChange: (platform: string, value: string) => void;
}

function SocialLinksSection({ socialLinks, onChange }: SocialLinksSectionProps) {
	return (
		<div>
			<label className="mb-2 block text-sm font-medium text-white/75">Social Links</label>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<SocialLinkInput
					label="LinkedIn"
					value={socialLinks.linkedin || ''}
					placeholder="https://linkedin.com/in/username"
					onChange={(value) => onChange('linkedin', value)}
				/>
				<SocialLinkInput
					label="Twitter"
					value={socialLinks.twitter || ''}
					placeholder="https://twitter.com/username"
					onChange={(value) => onChange('twitter', value)}
				/>
				<SocialLinkInput
					label="GitHub"
					value={socialLinks.github || ''}
					placeholder="https://github.com/username"
					onChange={(value) => onChange('github', value)}
				/>
				<SocialLinkInput
					label="Website"
					value={socialLinks.website || ''}
					placeholder="https://yourwebsite.com"
					onChange={(value) => onChange('website', value)}
				/>
			</div>
		</div>
	);
}

interface SocialLinkInputProps {
	label: string;
	value: string;
	placeholder: string;
	onChange: (value: string) => void;
}

function SocialLinkInput({ label, value, placeholder, onChange }: SocialLinkInputProps) {
	return (
		<div>
			<label className="mb-1 block text-xs text-white/60">{label}</label>
			<input
				type="url"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
			/>
		</div>
	);
}
