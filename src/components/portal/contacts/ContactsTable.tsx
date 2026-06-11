import { Fragment } from 'react';

import { ContactSubmissionsTable } from './ContactSubmissionsTable';
import type { StatusOption } from './StatusManagementModal';
import type { Contact, JourneyEntry } from './types';
import { getContactSubmissions } from './utils';

interface ContactsTableProps {
	contacts: Contact[];
	statuses: StatusOption[];
	statusesLoading: boolean;
	expandedContactId: string | null;
	rowStatusValues: Record<string, string>;
	contactStatusSavingId: string | null;
	deletingId: string | null;
	onToggleExpanded: (contactId: string) => void;
	onStatusChange: (contactId: string, statusId: string) => void;
	onSaveStatus: (contact: Contact) => void | Promise<void>;
	onDelete: (contactId: string) => void;
	onViewJourney: (entry: JourneyEntry) => void;
}

export function ContactsTable({
	contacts,
	statuses,
	statusesLoading,
	expandedContactId,
	rowStatusValues,
	contactStatusSavingId,
	deletingId,
	onToggleExpanded,
	onStatusChange,
	onSaveStatus,
	onDelete,
	onViewJourney,
}: ContactsTableProps) {
	return (
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
					{contacts.map((contact) => {
						const submissions = getContactSubmissions(contact);
						const savedStatusId = contact.status_id || '';
						const selectedStatusId = rowStatusValues[contact.id] ?? savedStatusId;
						const statusChanged = selectedStatusId !== savedStatusId;
						const isSavingStatus = contactStatusSavingId === contact.id;
						const isDeleting = deletingId === contact.id;

						return (
							<Fragment key={contact.id}>
								<tr
									onClick={() => onToggleExpanded(contact.id)}
									className="cursor-pointer border-b border-white/10 transition hover:bg-white/[0.05]"
								>
									<td className="px-6 py-3 text-white">
										<div className="flex items-center gap-3">
											<span className="text-white/40">{expandedContactId === contact.id ? '^' : 'v'}</span>
											<span>{contact.name || '-'}</span>
										</div>
									</td>
									<td className="px-6 py-3 text-white/75">{contact.email || '-'}</td>
									<td className="px-6 py-3 text-white/65" onClick={(event) => event.stopPropagation()}>
										<select
											value={selectedStatusId}
											onChange={(event) => onStatusChange(contact.id, event.target.value)}
											disabled={statusesLoading || isSavingStatus}
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
												onClick={() => onSaveStatus(contact)}
												disabled={!statusChanged || isSavingStatus || isDeleting}
												className="rounded-lg bg-[#606bfa] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:cursor-not-allowed disabled:opacity-45"
											>
												{isSavingStatus ? 'Saving...' : 'Save'}
											</button>
											<button
												onClick={() => onDelete(contact.id)}
												disabled={isDeleting}
												className="rounded-lg bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#ff5a5a] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
											>
												{isDeleting ? 'Deleting...' : 'Delete'}
											</button>
										</div>
									</td>
								</tr>

								{expandedContactId === contact.id && (
									<ContactSubmissionsTable
										contact={contact}
										submissions={submissions}
										onCollapse={onToggleExpanded}
										onViewJourney={onViewJourney}
									/>
								)}
							</Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
