import type { ReinstatementLog } from './types';
import { getStatusClass, getStatusLabel } from './utils';

interface ReinstatementLogDetailsModalProps {
	log: ReinstatementLog | null;
	onClose: () => void;
}

export function ReinstatementLogDetailsModal({ log, onClose }: ReinstatementLogDetailsModalProps) {
	if (!log) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
			onClick={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<div className="custom-scrollbar max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_44%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl md:p-8">
				<div className="mb-6 flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.14em] text-[#9aa4ff]">Reinstatement Log Details</p>
						<h2 className="mt-2 text-2xl font-semibold text-white">{log.business_model}</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm text-white/85 transition hover:bg-white/[0.14]"
					>
						Close
					</button>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<DetailField label="Log ID" value={log.id} breakAll />
					<DetailField label="Contact ID" value={log.contact_id} breakAll />
					<DetailField label="Business Model" value={log.business_model} />
					<DetailField label="Fulfillment Channel" value={log.fulfillment_channel} />
					<DetailField label="Suspension Date" value={log.suspension_date} />
					<DetailField label="Appeals Made" value={String(log.appeals_made)} />
					<div className="rounded-xl border border-white/10 bg-black/20 p-4">
						<p className="text-xs uppercase tracking-wider text-white/50">Report Status</p>
						<span
							className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(log.report_status)}`}
						>
							{getStatusLabel(log.report_status)}
						</span>
					</div>
					<DetailField
						label="Report Emailed At"
						value={log.report_emailed_at ? new Date(log.report_emailed_at).toLocaleString() : 'Not emailed yet'}
					/>
					{log.report_error && (
						<div className="border-red-300/25 bg-red-500/10 rounded-xl border p-4 md:col-span-2">
							<p className="text-red-200/70 text-xs uppercase tracking-wider">Report Error</p>
							<p className="text-red-100/85 mt-1 whitespace-pre-wrap text-sm">{log.report_error}</p>
						</div>
					)}
					<LongDetailField label="Performance Notification" value={log.performance_notification} scroll />
					<LongDetailField label="Seller Belief" value={log.seller_belief} />
					<LongDetailField label="Available Documents" value={log.available_documents} />
					<DetailField label="Created At" value={new Date(log.created_at).toLocaleString()} />
					<DetailField label="Updated At" value={new Date(log.updated_at).toLocaleString()} />
				</div>
			</div>
		</div>
	);
}

function DetailField({ label, value, breakAll = false }: { label: string; value: string; breakAll?: boolean }) {
	return (
		<div className="rounded-xl border border-white/10 bg-black/20 p-4">
			<p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
			<p className={`mt-1 text-sm text-white/80 ${breakAll ? 'break-all' : ''}`}>{value}</p>
		</div>
	);
}

function LongDetailField({ label, value, scroll = false }: { label: string; value: string; scroll?: boolean }) {
	return (
		<div className="rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2">
			<p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
			<div className={scroll ? 'custom-scrollbar mt-1 h-48 overflow-y-auto pr-2' : undefined}>
				<p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{value}</p>
			</div>
		</div>
	);
}
