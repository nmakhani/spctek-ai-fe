'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/portal/PageHeader';
import { PortalTable, type PortalTableAction, type PortalTableColumn } from '@/components/portal/PortalTable';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { metadeckApi } from '@/lib/api';

interface Metadeck {
	id: string;
	path: string;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
}

interface MetadeckFormData {
	path: string;
	title: string;
	description: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function MetadeckContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [metadecks, setMetadecks] = useState<Metadeck[]>([]);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<MetadeckFormData>({
		path: '',
		title: '',
		description: '',
	});

	const fetchMetadecks = async () => {
		try {
			setLoading(true);
			const response = await metadeckApi.list();
			setMetadecks(response.data as Metadeck[]);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load metadata entries');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchMetadecks();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.path.trim() || !formData.title.trim() || !formData.description.trim()) {
			toast.error('All fields are required');
			return;
		}

		try {
			setSaving(true);
			setError('');
			if (editingId) {
				const response = await metadeckApi.update(editingId, {
					path: formData.path.trim(),
					title: formData.title.trim(),
					description: formData.description.trim(),
				});
				const updated = response.data as Metadeck;
				setMetadecks((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
				toast.success('Metadata entry updated');
			} else {
				const response = await metadeckApi.create({
					path: formData.path.trim(),
					title: formData.title.trim(),
					description: formData.description.trim(),
				});
				const created = response.data as Metadeck;
				setMetadecks((prev) => [created, ...prev]);
				toast.success('Metadata entry created');
			}
			setFormData({
				path: '',
				title: '',
				description: '',
			});
			setEditingId(null);
			setShowForm(false);
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to save metadata entry');
			setError(message);
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = (metadeck: Metadeck) => {
		setFormData({
			path: metadeck.path,
			title: metadeck.title,
			description: metadeck.description,
		});
		setEditingId(metadeck.id);
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
			await metadeckApi.delete(pendingDeleteId);
			setMetadecks((prev) => prev.filter((m) => m.id !== pendingDeleteId));
			toast.success('Metadata entry deleted');
			setPendingDeleteId(null);
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete metadata entry');
			setError(message);
			toast.error(message);
		} finally {
			setDeletingId(null);
		}
	};

	const handleCancel = () => {
		setFormData({
			path: '',
			title: '',
			description: '',
		});
		setEditingId(null);
		setShowForm(false);
	};

	const cancelDelete = () => {
		if (deletingId) {
			return;
		}
		setPendingDeleteId(null);
	};

	const metadeckColumns: PortalTableColumn<Metadeck>[] = [
		{ header: 'Path', accessor: 'path', className: 'text-white' },
		{ header: 'Title', accessor: 'title', className: 'text-white' },
		{ header: 'Description', accessor: 'description', className: 'max-w-md truncate text-white/70' },
		{ header: 'Updated', type: 'date', accessor: 'updated_at' },
	];

	const getMetadeckActions = (metadeck: Metadeck): PortalTableAction<Metadeck>[] => [
		{
			label: 'Edit',
			disabled: deletingId === metadeck.id,
			onClick: handleEdit,
		},
		{
			label: 'Delete',
			loading: deletingId === metadeck.id,
			loadingLabel: 'Deleting...',
			variant: 'danger',
			onClick: (selectedMetadeck) => requestDelete(selectedMetadeck.id),
		},
	];

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={Boolean(pendingDeleteId)}
				title="Delete metadata entry"
				message="This action cannot be undone. Are you sure you want to continue?"
				confirmLabel="Delete"
				loading={Boolean(deletingId)}
				onConfirm={handleDelete}
				onCancel={cancelDelete}
			/>

			<PageHeader
				title="Metadata"
				subtitle="Dashboard"
				backLink="/portal"
				backText="← Back to Home"
				buttonText="+ New Entry"
				buttonOnClick={() => setShowForm(!showForm)}
				showForm={showForm}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<StatCard label="Total Entries" loading={loading} count={metadecks.length} />

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				{showForm && (
					<div className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
						<h2 className="mb-4 text-xl font-semibold text-white">{editingId ? 'Edit Metadata' : 'New Metadata'}</h2>
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
								<p className="mt-1 text-xs text-white/45">The page path (e.g., /about, /contact)</p>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Title *</label>
								<input
									type="text"
									value={formData.title}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									placeholder="About Us"
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Description *</label>
								<textarea
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									placeholder="Learn more about our company..."
									rows={3}
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
									onClick={handleCancel}
									disabled={saving}
									className="rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 text-white/85 transition hover:bg-white/[0.14] disabled:opacity-60"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				<PortalTable
					columns={metadeckColumns}
					loading={loading}
					loadingMessage="Loading metadata entries..."
					empty={metadecks.length === 0}
					emptyMessage="No metadata entries yet"
					data={metadecks}
					getRowKey={(metadeck) => metadeck.id}
					actions={getMetadeckActions}
				/>
			</main>
		</div>
	);
}

export default function MetadeckPage() {
	return (
		<ProtectedRoute>
			<MetadeckContent />
		</ProtectedRoute>
	);
}
