'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { R2ImageUpload } from '@/components/portal/content-editor/R2ImageUpload';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { authorsApi } from '@/lib/api';
import { uploadFileToR2 } from '@/lib/r2';

interface Author {
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
						<div className="mb-6 space-y-4 rounded-2xl border border-white/15 bg-white/[0.04] p-5">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-sm font-medium text-white/75">Name *</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										placeholder="John Doe"
										className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-white/75">Position</label>
									<input
										type="text"
										value={formData.position}
										onChange={(e) => setFormData({ ...formData, position: e.target.value })}
										placeholder="Software Engineer"
										className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-white/75">Organization</label>
									<input
										type="text"
										value={formData.organization}
										onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
										placeholder="Company Name"
										className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									/>
								</div>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">About</label>
								<textarea
									value={formData.about}
									onChange={(e) => setFormData({ ...formData, about: e.target.value })}
									placeholder="Brief bio or description"
									rows={3}
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
								/>
							</div>

							<R2ImageUpload
								label="Profile Picture"
								value={formData.profile_picture_url}
								onChange={(url, file) =>
									setFormData({ ...formData, profile_picture_url: url, profile_picture_file: file || null })
								}
								hint="Upload a profile picture. It will be uploaded to R2 when you save."
							/>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Social Links</label>
								<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
									<div>
										<label className="mb-1 block text-xs text-white/60">LinkedIn</label>
										<input
											type="url"
											value={formData.social_links.linkedin || ''}
											onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
											placeholder="https://linkedin.com/in/username"
											className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
										/>
									</div>
									<div>
										<label className="mb-1 block text-xs text-white/60">Twitter</label>
										<input
											type="url"
											value={formData.social_links.twitter || ''}
											onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
											placeholder="https://twitter.com/username"
											className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
										/>
									</div>
									<div>
										<label className="mb-1 block text-xs text-white/60">GitHub</label>
										<input
											type="url"
											value={formData.social_links.github || ''}
											onChange={(e) => handleSocialLinkChange('github', e.target.value)}
											placeholder="https://github.com/username"
											className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
										/>
									</div>
									<div>
										<label className="mb-1 block text-xs text-white/60">Website</label>
										<input
											type="url"
											value={formData.social_links.website || ''}
											onChange={(e) => handleSocialLinkChange('website', e.target.value)}
											placeholder="https://yourwebsite.com"
											className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
										/>
									</div>
								</div>
							</div>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={isEditing ? handleUpdate : handleCreate}
									disabled={saving}
									className="rounded-xl bg-[#606bfa] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
								>
									{saving ? 'Saving...' : isEditing ? 'Update Author' : 'Create Author'}
								</button>
								<button
									type="button"
									onClick={resetForm}
									disabled={saving}
									className="rounded-xl border border-white/15 bg-white/[0.06] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:opacity-60"
								>
									Cancel
								</button>
							</div>
						</div>
					)}

					{!isCreating && !isEditing && (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{authors.length === 0 ? (
								<p className="text-sm text-white/55">No authors yet</p>
							) : (
								authors.map((author) => (
									<div
										key={author.id}
										className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#7d89ff]/60"
									>
										<div className="flex flex-1 flex-col p-5">
											<div className="mb-4 flex items-center gap-4">
												{author.profile_picture_url ? (
													// eslint-disable-next-line @next/next/no-img-element
													<img
														src={author.profile_picture_url}
														alt={author.name}
														className="h-16 w-16 rounded-full border-2 border-white/20 object-cover"
													/>
												) : (
													<div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-white/[0.08] text-2xl font-bold text-white/60">
														{author.name.charAt(0).toUpperCase()}
													</div>
												)}
												<div className="flex-1">
													<h3 className="text-lg font-semibold text-white">{author.name}</h3>
													{author.position && <p className="text-sm text-white/60">{author.position}</p>}
													{author.organization && <p className="text-xs text-white/45">{author.organization}</p>}
												</div>
											</div>

											{author.about && <p className="mb-4 line-clamp-2 text-sm text-white/70">{author.about}</p>}

											<div className="mb-4 flex flex-wrap gap-2">
												{author.social_links?.linkedin && (
													<a
														href={author.social_links.linkedin}
														target="_blank"
														rel="noopener noreferrer"
														className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-1 text-xs text-white/80 hover:bg-white/[0.1]"
													>
														LinkedIn
													</a>
												)}
												{author.social_links?.twitter && (
													<a
														href={author.social_links.twitter}
														target="_blank"
														rel="noopener noreferrer"
														className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-1 text-xs text-white/80 hover:bg-white/[0.1]"
													>
														Twitter
													</a>
												)}
												{author.social_links?.github && (
													<a
														href={author.social_links.github}
														target="_blank"
														rel="noopener noreferrer"
														className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-1 text-xs text-white/80 hover:bg-white/[0.1]"
													>
														GitHub
													</a>
												)}
												{author.social_links?.website && (
													<a
														href={author.social_links.website}
														target="_blank"
														rel="noopener noreferrer"
														className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-1 text-xs text-white/80 hover:bg-white/[0.1]"
													>
														Website
													</a>
												)}
											</div>

											<p className="text-xs text-white/45">
												Created {new Date(author.created_at).toLocaleDateString()}
											</p>

											<div className="mt-4 flex gap-2">
												<button
													type="button"
													onClick={() => handleEdit(author)}
													className="flex-1 rounded-lg bg-[#606bfa] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#6f79ff]"
												>
													Edit
												</button>
												<button
													type="button"
													onClick={() => setPendingDeleteId(author.id)}
													disabled={deleting}
													className="flex-1 rounded-lg bg-[#ef4444] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#ff5a5a] disabled:opacity-60"
												>
													Delete
												</button>
											</div>
										</div>
									</div>
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
