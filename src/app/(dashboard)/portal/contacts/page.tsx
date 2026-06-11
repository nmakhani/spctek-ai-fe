'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ContactsTable } from '@/components/portal/contacts/ContactsTable';
import { ContactsToolbar } from '@/components/portal/contacts/ContactsToolbar';
import { JourneyModal } from '@/components/portal/contacts/JourneyModal';
import { StatusManagementModal, type StatusOption } from '@/components/portal/contacts/StatusManagementModal';
import type { Contact, JourneyEntry } from '@/components/portal/contacts/types';
import { getContactSources, getErrorMessage, getUniqueContactSources } from '@/components/portal/contacts/utils';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { contactsApi, statusesApi } from '@/lib/api';

function ContactsContent() {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [statuses, setStatuses] = useState<StatusOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [statusesLoading, setStatusesLoading] = useState(true);
	const [error, setError] = useState('');
	const [contactStatusSavingId, setContactStatusSavingId] = useState<string | null>(null);
	const [statusSavingId, setStatusSavingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [statusDeletingId, setStatusDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [pendingStatusDeleteId, setPendingStatusDeleteId] = useState<string | null>(null);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
	const [sourceFilter, setSourceFilter] = useState<string>('all');
	const [selectedJourney, setSelectedJourney] = useState<JourneyEntry | null>(null);
	const [rowStatusValues, setRowStatusValues] = useState<Record<string, string>>({});

	const fetchContacts = async () => {
		try {
			setLoading(true);
			const response = await contactsApi.list({ detail: true });
			const nextContacts = response.data as Contact[];
			setContacts(nextContacts);
			setRowStatusValues(Object.fromEntries(nextContacts.map((contact) => [contact.id, contact.status_id || ''])));
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load contacts');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const fetchStatuses = async () => {
		try {
			setStatusesLoading(true);
			const response = await statusesApi.list();
			setStatuses(
				(response.data as StatusOption[]).map((status) => ({
					...status,
					contact_count: status.contact_count ?? 0,
				}))
			);
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, 'Failed to load statuses'));
		} finally {
			setStatusesLoading(false);
		}
	};

	useEffect(() => {
		void fetchContacts();
		void fetchStatuses();
	}, []);

	const filteredContacts =
		sourceFilter === 'all' ? contacts : contacts.filter((contact) => getContactSources(contact).includes(sourceFilter));

	const sources = getUniqueContactSources(contacts);
	const pendingStatusDelete = statuses.find((status) => status.id === pendingStatusDeleteId);

	const handleStatusChange = (contactId: string, statusId: string) => {
		setRowStatusValues((current) => ({ ...current, [contactId]: statusId }));
	};

	const handleSaveContactStatus = async (contact: Contact) => {
		try {
			setContactStatusSavingId(contact.id);
			setError('');
			const selectedStatusId = rowStatusValues[contact.id] || null;
			const response = await contactsApi.update(contact.id, { status_id: selectedStatusId });
			const updatedContact = response.data as Contact;

			setContacts((current) =>
				current.map((currentContact) =>
					currentContact.id === contact.id
						? {
								...currentContact,
								...updatedContact,
								submissions: updatedContact.submissions ?? currentContact.submissions,
							}
						: currentContact
				)
			);
			setRowStatusValues((current) => ({ ...current, [contact.id]: updatedContact.status_id || '' }));
			toast.success('Status saved');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to save status');
			setError(message);
			toast.error(message);
		} finally {
			setContactStatusSavingId(null);
		}
	};

	const handleDelete = async () => {
		if (!pendingDeleteId) {
			return;
		}

		try {
			setDeletingId(pendingDeleteId);
			setError('');
			await contactsApi.delete(pendingDeleteId);
			setContacts((prev) => prev.filter((contact) => contact.id !== pendingDeleteId));
			toast.success('Contact deleted');
			setPendingDeleteId(null);
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete contact');
			setError(message);
			toast.error(message);
		} finally {
			setDeletingId(null);
		}
	};

	const cancelDelete = () => {
		if (!deletingId) {
			setPendingDeleteId(null);
		}
	};

	const toggleExpandedContact = (contactId: string) => {
		setExpandedContactId((current) => (current === contactId ? null : contactId));
	};

	const handleCreateStatus = async (code: string) => {
		try {
			setStatusSavingId('new');
			await statusesApi.create({ code });
			await fetchStatuses();
			toast.success('Status added');
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, 'Failed to add status'));
		} finally {
			setStatusSavingId(null);
		}
	};

	const handleUpdateStatus = async (id: string, code: string) => {
		try {
			setStatusSavingId(id);
			await statusesApi.update(id, { code });
			await Promise.all([fetchStatuses(), fetchContacts()]);
			toast.success('Status updated');
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, 'Failed to update status'));
		} finally {
			setStatusSavingId(null);
		}
	};

	const handleDeleteStatus = async () => {
		if (!pendingStatusDeleteId) {
			return;
		}

		try {
			setStatusDeletingId(pendingStatusDeleteId);
			await statusesApi.delete(pendingStatusDeleteId);
			await Promise.all([fetchStatuses(), fetchContacts()]);
			toast.success('Status deleted');
			setPendingStatusDeleteId(null);
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, 'Failed to delete status'));
		} finally {
			setStatusDeletingId(null);
		}
	};

	const cancelDeleteStatus = () => {
		if (!statusDeletingId) {
			setPendingStatusDeleteId(null);
		}
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={Boolean(pendingDeleteId)}
				title="Delete contact"
				message="This action cannot be undone. Are you sure you want to continue?"
				confirmLabel="Delete"
				loading={Boolean(deletingId)}
				onConfirm={handleDelete}
				onCancel={cancelDelete}
			/>

			<JourneyModal contact={selectedJourney} onClose={() => setSelectedJourney(null)} />
			<StatusManagementModal
				isOpen={showStatusModal}
				statuses={statuses}
				loading={statusesLoading}
				savingId={statusSavingId}
				deletingId={statusDeletingId}
				onClose={() => setShowStatusModal(false)}
				onCreate={handleCreateStatus}
				onUpdate={handleUpdateStatus}
				onDelete={setPendingStatusDeleteId}
				suppressOutsideClose={Boolean(pendingStatusDeleteId)}
			/>
			<ConfirmDialog
				isOpen={Boolean(pendingStatusDeleteId)}
				title="Delete status"
				message={`This action cannot be undone. Are you sure you want to delete${
					pendingStatusDelete ? ` "${pendingStatusDelete.code}"` : ' this status'
				}?`}
				confirmLabel="Delete"
				loading={Boolean(statusDeletingId)}
				onConfirm={handleDeleteStatus}
				onCancel={cancelDeleteStatus}
			/>

			<PageHeader title="Contacts" subtitle="Dashboard" backLink="/portal" backText="<- Back to Home" />

			<main className="mx-auto max-w-7xl px-6 py-10">
				<StatCard label="Total Contacts" loading={loading} count={contacts.length} />

				<ContactsToolbar
					sources={sources}
					sourceFilter={sourceFilter}
					onSourceFilterChange={setSourceFilter}
					onManageStatuses={() => setShowStatusModal(true)}
				/>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				{loading ? (
					<div className="py-12 text-center text-white/55">Loading contacts...</div>
				) : filteredContacts.length === 0 ? (
					<div className="py-12 text-center text-white/55">No contacts found</div>
				) : (
					<ContactsTable
						contacts={filteredContacts}
						statuses={statuses}
						statusesLoading={statusesLoading}
						expandedContactId={expandedContactId}
						rowStatusValues={rowStatusValues}
						contactStatusSavingId={contactStatusSavingId}
						deletingId={deletingId}
						onToggleExpanded={toggleExpandedContact}
						onStatusChange={handleStatusChange}
						onSaveStatus={handleSaveContactStatus}
						onDelete={setPendingDeleteId}
						onViewJourney={setSelectedJourney}
					/>
				)}
			</main>
		</div>
	);
}

export default function ContactsPage() {
	return (
		<ProtectedRoute>
			<ContactsContent />
		</ProtectedRoute>
	);
}
