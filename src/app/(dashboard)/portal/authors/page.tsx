'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AuthorsSection } from '@/components/portal/authors/AuthorsSection';
import type { Author, AuthorFormData } from '@/components/portal/authors/types';
import { authorToFormData, EMPTY_AUTHOR_FORM, getErrorMessage } from '@/components/portal/authors/utils';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { authorsApi } from '@/lib/api';
import { uploadFileToR2 } from '@/lib/r2';

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
	const [formData, setFormData] = useState<AuthorFormData>(EMPTY_AUTHOR_FORM);

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
		setFormData(EMPTY_AUTHOR_FORM);
		setIsCreating(false);
		setIsEditing(false);
		setEditingAuthorId(null);
	};

	const buildAuthorPayload = async () => {
		let profilePictureUrl = formData.profile_picture_url;

		if (formData.profile_picture_file) {
			const uploadResult = await uploadFileToR2(formData.profile_picture_file);
			profilePictureUrl = uploadResult.publicUrl;
		}

		return {
			name: formData.name,
			profile_picture_url: profilePictureUrl || null,
			about: formData.about || null,
			organization: formData.organization || null,
			position: formData.position || null,
			social_links: formData.social_links,
		};
	};

	const handleCreate = async () => {
		if (!formData.name.trim()) {
			toast.error('Author name is required');
			return;
		}

		try {
			setSaving(true);
			await authorsApi.create(await buildAuthorPayload());
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
		setFormData(authorToFormData(author));
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
			await authorsApi.update(editingAuthorId, await buildAuthorPayload());
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

			<PageHeader title="Authors" subtitle="Dashboard" backLink="/portal" backText="Back to Home" />

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<StatCard label="Total Authors" loading={loading} count={authors.length} />
					<StatCard label="Active Authors" loading={loading} count={authors.length} />
				</div>

				<AuthorsSection
					authors={authors}
					formData={formData}
					isCreating={isCreating}
					isEditing={isEditing}
					saving={saving}
					deleting={deleting}
					onStartCreate={() => {
						resetForm();
						setIsCreating(true);
					}}
					onEdit={handleEdit}
					onDelete={setPendingDeleteId}
					onFormChange={setFormData}
					onSocialLinkChange={handleSocialLinkChange}
					onSave={isEditing ? handleUpdate : handleCreate}
					onCancel={resetForm}
				/>

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
