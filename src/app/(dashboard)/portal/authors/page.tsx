'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AuthorCard } from '@/components/portal/authors/AuthorCard';
import { AuthorForm } from '@/components/portal/authors/AuthorForm';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { authorsApi } from '@/lib/api';
import { uploadFileToR2 } from '@/lib/r2';

export interface Author {
	id: string;
	name: string;
	profile_picture_url?: string | null;
	about?: string | null;
	organization?: string | null;
	position?: string | null;
	social_links?: Record<string, string>;
	created_at: string;
	updated_at: string;
}

interface AuthorFormData {
	name: string;
	profile_picture_url: string;
	profile_picture_file: File | null;
	about: string;
	organization: string;
	position: string;
	social_links: Record<string, string>;
}

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function AuthorsContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [authors, setAuthors] = useState<Author[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const [formData, setFormData] = useState<AuthorFormData>({
		name: '',
		profile_picture_url: '',
		profile_picture_file: null,
		about: '',
		organization: '',
		position: '',
		social_links: {},
	});

	const fetchAuthors = async () => {
		try {
			setLoading(true);
			const response = await authorsApi.list();
			setAuthors(response.data as Author[]);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load authors');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchAuthors();
	}, []);

	const resetForm = () => {
		setFormData({
			name: '',
			profile_picture_url: '',
			profile_picture_file: null,
			about: '',
			organization: '',
			position: '',
			social_links: {},
		});
		setIsCreating(false);
		setIsEditing(false);
		setEditingAuthorId(null);
	};

	const handleCreate = async () => {
		if (!formData.name.trim()) {
			toast.error('Author name is required');
			return;
		}

		try {
			setSaving(true);
			let profilePictureUrl = formData.profile_picture_url;

			// Upload image if file is selected
			if (formData.profile_picture_file) {
				const uploadResult = await uploadFileToR2(formData.profile_picture_file);
				profilePictureUrl = uploadResult.publicUrl;
			}

			await authorsApi.create({
				name: formData.name,
				profile_picture_url: profilePictureUrl || null,
				about: formData.about || null,
				organization: formData.organization || null,
				position: formData.position || null,
				social_links: formData.social_links,
			});

			resetForm();
			await fetchAuthors();
			toast.success('Author created');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to create author');
			setError(message);
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = (author: Author) => {
		setFormData({
			name: author.name,
			profile_picture_url: author.profile_picture_url || '',
			profile_picture_file: null,
			about: author.about || '',
			organization: author.organization || '',
			position: author.position || '',
			social_links: author.social_links || {},
		});
		setEditingAuthorId(author.id);
		setIsEditing(true);
		setIsCreating(false);
	};

	const handleUpdate = async () => {
		if (!editingAuthorId || !formData.name.trim()) {
			toast.error('Author name is required');
			return;
		}

		try {
			setSaving(true);
			let profilePictureUrl = formData.profile_picture_url;

			// Upload image if file is selected
			if (formData.profile_picture_file) {
				const uploadResult = await uploadFileToR2(formData.profile_picture_file);
				profilePictureUrl = uploadResult.publicUrl;
			}

			await authorsApi.update(editingAuthorId, {
				name: formData.name,
				profile_picture_url: profilePictureUrl || null,
				about: formData.about || null,
				organization: formData.organization || null,
				position: formData.position || null,
				social_links: formData.social_links,
			});

			resetForm();
			await fetchAuthors();
			toast.success('Author updated');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to update author');
			setError(message);
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!pendingDeleteId) return;

		try {
			setDeleting(true);
			await authorsApi.delete(pendingDeleteId);
			setPendingDeleteId(null);
			await fetchAuthors();
			toast.success('Author deleted');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete author');
			setError(message);
			toast.error(message);
		} finally {
			setDeleting(false);
		}
	};

	const handleSocialLinkChange = (platform: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			social_links: {
				...prev.social_links,
				[platform]: value,
			},
		}));
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={Boolean(pendingDeleteId)}
				title="Delete author"
				message="Deleting an author will remove their association from content. Continue?"
				confirmLabel="Delete"
				loading={deleting}
				onConfirm={handleDelete}
				onCancel={() => {
					if (!deleting) {
						setPendingDeleteId(null);
					}
				}}
			/>

			<PageHeader title="Authors" subtitle="Dashboard" backLink="/portal" backText="← Back to Home" />

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<StatCard label="Total Authors" loading={loading} count={authors.length} />
					<StatCard label="Active Authors" loading={loading} count={authors.length} />
				</div>

				<section className="border-white/18 mb-8 mt-6 rounded-3xl border bg-white/[0.04] p-5 md:p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-xl font-semibold text-white">
							{isEditing ? 'Edit Author' : isCreating ? 'Create New Author' : 'Authors'}
						</h2>
						{!isCreating && !isEditing && (
							<button
								type="button"
								onClick={() => {
									resetForm();
									setIsCreating(true);
								}}
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
							onChange={setFormData}
							onSocialLinkChange={handleSocialLinkChange}
							onSave={isEditing ? handleUpdate : handleCreate}
							onCancel={resetForm}
						/>
					)}

					{!isCreating && !isEditing && (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{authors.length === 0 ? (
								<p className="text-sm text-white/55">No authors yet</p>
							) : (
								authors.map((author) => (
									<AuthorCard
										key={author.id}
										author={author}
										onEdit={handleEdit}
										onDelete={setPendingDeleteId}
										deleting={deleting}
									/>
								))
							)}
						</div>
					)}
				</section>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}
			</main>
		</div>
	);
}

export default function AuthorsPage() {
	return (
		<ProtectedRoute>
			<AuthorsContent />
		</ProtectedRoute>
	);
}
