import type { ReinstatementLog } from './types';
import { getStatusClass, getStatusLabel, previewText } from './utils';

interface ReinstatementLogListProps {
	logs: ReinstatementLog[];
	loading: boolean;
	selectedContactId: string;
	generatingId: string | null;
	onViewDetails: (log: ReinstatementLog) => void;
	onGenerateReport: (logId: string) => void | Promise<void>;
}

export function ReinstatementLogList({
	logs,
	loading,
	selectedContactId,
	generatingId,
	onViewDetails,
	onGenerateReport,
}: ReinstatementLogListProps) {
	if (loading) {
		return <div className="py-12 text-center text-white/55">Loading reinstatement logs...</div>;
	}

	if (logs.length === 0) {
		return (
			<div className="py-12 text-center text-white/55">
				{selectedContactId ? 'No reinstatement logs for this contact' : 'Select a contact to view logs'}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{logs.map((log) => (
				<ReinstatementLogCard
					key={log.id}
					log={log}
					generating={generatingId === log.id}
					onViewDetails={onViewDetails}
					onGenerateReport={onGenerateReport}
				/>
			))}
		</div>
	);
}

function ReinstatementLogCard({
	log,
	generating,
	onViewDetails,
	onGenerateReport,
}: {
	log: ReinstatementLog;
	generating: boolean;
	onViewDetails: (log: ReinstatementLog) => void;
	onGenerateReport: (logId: string) => void | Promise<void>;
}) {
	return (
		<div className="rounded-2xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.58)] backdrop-blur-xl">
			<div className="mb-4 flex items-start justify-between">
				<div>
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="font-semibold text-white">{log.business_model}</h3>
						<span
							className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(log.report_status)}`}
						>
							{getStatusLabel(log.report_status)}
						</span>
					</div>
					<p className="mt-1 text-sm text-white/65">Suspension Date: {log.suspension_date}</p>
					<p className="text-sm text-white/65">Fulfillment Channel: {log.fulfillment_channel}</p>
					<p className="text-sm text-white/65">Previous Appeals: {log.appeals_made}</p>
					{log.report_error && <p className="text-red-200/80 mt-2 text-xs">Last error: {log.report_error}</p>}
				</div>
				<div className="text-right">
					<p className="text-xs text-white/50">{new Date(log.created_at).toLocaleDateString()}</p>
					<p className="text-xs text-white/40">{new Date(log.created_at).toLocaleTimeString()}</p>
				</div>
			</div>

			<div className="mb-4 space-y-3 border-t border-white/10 pt-4">
				<PreviewBlock label="Performance Notification" value={previewText(log.performance_notification)} />
				<PreviewBlock label="Seller's Belief" value={previewText(log.seller_belief)} />
				<PreviewBlock label="Available Documents" value={log.available_documents} />
			</div>

			<div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
				<button
					onClick={() => onViewDetails(log)}
					className="rounded-lg border border-white/20 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/[0.14]"
				>
					View Details
				</button>
				<button
					onClick={() => onGenerateReport(log.id)}
					disabled={generating}
					className="rounded-lg bg-[#606bfa] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
				>
					{generating ? 'Generating...' : 'Generate & Send Report'}
				</button>
			</div>
		</div>
	);
}

function PreviewBlock({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs font-medium uppercase tracking-widest text-white/60">{label}</p>
			<p className="mt-1 max-h-24 overflow-y-auto text-xs text-white/70">{value}</p>
		</div>
	);
}
