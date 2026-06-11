'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/portal/PageHeader';
import { ReinstatementContactFilter } from '@/components/portal/reinstatement-logs/ReinstatementContactFilter';
import { ReinstatementLogDetailsModal } from '@/components/portal/reinstatement-logs/ReinstatementLogDetailsModal';
import { ReinstatementLogList } from '@/components/portal/reinstatement-logs/ReinstatementLogList';
import type { Contact, ReinstatementLog } from '@/components/portal/reinstatement-logs/types';
import { findContactByOption, getErrorMessage } from '@/components/portal/reinstatement-logs/utils';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { contactsApi, reinstatementApi } from '@/lib/api';

function ReinstatementLogsContent() {
	const [logs, setLogs] = useState<ReinstatementLog[]>([]);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [selectedContactId, setSelectedContactId] = useState<string>('');
	const [generating, setGenerating] = useState<string | null>(null);
	const [selectedLog, setSelectedLog] = useState<ReinstatementLog | null>(null);

	const fetchContacts = async () => {
		try {
			const response = await contactsApi.list();
			const nextContacts = response.data as Contact[];
			setContacts(nextContacts);
			if (nextContacts.length > 0) {
				setSelectedContactId(nextContacts[0].id);
			}
		} catch (err: unknown) {
			console.error(getErrorMessage(err, 'Failed to load contacts'));
		}
	};

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
		void fetchContacts();
	}, []);

	useEffect(() => {
		if (selectedContactId) {
			void fetchLogs(selectedContactId);
		}
	}, [selectedContactId]);

	const handleGenerateReport = async (logId: string) => {
		try {
			setGenerating(logId);
			setError('');
			await reinstatementApi.generateReportFromLog({ log_id: logId });
			toast.success('Report generated. Email delivery is now being tracked.');
			if (selectedContactId) {
				await fetchLogs(selectedContactId);
			}
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to generate report');
			setError(message);
			toast.error(message);
		} finally {
			setGenerating(null);
		}
	};

	const selectedContact = contacts.find((contact) => contact.id === selectedContactId);

	const handleContactChange = (option: string) => {
		const matchingContact = findContactByOption(contacts, option);
		if (matchingContact) {
			setSelectedContactId(matchingContact.id);
		}
	};

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ReinstatementLogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />

			<PageHeader
				title="Reinstatement Logs"
				subtitle="Dashboard"
				backLink="/portal"
				backText="Back to Home"
				buttonText="Refresh"
				buttonOnClick={() => {
					if (selectedContactId) {
						void fetchLogs(selectedContactId);
					}
				}}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<StatCard label="Total Logs" loading={loading} count={logs.length} />

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

				<ReinstatementContactFilter
					contacts={contacts}
					selectedContact={selectedContact}
					onChange={handleContactChange}
				/>

				<ReinstatementLogList
					logs={logs}
					loading={loading}
					selectedContactId={selectedContactId}
					generatingId={generating}
					onViewDetails={setSelectedLog}
					onGenerateReport={handleGenerateReport}
				/>
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
