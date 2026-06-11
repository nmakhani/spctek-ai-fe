'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/portal/PageHeader';
import { PopupForm } from '@/components/portal/popups/PopupForm';
import type { Popup, PopupFormData } from '@/components/portal/popups/types';
import {
	buildPopupPayload,
	EMPTY_POPUP_FORM,
	getErrorMessage,
	popupToFormData,
} from '@/components/portal/popups/utils';
import { PortalTable, type PortalTableAction, type PortalTableColumn } from '@/components/portal/PortalTable';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { popupsApi } from '@/lib/api';

function PopupsContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [popups, setPopups] = useState<Popup[]>([]);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<PopupFormData>(EMPTY_POPUP_FORM);

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
		setFormData(EMPTY_POPUP_FORM);
		setEditingId(null);
		setShowForm(false);
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
			const payload = buildPopupPayload(formData);

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
		setFormData(popupToFormData(popup));
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

	const popupColumns: PortalTableColumn<Popup>[] = [
		{ header: 'Path', accessor: 'path', className: 'text-white' },
		{ header: 'Title', accessor: (popup) => popup.content.title, className: 'text-white' },
		{ header: 'Delay', type: 'number', accessor: (popup) => `${popup.delay} ms` },
		{ header: 'CTA', accessor: (popup) => popup.content.cta_text, className: 'text-white/70' },
		{ header: 'Updated', type: 'date', accessor: 'updated_at' },
	];

	const getPopupActions = (popup: Popup): PortalTableAction<Popup>[] => [
		{
			label: 'Edit',
			disabled: deletingId === popup.id,
			onClick: handleEdit,
		},
		{
			label: 'Delete',
			loading: deletingId === popup.id,
			loadingLabel: 'Deleting...',
			variant: 'danger',
			onClick: (selectedPopup) => requestDelete(selectedPopup.id),
		},
	];

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
					<PopupForm
						formData={formData}
						editing={Boolean(editingId)}
						saving={saving}
						onChange={setFormData}
						onSubmit={handleSubmit}
						onCancel={resetForm}
					/>
				)}

				<PortalTable
					columns={popupColumns}
					loading={loading}
					loadingMessage="Loading popups..."
					empty={popups.length === 0}
					emptyMessage="No popups yet"
					data={popups}
					getRowKey={(popup) => popup.id}
					actions={getPopupActions}
				/>
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
