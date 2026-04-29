'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ContactForm } from '@/components/portal/contacts/ContactForm';
import { JourneyModal } from '@/components/portal/contacts/JourneyModal';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DarkDropdown } from '@/components/ui/form-parts/DarkDropdown';
import { contactsApi } from '@/lib/api';

interface Contact {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	company?: string;
	message?: string;
	source?: string;
	journey?: Record<string, unknown>;
	created_at?: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function ContactsContent() {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		company: '',
		message: '',
		source: 'landing_page',
	});
	const [sourceFilter, setSourceFilter] = useState<string>('all');
	const [selectedJourney, setSelectedJourney] = useState<Contact | null>(null);

	// Fetch contacts
	const fetchContacts = async () => {
		try {
			setLoading(true);
			const response = await contactsApi.list();
			setContacts(response.data);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load contacts');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const filteredContacts = sourceFilter === 'all' ? contacts : contacts.filter((c) => c.source === sourceFilter);

	const sources = Array.from(new Set(contacts.map((c) => c.source).filter((s): s is string => Boolean(s))));

	const handleViewJourney = (contact: Contact) => {
		setSelectedJourney(contact);
	};

	const closeJourneyModal = () => {
		setSelectedJourney(null);
	};

	useEffect(() => {
		fetchContacts();
	}, []);

	// Handle form submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setSaving(true);
			setError('');
			if (editingId) {
				const response = await contactsApi.update(editingId, formData);
				const updated = response.data as Contact;
				setContacts((prev) => prev.map((contact) => (contact.id === editingId ? updated : contact)));
				toast.success('Contact updated');
			} else {
				const response = await contactsApi.create(formData);
				const created = response.data as Contact;
				setContacts((prev) => [created, ...prev]);
				toast.success('Contact created');
			}
			setFormData({
				name: '',
				email: '',
				phone: '',
				company: '',
				message: '',
				source: 'landing_page',
			});
			setEditingId(null);
			setShowForm(false);
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to save contact');
			setError(message);
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	// Handle edit
	const handleEdit = (contact: Contact) => {
		setFormData({
			name: contact.name || '',
			email: contact.email || '',
			phone: contact.phone || '',
			company: contact.company || '',
			message: contact.message || '',
			source: contact.source || 'landing_page',
		});
		setEditingId(contact.id);
		setShowForm(true);
	};

	// Handle delete
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

	// Handle cancel
	const handleCancel = () => {
		setFormData({
			name: '',
			email: '',
			phone: '',
			company: '',
			message: '',
			source: 'landing_page',
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

			<JourneyModal contact={selectedJourney} onClose={closeJourneyModal} />

			<PageHeader
				title="Contacts"
				subtitle="Dashboard"
				backLink="/portal"
				backText="← Back to Home"
				buttonText="+ New Contact"
				buttonOnClick={() => setShowForm(!showForm)}
				showForm={showForm}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<StatCard label="Total Contacts" loading={loading} count={contacts.length} />

				{sources.length > 0 && (
					<div className="mb-6 flex items-center gap-4">
						<label className="text-sm font-medium text-white/75">Filter by Source:</label>
						<div className="w-64">
							<DarkDropdown
								value={sourceFilter === 'all' ? 'All Sources' : (sourceFilter ?? 'All Sources')}
								options={['All Sources', ...sources]}
								onChange={(value) => setSourceFilter(value === 'All Sources' ? 'all' : value)}
							/>
						</div>
					</div>
				)}

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				{showForm && (
					<ContactForm
						formData={formData}
						editingId={editingId}
						saving={saving}
						onChange={setFormData}
						onSubmit={handleSubmit}
						onCancel={handleCancel}
					/>
				)}

				{loading ? (
					<div className="py-12 text-center text-white/55">Loading contacts...</div>
				) : filteredContacts.length === 0 ? (
					<div className="py-12 text-center text-white/55">No contacts found</div>
				) : (
					<div className="overflow-x-auto rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] shadow-[0_20px_50px_rgba(0,0,0,0.58)] backdrop-blur-xl">
						<table className="w-full">
							<thead className="border-b border-white/10 bg-black/25">
								<tr>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Name</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Email</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Phone</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Company</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Source</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Date</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredContacts.map((contact) => (
									<tr key={contact.id} className="border-b border-white/10 transition hover:bg-white/[0.05]">
										<td className="px-6 py-3 text-white">{contact.name || '—'}</td>
										<td className="px-6 py-3 text-white/75">{contact.email || '—'}</td>
										<td className="px-6 py-3 text-white/65">{contact.phone || '—'}</td>
										<td className="px-6 py-3 text-white/65">{contact.company || '—'}</td>
										<td className="px-6 py-3 text-white/65">{contact.source || '—'}</td>
										<td className="px-6 py-3 text-white/65">
											{contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '—'}
										</td>
										<td className="px-6 py-3">
											<div className="flex gap-2">
												{contact.journey && (
													<button
														onClick={() => handleViewJourney(contact)}
														className="rounded-lg bg-[#10b981] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#34d399] disabled:opacity-60"
													>
														Track Journey
													</button>
												)}
												<button
													onClick={() => handleEdit(contact)}
													disabled={deletingId === contact.id}
													className="rounded-lg bg-[#606bfa] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
												>
													Edit
												</button>
												<button
													onClick={() => requestDelete(contact.id)}
													disabled={deletingId === contact.id}
													className="rounded-lg bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#ff5a5a] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
												>
													{deletingId === contact.id ? 'Deleting...' : 'Delete'}
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

export default function ContactsPage() {
	return (
		<ProtectedRoute>
			<ContactsContent />
		</ProtectedRoute>
	);
}
