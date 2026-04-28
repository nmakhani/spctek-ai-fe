'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

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
	const journeyModalRef = useRef<HTMLDivElement>(null);

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
		const handleClickOutside = (event: MouseEvent) => {
			if (journeyModalRef.current && !journeyModalRef.current.contains(event.target as Node)) {
				closeJourneyModal();
			}
		};

		if (selectedJourney) {
			document.addEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'hidden';
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
				document.body.style.overflow = '';
			};
		}
	}, [selectedJourney]);

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

			{selectedJourney && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 pt-24 backdrop-blur-sm">
					<div
						ref={journeyModalRef}
						className="flex max-h-[75vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
					>
						<div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/25 px-6 py-4">
							<h3 className="text-lg font-semibold text-white">
								User Journey -{' '}
								{selectedJourney.source === 'ai_deployment_roadmap'
									? 'AI Deployment Roadmap'
									: selectedJourney.source === 'process_diagnostic'
										? 'Process Diagnostic'
										: selectedJourney.source === 'ai_playbook'
											? 'AI Playbook'
											: selectedJourney.source}
							</h3>
							<button
								onClick={closeJourneyModal}
								className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
							>
								Close
							</button>
						</div>
						<div className="overflow-y-auto p-6">
							{selectedJourney.source === 'ai_deployment_roadmap' && selectedJourney.journey ? (
								<div className="space-y-4">
									<div>
										<h4 className="mb-2 text-sm font-semibold text-white/90">Use Cases</h4>
										<div className="flex flex-wrap gap-2">
											{Array.isArray(selectedJourney.journey.useCases) ? (
												selectedJourney.journey.useCases.map((uc: string, i: number) => (
													<span
														key={i}
														className="rounded-full border border-[#606bfa]/30 bg-[#606bfa]/20 px-3 py-1 text-sm text-white/80"
													>
														{uc}
													</span>
												))
											) : (
												<span className="text-white/60">—</span>
											)}
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Team Size</h4>
											<p className="text-white/70">{String(selectedJourney.journey.teamSize || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Data Sensitivity</h4>
											<p className="text-white/70">{String(selectedJourney.journey.dataSensitivity || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Deployment Model</h4>
											<p className="text-white/70">{String(selectedJourney.journey.deploymentModel || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Recommended Tier</h4>
											<p className="text-white/70">{String(selectedJourney.journey.recommendedTier || '—')}</p>
										</div>
									</div>
									<div>
										<h4 className="mb-1 text-sm font-semibold text-white/90">Current Stack</h4>
										<p className="text-white/70">{String(selectedJourney.journey.currentStack || '—')}</p>
									</div>
								</div>
							) : selectedJourney.source === 'process_diagnostic' && selectedJourney.journey ? (
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Motive</h4>
											<p className="text-white/70">{String(selectedJourney.journey.motive || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Team Size</h4>
											<p className="text-white/70">{String(selectedJourney.journey.teamSize || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Industry</h4>
											<p className="text-white/70">{String(selectedJourney.journey.industry || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">SOP Location</h4>
											<p className="text-white/70">{String(selectedJourney.journey.sopLocation || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Decision Making</h4>
											<p className="text-white/70">{String(selectedJourney.journey.decisionMaking || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Onboarding Time</h4>
											<p className="text-white/70">{String(selectedJourney.journey.onboardingTime || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Tool Integration</h4>
											<p className="text-white/70">{String(selectedJourney.journey.toolIntegration || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Founder Bottleneck</h4>
											<p className="text-white/70">{String(selectedJourney.journey.founderBottleneck || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Customer Comms</h4>
											<p className="text-white/70">{String(selectedJourney.journey.customerComms || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Time Wasted</h4>
											<p className="text-white/70">{String(selectedJourney.journey.timeWasted || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Tried to Fix</h4>
											<p className="text-white/70">{String(selectedJourney.journey.triedToFix || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Score</h4>
											<p className="text-white/70">{String(selectedJourney.journey.score || '—')}</p>
										</div>
									</div>
									<div>
										<h4 className="mb-1 text-sm font-semibold text-white/90">Broken Process</h4>
										<p className="text-white/70">{String(selectedJourney.journey.brokenProcess || '—')}</p>
									</div>
								</div>
							) : selectedJourney.source === 'ai_playbook' && selectedJourney.journey ? (
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Business Type</h4>
											<p className="text-white/70">{String(selectedJourney.journey.businessType || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Revenue Range</h4>
											<p className="text-white/70">{String(selectedJourney.journey.revenueRange || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Playbook Focus</h4>
											<p className="text-white/70">{String(selectedJourney.journey.playbookFocus || '—')}</p>
										</div>
										<div>
											<h4 className="mb-1 text-sm font-semibold text-white/90">Urgency</h4>
											<p className="text-white/70">{String(selectedJourney.journey.urgency || '—')}</p>
										</div>
									</div>
									<div>
										<h4 className="mb-1 text-sm font-semibold text-white/90">Operational Challenge</h4>
										<p className="text-white/70">{String(selectedJourney.journey.operationalChallenge || '—')}</p>
									</div>
								</div>
							) : (
								<div>
									<h4 className="mb-2 text-sm font-semibold text-white/90">Raw Journey Data</h4>
									<pre className="overflow-auto rounded-xl bg-black/30 p-4 text-xs text-white/70">
										{JSON.stringify(selectedJourney.journey, null, 2)}
									</pre>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

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
					<div className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
						<h2 className="mb-4 text-xl font-semibold text-white">{editingId ? 'Edit Contact' : 'New Contact'}</h2>
						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Name</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									placeholder="John Doe"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Email</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									placeholder="john@example.com"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Phone</label>
								<input
									type="tel"
									value={formData.phone}
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									placeholder="+1 555 123 4567"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Company</label>
								<input
									type="text"
									value={formData.company}
									onChange={(e) => setFormData({ ...formData, company: e.target.value })}
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									placeholder="Acme Inc."
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Message</label>
								<textarea
									value={formData.message}
									onChange={(e) => setFormData({ ...formData, message: e.target.value })}
									className="h-28 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									placeholder="Message details"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-white/75">Source</label>
								<input
									type="text"
									value={formData.source}
									onChange={(e) => setFormData({ ...formData, source: e.target.value })}
									className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
									placeholder="landing_page"
								/>
							</div>

							<p className="text-xs text-white/60">Note: backend requires at least one of Email or Phone.</p>

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
