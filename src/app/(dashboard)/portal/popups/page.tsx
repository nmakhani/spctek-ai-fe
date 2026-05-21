'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { popupsApi } from '@/lib/api';

interface PopupContent {
	title: string;
	content: string;
	cta_text: string;
	cta_link: string;
}

interface Popup {
	id: string;
	path: string;
	content: PopupContent;
	delay: number;
	created_at: string;
	updated_at: string;
}

interface PopupFormData {
	path: string;
	title: string;
	content: string;
	cta_text: string;
	cta_link: string;
	delay: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function PopupsContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [popups, setPopups] = useState<Popup[]>([]);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<PopupFormData>({
		path: '',
		title: '',
		content: '',
		cta_text: '',
		cta_link: '',
		delay: '0',
	});

	const fetchPopups = async () => {
		try {
			setLoading(true);
			const response = await popupsApi.list();
			setPopups(response.data as Popup[]);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load popups');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchPopups();
	}, []);

	const resetForm = () => {
		setFormData({
			path: '',
			title: '',
			content: '',
			cta_text: '',
			cta_link: '',
			delay: '0',
		});
		setEditingId(null);
		setShowForm(false);
	};

	const buildPayload = () => {
		const parsedDelay = Number.parseInt(formData.delay, 10);
		if (Number.isNaN(parsedDelay) || parsedDelay < 0) {
			throw new Error('Delay must be a number greater than or equal to 0');
		}

		return {
			path: formData.path.trim(),
			content: {
				title: formData.title.trim(),
				content: formData.content.trim(),
				cta_text: formData.cta_text.trim(),
				cta_link: formData.cta_link.trim(),
			},
			delay: parsedDelay,
		};
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!formData.path.trim() ||
			!formData.title.trim() ||
			!formData.content.trim() ||
			!formData.cta_text.trim() ||
			!formData.cta_link.trim()
		) {
			toast.error('All fields are required');
			return;
		}

		try {
			setSaving(true);
			setError('');
			const payload = buildPayload();

			if (editingId) {
				const response = await popupsApi.update(editingId, payload);
				const updated = response.data as Popup;
				setPopups((prev) => prev.map((popup) => (popup.id === editingId ? updated : popup)));
				toast.success('Popup updated');
			} else {
				const response = await popupsApi.create(payload);
				const created = response.data as Popup;
				setPopups((prev) => [created, ...prev]);
				toast.success('Popup created');
			}

			resetForm();
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to save popup');
			setError(message);
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = (popup: Popup) => {
		setFormData({
			path: popup.path,
			title: popup.content.title,
			content: popup.content.content,
			cta_text: popup.content.cta_text,
			cta_link: popup.content.cta_link,
			delay: String(popup.delay),
		});
		setEditingId(popup.id);
		setShowForm(true);
	};

	const requestDelete = (id: string) => {
		setPendingDeleteId(id);
	};

	const handleDelete = async () => {
		if (!pendingDeleteId) {
			return;
		}

		try {
			setDeletingId(pendingDeleteId);
			setError('');
			await popupsApi.delete(pendingDeleteId);
			setPopups((prev) => prev.filter((popup) => popup.id !== pendingDeleteId));
			setPendingDeleteId(null);
			toast.success('Popup deleted');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete popup');
			setError(message);
			toast.error(message);
		} finally {
			setDeletingId(null);
		}
	};

	const cancelDelete = () => {
		if (deletingId) {
			return;
		}
		setPendingDeleteId(null);
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={Boolean(pendingDeleteId)}
				title="Delete popup"
				message="This action cannot be undone. Are you sure you want to continue?"
				confirmLabel="Delete"
				loading={Boolean(deletingId)}
				onConfirm={handleDelete}
				onCancel={cancelDelete}
			/>

			<PageHeader
				title="Popups"
				subtitle="Dashboard"
				backLink="/portal"
				backText="← Back to Home"
				buttonText="+ New Popup"
				buttonOnClick={() => setShowForm(!showForm)}
				showForm={showForm}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<StatCard label="Total Popups" loading={loading} count={popups.length} />

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				{showForm && (
					<div className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
						<h2 className="mb-4 text-xl font-semibold text-white">{editingId ? 'Edit Popup' : 'New Popup'}</h2>
						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Path *</label>
								<input
									type="text"
									value={formData.path}
									onChange={(e) => setFormData({ ...formData, path: e.target.value })}
									placeholder="/about"
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Title *</label>
								<input
									type="text"
									value={formData.title}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									placeholder="Free Strategy Review"
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Content *</label>
								<textarea
									value={formData.content}
									onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
										onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
										placeholder="Book a Call"
										className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									/>
								</div>
								<div>
									<label className="mb-2 block text-sm font-medium text-white/75">CTA Link *</label>
									<input
										type="text"
										value={formData.cta_link}
										onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
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
									onChange={(e) => setFormData({ ...formData, delay: e.target.value })}
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
								/>
							</div>

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
									onClick={resetForm}
									disabled={saving}
									className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 text-white/85 transition hover:bg-white/[0.14] disabled:opacity-60"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				{loading ? (
					<div className="py-12 text-center text-white/55">Loading popups...</div>
				) : popups.length === 0 ? (
					<div className="py-12 text-center text-white/55">No popups yet</div>
				) : (
					<div className="overflow-x-auto rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] shadow-[0_20px_50px_rgba(0,0,0,0.58)] backdrop-blur-xl">
						<table className="w-full">
							<thead className="border-b border-white/10 bg-black/25">
								<tr>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Path</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Title</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Delay</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">CTA</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Updated</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Actions</th>
								</tr>
							</thead>
							<tbody>
								{popups.map((popup) => (
									<tr key={popup.id} className="border-b border-white/10 transition hover:bg-white/[0.05]">
										<td className="px-6 py-3 text-white">{popup.path}</td>
										<td className="px-6 py-3 text-white">{popup.content.title}</td>
										<td className="px-6 py-3 text-white/75">{popup.delay} ms</td>
										<td className="px-6 py-3 text-white/70">{popup.content.cta_text}</td>
										<td className="px-6 py-3 text-white/65">{new Date(popup.updated_at).toLocaleDateString()}</td>
										<td className="px-6 py-3">
											<div className="flex gap-2">
												<button
													onClick={() => handleEdit(popup)}
													disabled={deletingId === popup.id}
													className="rounded-lg bg-[#606bfa] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
												>
													Edit
												</button>
												<button
													onClick={() => requestDelete(popup.id)}
													disabled={deletingId === popup.id}
													className="rounded-lg bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#ff5a5a] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
												>
													{deletingId === popup.id ? 'Deleting...' : 'Delete'}
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</div>
	);
}

export default function PopupsPage() {
	return (
		<ProtectedRoute>
			<PopupsContent />
		</ProtectedRoute>
	);
}
