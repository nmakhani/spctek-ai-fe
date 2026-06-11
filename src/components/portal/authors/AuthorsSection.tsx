import { AuthorCard } from './AuthorCard';
import { AuthorForm } from './AuthorForm';
import type { Author, AuthorFormData } from './types';

interface AuthorsSectionProps {
	authors: Author[];
	formData: AuthorFormData;
	isCreating: boolean;
	isEditing: boolean;
	saving: boolean;
	deleting: boolean;
	onStartCreate: () => void;
	onEdit: (author: Author) => void;
	onDelete: (id: string) => void;
	onFormChange: (formData: AuthorFormData) => void;
	onSocialLinkChange: (platform: string, value: string) => void;
	onSave: () => void | Promise<void>;
	onCancel: () => void;
}

export function AuthorsSection({
	authors,
	formData,
	isCreating,
	isEditing,
	saving,
	deleting,
	onStartCreate,
	onEdit,
	onDelete,
	onFormChange,
	onSocialLinkChange,
	onSave,
	onCancel,
}: AuthorsSectionProps) {
	return (
		<section className="border-white/18 mb-8 mt-6 rounded-3xl border bg-white/[0.04] p-5 md:p-6">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-xl font-semibold text-white">
					{isEditing ? 'Edit Author' : isCreating ? 'Create New Author' : 'Authors'}
				</h2>
				{!isCreating && !isEditing && (
					<button
						type="button"
						onClick={onStartCreate}
						className="rounded-xl bg-[#606bfa] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6f79ff]"
					>
						+ Add Author
					</button>
				)}
			</div>

			{(isCreating || isEditing) && (
				<AuthorForm
					formData={formData}
					isEditing={isEditing}
					saving={saving}
					onChange={onFormChange}
					onSocialLinkChange={onSocialLinkChange}
					onSave={onSave}
					onCancel={onCancel}
				/>
			)}

			{!isCreating && !isEditing && (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{authors.length === 0 ? (
						<p className="text-sm text-white/55">No authors yet</p>
					) : (
						authors.map((author) => (
							<AuthorCard key={author.id} author={author} onEdit={onEdit} onDelete={onDelete} deleting={deleting} />
						))
					)}
				</div>
			)}
		</section>
	);
}
