'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DarkDropdown } from '@/components/ui/form-parts/DarkDropdown';
import { contactsApi, reinstatementApi } from '@/lib/api';

interface ReinstatementLog {
	id: string;
	contact_id: string;
	performance_notification: string;
	suspension_date: string;
	business_model: string;
	fulfillment_channel: string;
	appeals_made: number;
	seller_belief: string;
	available_documents: string;
	created_at: string;
	updated_at: string;
}

interface Contact {
	id: string;
	name?: string;
	email?: string;
	phone?: string;
	created_at?: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

function ReinstatementLogsContent() {
	const [logs, setLogs] = useState<ReinstatementLog[]>([]);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [selectedContactId, setSelectedContactId] = useState<string>('');
	const [generating, setGenerating] = useState<string | null>(null);
	const [selectedLog, setSelectedLog] = useState<ReinstatementLog | null>(null);

	// Fetch all contacts first
	const fetchContacts = async () => {
		try {
			const response = await contactsApi.list();
			setContacts(response.data);
			if (response.data.length > 0) {
				setSelectedContactId(response.data[0].id);
			}
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load contacts');
			console.error(message);
		}
	};

	// Fetch logs for selected contact
	const fetchLogs = async (contactId: string) => {
		if (!contactId) return;

		try {
			setLoading(true);
			const response = await reinstatementApi.listLogs(contactId);
			setLogs(response.data.logs || []);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load reinstatement logs');
			setError(message);
			setLogs([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchContacts();
	}, []);

	useEffect(() => {
		if (selectedContactId) {
			fetchLogs(selectedContactId);
		}
	}, [selectedContactId]);

	// Generate report from log
	const handleGenerateReport = async (logId: string) => {
		try {
			setGenerating(logId);
			setError('');
			await reinstatementApi.generateReportFromLog({ log_id: logId });
			toast.success('Report generated! Email sent to contact.');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to generate report');
			setError(message);
			toast.error(message);
		} finally {
			setGenerating(null);
		}
	};

	const selectedContact = contacts.find((c) => c.id === selectedContactId);
	const contactOptions = contacts.map((contact) => {
		const displayName = contact.name || contact.email || `Contact ${contact.id.slice(0, 8)}`;
		return `${displayName} (${contact.id.slice(0, 8)})`;
	});

	const selectedContactOption = selectedContact
		? `${selectedContact.name || selectedContact.email || `Contact ${selectedContact.id.slice(0, 8)}`} (${selectedContact.id.slice(0, 8)})`
		: '';

	const handleContactChange = (option: string) => {
		const idMatch = option.match(/\(([0-9a-fA-F]{8})\)$/);
		if (!idMatch) return;

		const matchingContact = contacts.find((contact) => contact.id.startsWith(idMatch[1]));
		if (matchingContact) {
			setSelectedContactId(matchingContact.id);
		}
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			{selectedLog && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
					onClick={(e) => {
						if (e.target === e.currentTarget) setSelectedLog(null);
					}}
				>
					<div className="custom-scrollbar max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl md:p-8">
						<div className="mb-6 flex items-start justify-between gap-4">
							<div>
								<p className="text-xs font-medium uppercase tracking-[0.14em] text-[#9aa4ff]">
									Reinstatement Log Details
								</p>
								<h2 className="mt-2 text-2xl font-semibold text-white">{selectedLog.business_model}</h2>
							</div>
							<button
								type="button"
								onClick={() => setSelectedLog(null)}
								className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm text-white/85 transition hover:bg-white/[0.14]"
							>
								Close
							</button>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="rounded-xl border border-white/10 bg-black/20 p-4">
								<p className="text-xs uppercase tracking-wider text-white/50">Log ID</p>
								<p className="mt-1 break-all text-sm text-white/80">{selectedLog.id}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4">
								<p className="text-xs uppercase tracking-wider text-white/50">Contact ID</p>
								<p className="mt-1 break-all text-sm text-white/80">{selectedLog.contact_id}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4">
								<p className="text-xs uppercase tracking-wider text-white/50">Business Model</p>
								<p className="mt-1 text-sm text-white/80">{selectedLog.business_model}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4">
								<p className="text-xs uppercase tracking-wider text-white/50">Fulfillment Channel</p>
								<p className="mt-1 text-sm text-white/80">{selectedLog.fulfillment_channel}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4">
								<p className="text-xs uppercase tracking-wider text-white/50">Suspension Date</p>
								<p className="mt-1 text-sm text-white/80">{selectedLog.suspension_date}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4">
								<p className="text-xs uppercase tracking-wider text-white/50">Appeals Made</p>
								<p className="mt-1 text-sm text-white/80">{selectedLog.appeals_made}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2">
								<p className="text-xs uppercase tracking-wider text-white/50">Performance Notification</p>
								<div className="custom-scrollbar mt-1 h-48 overflow-y-auto pr-2">
									<p className="whitespace-pre-wrap text-sm text-white/80">{selectedLog.performance_notification}</p>
								</div>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2">
								<p className="text-xs uppercase tracking-wider text-white/50">Seller Belief</p>
								<p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{selectedLog.seller_belief}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2">
								<p className="text-xs uppercase tracking-wider text-white/50">Available Documents</p>
								<p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{selectedLog.available_documents}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4">
								<p className="text-xs uppercase tracking-wider text-white/50">Created At</p>
								<p className="mt-1 text-sm text-white/80">{new Date(selectedLog.created_at).toLocaleString()}</p>
							</div>
							<div className="rounded-xl border border-white/10 bg-black/20 p-4">
								<p className="text-xs uppercase tracking-wider text-white/50">Updated At</p>
								<p className="mt-1 text-sm text-white/80">{new Date(selectedLog.updated_at).toLocaleString()}</p>
							</div>
						</div>
					</div>
				</div>
			)}

			<PageHeader
				title="Reinstatement Logs"
				subtitle="Dashboard"
				backLink="/portal"
				backText="← Back to Home"
				buttonText="Refresh"
				buttonOnClick={() => {
					if (selectedContactId) {
						fetchLogs(selectedContactId);
					}
				}}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<StatCard label="Total Logs" loading={loading} count={logs.length} />

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				{/* Contact Filter */}
				<div className="mb-8">
					<label className="mb-3 block text-sm font-medium text-white/75">Filter by Contact</label>
					<DarkDropdown
						value={selectedContactOption}
						options={contactOptions}
						placeholder="Select a contact..."
						onChange={handleContactChange}
					/>
				</div>

				{selectedContact && (
					<div className="mb-6 rounded-2xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 backdrop-blur-xl">
						<h3 className="font-semibold text-white">Selected Contact</h3>
						<p className="mt-2 text-sm text-white/75">
							{selectedContact.name && <span className="font-medium text-white">{selectedContact.name}</span>}
							{selectedContact.name && selectedContact.email && <span> • </span>}
							{selectedContact.email && <span>{selectedContact.email}</span>}
						</p>
						{selectedContact.phone && <p className="text-sm text-white/65">Phone: {selectedContact.phone}</p>}
					</div>
				)}

				{loading ? (
					<div className="py-12 text-center text-white/55">Loading reinstatement logs...</div>
				) : logs.length === 0 ? (
					<div className="py-12 text-center text-white/55">
						{selectedContactId ? 'No reinstatement logs for this contact' : 'Select a contact to view logs'}
					</div>
				) : (
					<div className="space-y-4">
						{logs.map((log) => (
							<div
								key={log.id}
								className="rounded-2xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.58)] backdrop-blur-xl"
							>
								<div className="mb-4 flex items-start justify-between">
									<div>
										<h3 className="font-semibold text-white">{log.business_model}</h3>
										<p className="mt-1 text-sm text-white/65">Suspension Date: {log.suspension_date}</p>
										<p className="text-sm text-white/65">Fulfillment Channel: {log.fulfillment_channel}</p>
										<p className="text-sm text-white/65">Previous Appeals: {log.appeals_made}</p>
									</div>
									<div className="text-right">
										<p className="text-xs text-white/50">{new Date(log.created_at).toLocaleDateString()}</p>
										<p className="text-xs text-white/40">{new Date(log.created_at).toLocaleTimeString()}</p>
									</div>
								</div>

								<div className="mb-4 space-y-3 border-t border-white/10 pt-4">
									<div>
										<p className="text-xs font-medium uppercase tracking-widest text-white/60">
											Performance Notification
										</p>
										<p className="mt-1 max-h-24 overflow-y-auto text-xs text-white/70">
											{log.performance_notification.substring(0, 200)}
											{log.performance_notification.length > 200 ? '...' : ''}
										</p>
									</div>

									<div>
										<p className="text-xs font-medium uppercase tracking-widest text-white/60">Seller&apos;s Belief</p>
										<p className="mt-1 max-h-24 overflow-y-auto text-xs text-white/70">
											{log.seller_belief.substring(0, 200)}
											{log.seller_belief.length > 200 ? '...' : ''}
										</p>
									</div>

									<div>
										<p className="text-xs font-medium uppercase tracking-widest text-white/60">Available Documents</p>
										<p className="mt-1 max-h-24 overflow-y-auto text-xs text-white/70">{log.available_documents}</p>
									</div>
								</div>

								<div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
									<button
										onClick={() => setSelectedLog(log)}
										className="rounded-lg border border-white/20 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/[0.14]"
									>
										View Details
									</button>
									<button
										onClick={() => handleGenerateReport(log.id)}
										disabled={generating === log.id}
										className="rounded-lg bg-[#606bfa] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
									>
										{generating === log.id ? 'Generating...' : 'Generate & Send Report'}
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

export default function ReinstatementLogsPage() {
	return (
		<ProtectedRoute>
			<ReinstatementLogsContent />
		</ProtectedRoute>
	);
}
