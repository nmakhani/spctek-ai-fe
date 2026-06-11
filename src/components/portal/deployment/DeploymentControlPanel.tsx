import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Clock3, RefreshCw, Rocket } from 'lucide-react';

import type { DeploymentStatus } from './types';
import { formatGmtPlus5Time, formatStatus, statusClasses } from './utils';

interface DeploymentControlPanelProps {
	status: DeploymentStatus | null;
	deployPassword: string;
	deploying: boolean;
	refreshing: boolean;
	onPasswordChange: (value: string) => void;
	onRefresh: () => void;
	onRunClick: () => void;
}

export function DeploymentControlPanel({
	status,
	deployPassword,
	deploying,
	refreshing,
	onPasswordChange,
	onRefresh,
	onRunClick,
}: DeploymentControlPanelProps) {
	const latestStatus = status?.status || 'unknown';
	const details = status?.deployment;

	return (
		<section className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
			<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
				<div>
					<p className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#9aa4ff]">Release Control</p>
					<div className="mt-3 flex flex-wrap items-center gap-3">
						<h2 className="text-2xl font-semibold text-white">Backend Deployment</h2>
						<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(latestStatus)}`}>
							{formatStatus(latestStatus)}
						</span>
					</div>
					<p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
						Trigger the backend deployment job and monitor the most recent status, log output, and error stream.
					</p>
				</div>

				<div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[360px]">
					<label className="text-sm font-medium text-white/75" htmlFor="deploy-password">
						Deployment Password
					</label>
					<input
						id="deploy-password"
						type="password"
						value={deployPassword}
						onChange={(event) => onPasswordChange(event.target.value)}
						placeholder="Enter deployment password"
						disabled={deploying || latestStatus === 'running'}
						className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition placeholder:text-white/35 focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45 disabled:opacity-60"
					/>
					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							onClick={onRefresh}
							disabled={refreshing || deploying}
							className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.14] disabled:opacity-60"
						>
							<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
							Refresh
						</button>
						<button
							type="button"
							onClick={onRunClick}
							disabled={deploying || latestStatus === 'running' || !deployPassword.trim()}
							className="inline-flex items-center gap-2 rounded-xl bg-[#606bfa] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f79ff] hover:shadow-[0_0_18px_rgba(96,107,250,0.5)] disabled:opacity-60"
						>
							<Rocket size={16} />
							{deploying ? 'Starting...' : latestStatus === 'running' ? 'Deployment Running' : 'Run Deployment'}
						</button>
					</div>
				</div>
			</div>

			<div className="mt-7 grid gap-4 md:grid-cols-3">
				<DeploymentSummaryCard icon={<Clock3 size={17} className="text-[#a9b2ff]" />} title="Timing">
					<p>
						Last run: <span className="text-white/85">{formatGmtPlus5Time(status?.last_run)}</span>
					</p>
					<p>
						Started: <span className="text-white/85">{formatGmtPlus5Time(details?.started_at)}</span>
					</p>
					<p>
						Completed: <span className="text-white/85">{formatGmtPlus5Time(details?.completed_at)}</span>
					</p>
				</DeploymentSummaryCard>

				<DeploymentSummaryCard icon={<CheckCircle2 size={17} className="text-emerald-300" />} title="Last Success">
					<p>
						Status: <span className="text-white/85">{formatStatus(status?.last_success?.status)}</span>
					</p>
					<p>
						Run: <span className="text-white/85">{formatGmtPlus5Time(status?.last_success?.last_run)}</span>
					</p>
					<p>
						Message: <span className="text-white/85">{status?.last_success?.message || 'None'}</span>
					</p>
				</DeploymentSummaryCard>

				<DeploymentSummaryCard icon={<AlertCircle size={17} className="text-red-300" />} title="Last Error">
					<p>
						Time: <span className="text-white/85">{formatGmtPlus5Time(status?.last_error?.timestamp)}</span>
					</p>
					<p>
						Level: <span className="text-white/85">{status?.last_error?.level || 'None'}</span>
					</p>
					<p className="break-words">
						Message: <span className="text-white/85">{status?.last_error?.message || 'None'}</span>
					</p>
				</DeploymentSummaryCard>
			</div>
		</section>
	);
}

function DeploymentSummaryCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
	return (
		<div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
			<div className="flex items-center gap-2 text-sm font-semibold text-white">
				{icon}
				{title}
			</div>
			<div className="mt-4 space-y-2 text-sm text-white/65">{children}</div>
		</div>
	);
}
