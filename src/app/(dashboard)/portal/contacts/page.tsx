'use client';

import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { JourneyModal } from '@/components/portal/contacts/JourneyModal';
import { StatusManagementModal, type StatusOption } from '@/components/portal/contacts/StatusManagementModal';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DarkDropdown } from '@/components/ui/form-parts/DarkDropdown';
import { contactsApi, statusesApi } from '@/lib/api';

interface ContactSubmission {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	company?: string;
	message?: string;
	source?: string;
	journey?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
}

interface JourneyEntry {
	id: string;
	source?: string;
	journey?: Record<string, unknown>;
}

interface Contact {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	company?: string;
	message?: string;
	status_id?: string | null;
	status_code?: string | null;
	source?: string;
	journey?: Record<string, unknown>;
	created_at?: string;
	submissions?: ContactSubmission[];
}

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function hasJourneyData(journey?: Record<string, unknown>) {
	return Boolean(journey && Object.keys(journey).length > 0);
}

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
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
	const [sourceFilter, setSourceFilter] = useState<string>('all');
	const [selectedJourney, setSelectedJourney] = useState<JourneyEntry | null>(null);
	const [rowStatusValues, setRowStatusValues] = useState<Record<string, string>>({});

	const getSubmissionDate = (submission: ContactSubmission) => {
		return submission.created_at ? new Date(submission.created_at).getTime() : 0;
	};

	const getContactSubmissions = (contact: Contact) => {
		return [...(contact.submissions || [])].sort((left, right) => getSubmissionDate(right) - getSubmissionDate(left));
	};

	const getContactSources = (contact: Contact) => {
		const sources = getContactSubmissions(contact)
			.map((submission) => submission.source)
			.filter((source): source is string => Boolean(source));

		if (!sources.length && contact.source) {
			sources.push(contact.source);
		}

		return sources;
	};

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
			const message = getErrorMessage(err, 'Failed to load statuses');
			toast.error(message);
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

	const sources = Array.from(
		new Set(
			contacts.flatMap((contact) => getContactSources(contact)).filter((source): source is string => Boolean(source))
		)
	);

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

	const cancelDelete = () => {
		if (deletingId) {
			return;
		}
		setPendingDeleteId(null);
	};

	const handleViewJourney = (entry: JourneyEntry) => {
		setSelectedJourney(entry);
	};

	const closeJourneyModal = () => {
		setSelectedJourney(null);
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

	const handleDeleteStatus = async (id: string) => {
		try {
			setStatusDeletingId(id);
			await statusesApi.delete(id);
			await Promise.all([fetchStatuses(), fetchContacts()]);
			toast.success('Status deleted');
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, 'Failed to delete status'));
		} finally {
			setStatusDeletingId(null);
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

			<JourneyModal contact={selectedJourney} onClose={closeJourneyModal} />
			<StatusManagementModal
				isOpen={showStatusModal}
				statuses={statuses}
				loading={statusesLoading}
				savingId={statusSavingId}
				deletingId={statusDeletingId}
				onClose={() => setShowStatusModal(false)}
				onCreate={handleCreateStatus}
				onUpdate={handleUpdateStatus}
				onDelete={handleDeleteStatus}
			/>

			<PageHeader title="Contacts" subtitle="Dashboard" backLink="/portal" backText="<- Back to Home" />

			<main className="mx-auto max-w-7xl px-6 py-10">
				<StatCard label="Total Contacts" loading={loading} count={contacts.length} />

				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					{sources.length > 0 ? (
						<div className="flex items-center gap-4">
							<label className="text-sm font-medium text-white/75">Filter by Source:</label>
							<div className="w-64">
								<DarkDropdown
									value={sourceFilter === 'all' ? 'All Sources' : (sourceFilter ?? 'All Sources')}
									options={['All Sources', ...sources]}
									onChange={(value) => setSourceFilter(value === 'All Sources' ? 'all' : value)}
								/>
							</div>
						</div>
					) : (
						<div />
					)}
					<button
						type="button"
						onClick={() => setShowStatusModal(true)}
						className="w-fit rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 font-semibold text-white/85 transition hover:bg-white/[0.14]"
					>
						Manage Statuses
					</button>
				</div>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
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
									<th className="px-6 py-3 text-left font-semibold text-white/75">Status</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Submissions</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Date</th>
									<th className="px-6 py-3 text-left font-semibold text-white/75">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredContacts.map((contact) => {
									const submissions = getContactSubmissions(contact);
									const savedStatusId = contact.status_id || '';
									const selectedStatusId = rowStatusValues[contact.id] ?? savedStatusId;
									const statusChanged = selectedStatusId !== savedStatusId;

									return (
										<Fragment key={contact.id}>
											<tr
												onClick={() => toggleExpandedContact(contact.id)}
												className="cursor-pointer border-b border-white/10 transition hover:bg-white/[0.05]"
											>
												<td className="px-6 py-3 text-white">
													<div className="flex items-center gap-3">
														<span className="text-white/40">{expandedContactId === contact.id ? '↑' : '↓'}</span>
														<span>{contact.name || '-'}</span>
													</div>
												</td>
												<td className="px-6 py-3 text-white/75">{contact.email || '-'}</td>
												<td className="px-6 py-3 text-white/65" onClick={(event) => event.stopPropagation()}>
													<select
														value={selectedStatusId}
														onChange={(event) => handleStatusChange(contact.id, event.target.value)}
														disabled={statusesLoading || contactStatusSavingId === contact.id}
														className="w-44 rounded-lg border border-white/15 bg-[#10131f] px-3 py-1.5 text-sm text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45 disabled:opacity-60"
													>
														<option value="">Not set</option>
														{statuses.map((status) => (
															<option key={status.id} value={status.id}>
																{status.code}
															</option>
														))}
													</select>
												</td>
												<td className="px-6 py-3 text-white/75">
													<span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-semibold">
														{submissions.length}
													</span>
												</td>
												<td className="px-6 py-3 text-white/65">
													{contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '-'}
												</td>
												<td className="px-6 py-3">
													<div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
														<button
															onClick={() => handleSaveContactStatus(contact)}
															disabled={
																!statusChanged || contactStatusSavingId === contact.id || deletingId === contact.id
															}
															className="rounded-lg bg-[#606bfa] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:cursor-not-allowed disabled:opacity-45"
														>
															{contactStatusSavingId === contact.id ? 'Saving...' : 'Save'}
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

											{expandedContactId === contact.id && (
												<tr className="bg-black/18 border-b border-white/10">
													<td colSpan={6} className="px-6 py-6">
														<div className="rounded-2xl border border-white/10 bg-black/20 p-4">
															<div className="mb-4 flex items-center justify-between gap-3">
																<div>
																	<p className="text-sm font-semibold text-white">Contact submissions</p>
																	<p className="text-xs text-white/55">
																		{submissions.length} submission{submissions.length === 1 ? '' : 's'}
																	</p>
																</div>
																<button
																	type="button"
																	onClick={(event) => {
																		event.stopPropagation();
																		toggleExpandedContact(contact.id);
																	}}
																	className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/[0.12]"
																>
																	Collapse
																</button>
															</div>

															{submissions.length === 0 ? (
																<div className="text-sm text-white/55">No submissions available.</div>
															) : (
																<div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
																	<table className="w-full min-w-[780px] text-sm">
																		<thead className="bg-black/25">
																			<tr>
																				<th className="px-3 py-2 text-left font-medium text-white/65">Source</th>
																				<th className="px-3 py-2 text-left font-medium text-white/65">Name</th>
																				<th className="px-3 py-2 text-left font-medium text-white/65">Email</th>
																				<th className="px-3 py-2 text-left font-medium text-white/65">Phone</th>
																				<th className="px-3 py-2 text-left font-medium text-white/65">Company</th>
																				<th className="px-3 py-2 text-left font-medium text-white/65">Message</th>
																				<th className="px-3 py-2 text-left font-medium text-white/65">Actions</th>
																			</tr>
																		</thead>
																		<tbody>
																			{submissions.map((submission) => (
																				<tr key={submission.id} className="border-t border-white/10 align-top">
																					<td className="px-3 py-2 text-white">{submission.source || '-'}</td>
																					<td className="px-3 py-2 text-white">{submission.name || '-'}</td>
																					<td className="px-3 py-2 text-white">
																						{submission.email || contact.email || '-'}
																					</td>
																					<td className="px-3 py-2 text-white">{submission.phone || '-'}</td>
																					<td className="px-3 py-2 text-white">{submission.company || '-'}</td>
																					<td className="max-w-[280px] px-3 py-2 text-white">
																						<div className="line-clamp-3 whitespace-pre-wrap">
																							{submission.message || '-'}
																						</div>
																					</td>
																					<td className="px-3 py-2">
																						{hasJourneyData(submission.journey) ? (
																							<button
																								type="button"
																								onClick={(event) => {
																									event.stopPropagation();
																									handleViewJourney(submission);
																								}}
																								className="rounded-lg bg-[#10b981] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#34d399]"
																							>
																								Track Journey
																							</button>
																						) : (
																							<span className="text-white/45">-</span>
																						)}
																					</td>
																				</tr>
																			))}
																		</tbody>
																	</table>
																</div>
															)}
														</div>
													</td>
												</tr>
											)}
										</Fragment>
									);
								})}
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
