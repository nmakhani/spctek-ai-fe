'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, FileText, RefreshCw, Rocket, TerminalSquare } from 'lucide-react';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { deploymentApi } from '@/lib/api';

interface DeploymentLogFile {
	name: string;
	path: string;
	size_bytes: number;
	modified_at: string;
}

interface DeploymentError {
	timestamp: string | null;
	level: string | null;
	message: string | null;
}

interface DeploymentDetails {
	status?: string;
	last_run?: string | null;
	started_at?: string | null;
	completed_at?: string | null;
	message?: string;
	commit?: string;
	branch?: string;
	[key: string]: unknown;
}

interface DeploymentStatus {
	status: string;
	last_run: string | null;
	deployment: DeploymentDetails | null;
	last_success: DeploymentDetails | null;
	last_error: DeploymentError | null;
	recent_errors: string[];
	recent_log: string[];
	logs_directory: string;
	logs_directory_exists: boolean;
	files: DeploymentLogFile[];
}

function getErrorMessage(err: unknown, fallback: string): string {
	if (err && typeof err === 'object' && 'response' in err) {
		const response = (err as { response?: { data?: { detail?: string; message?: string } } }).response;
		return response?.data?.detail || response?.data?.message || fallback;
	}

	return err instanceof Error ? err.message : fallback;
}

function formatStatus(status?: string) {
	if (!status) {
		return 'Unknown';
	}

	return status
		.split(/[-_\s]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function formatBytes(size: number) {
	if (size < 1024) {
		return `${size} B`;
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} KB`;
	}

	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatGmtPlus5Time(value?: string | null) {
	if (!value) {
		return 'None';
	}

	const normalizedValue = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value) ? `${value.replace(' ', 'T')}Z` : value;
	const date = new Date(normalizedValue);

	if (Number.isNaN(date.getTime())) {
		return `${value} GMT+5`;
	}

	return `${new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
		timeZone: 'Asia/Karachi',
	}).format(date)}`;
}

function statusClasses(status: string) {
	switch (status) {
		case 'success':
			return 'border-emerald-300/35 bg-emerald-500/15 text-emerald-200';
		case 'running':
			return 'border-sky-300/35 bg-sky-500/15 text-sky-200';
		case 'failed':
			return 'border-red-300/35 bg-red-500/15 text-red-200';
		default:
			return 'border-white/15 bg-white/[0.06] text-white/75';
	}
}

function DeploymentContent() {
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [deploying, setDeploying] = useState(false);
	const [error, setError] = useState('');
	const [status, setStatus] = useState<DeploymentStatus | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [deployPassword, setDeployPassword] = useState('');

	const fetchStatus = useCallback(async (showToast = false) => {
		try {
			setRefreshing(true);
			const response = await deploymentApi.status();
			setStatus(response.data as DeploymentStatus);
			setError('');
			if (showToast) {
				toast.success('Deployment status refreshed');
			}
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load deployment status');
			setError(message);
			if (showToast) {
				toast.error(message);
			}
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		void fetchStatus();
	}, [fetchStatus]);

	useEffect(() => {
		if (status?.status !== 'running') {
			return;
		}

		const intervalId = window.setInterval(() => {
			void fetchStatus();
		}, 5000);

		return () => window.clearInterval(intervalId);
	}, [fetchStatus, status?.status]);

	const runDeployment = async () => {
		const password = deployPassword.trim();
		if (!password) {
			toast.error('Deployment password is required');
			return;
		}

		try {
			setDeploying(true);
			setError('');
			const response = await deploymentApi.run({ password });
			toast.success(response.data?.message || 'Deployment started');
			setDeployPassword('');
			setConfirmOpen(false);
			await fetchStatus();
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to start deployment');
			setError(message);
			toast.error(message);
		} finally {
			setDeploying(false);
		}
	};

	const latestStatus = status?.status || 'unknown';
	const details = status?.deployment;
	const recentLog = useMemo(() => status?.recent_log?.slice(-18) || [], [status?.recent_log]);
	const recentErrors = useMemo(() => status?.recent_errors?.slice(-8) || [], [status?.recent_errors]);

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={confirmOpen}
				title="Run deployment"
				message="This will start the backend deployment script and may restart the API service."
				confirmLabel="Run Deployment"
				loading={deploying}
				onConfirm={runDeployment}
				onCancel={() => {
					if (!deploying) {
						setConfirmOpen(false);
					}
				}}
			/>

			<PageHeader title="Deployment" subtitle="Dashboard" backLink="/portal" backText="Back to Home" />

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid gap-5 md:grid-cols-3">
					<StatCard label="Latest Status" loading={loading} count={formatStatus(latestStatus)} />
					<StatCard
						label="Last Run"
						loading={loading}
						count={status?.last_run ? formatGmtPlus5Time(status.last_run) : 'No run recorded'}
					/>
					<StatCard
						label="Log Directory"
						loading={loading}
						count={status?.logs_directory_exists ? 'Available' : 'Missing'}
					/>
				</div>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 rounded-2xl border px-4 py-3">{error}</div>
				)}

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
								onChange={(e) => setDeployPassword(e.target.value)}
								placeholder="Enter deployment password"
								disabled={deploying || latestStatus === 'running'}
								className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition placeholder:text-white/35 focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45 disabled:opacity-60"
							/>
							<div className="flex flex-wrap gap-3">
								<button
									type="button"
									onClick={() => void fetchStatus(true)}
									disabled={refreshing || deploying}
									className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.14] disabled:opacity-60"
								>
									<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
									Refresh
								</button>
								<button
									type="button"
									onClick={() => setConfirmOpen(true)}
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
						<div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
							<div className="flex items-center gap-2 text-sm font-semibold text-white">
								<Clock3 size={17} className="text-[#a9b2ff]" />
								Timing
							</div>
							<div className="mt-4 space-y-2 text-sm text-white/65">
								<p>
									Last run: <span className="text-white/85">{formatGmtPlus5Time(status?.last_run)}</span>
								</p>
								<p>
									Started: <span className="text-white/85">{formatGmtPlus5Time(details?.started_at)}</span>
								</p>
								<p>
									Completed: <span className="text-white/85">{formatGmtPlus5Time(details?.completed_at)}</span>
								</p>
							</div>
						</div>

						<div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
							<div className="flex items-center gap-2 text-sm font-semibold text-white">
								<CheckCircle2 size={17} className="text-emerald-300" />
								Last Success
							</div>
							<div className="mt-4 space-y-2 text-sm text-white/65">
								<p>
									Status: <span className="text-white/85">{formatStatus(status?.last_success?.status)}</span>
								</p>
								<p>
									Run: <span className="text-white/85">{formatGmtPlus5Time(status?.last_success?.last_run)}</span>
								</p>
								<p>
									Message: <span className="text-white/85">{status?.last_success?.message || 'None'}</span>
								</p>
							</div>
						</div>

						<div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
							<div className="flex items-center gap-2 text-sm font-semibold text-white">
								<AlertCircle size={17} className="text-red-300" />
								Last Error
							</div>
							<div className="mt-4 space-y-2 text-sm text-white/65">
								<p>
									Time: <span className="text-white/85">{formatGmtPlus5Time(status?.last_error?.timestamp)}</span>
								</p>
								<p>
									Level: <span className="text-white/85">{status?.last_error?.level || 'None'}</span>
								</p>
								<p className="break-words">
									Message: <span className="text-white/85">{status?.last_error?.message || 'None'}</span>
								</p>
							</div>
						</div>
					</div>
				</section>

				<div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
					<section className="overflow-hidden rounded-3xl border border-white/20 bg-white/[0.05] p-6 backdrop-blur-xl">
						<div className="mb-4 flex items-center gap-2 text-white">
							<TerminalSquare size={19} className="text-[#a9b2ff]" />
							<h2 className="text-xl font-semibold">Recent Log</h2>
						</div>
						<div className="max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-white/70">
							{recentLog.length > 0 ? (
								recentLog.map((line, index) => (
									<p key={`${index}-${line}`} className="whitespace-pre-wrap break-words">
										{line}
									</p>
								))
							) : (
								<p>No log lines available</p>
							)}
						</div>
					</section>

					<section className="space-y-8">
						<div className="overflow-hidden rounded-3xl border border-white/20 bg-white/[0.05] p-6 backdrop-blur-xl">
							<div className="mb-4 flex items-center gap-2 text-white">
								<AlertCircle size={19} className="text-red-300" />
								<h2 className="text-xl font-semibold">Recent Errors</h2>
							</div>
							<div className="space-y-3">
								{recentErrors.length > 0 ? (
									recentErrors.map((line, index) => (
										<div
											key={`${index}-${line}`}
											className="border-red-300/20 bg-red-500/10 text-red-100/85 rounded-2xl border p-3 text-xs leading-5"
										>
											{line}
										</div>
									))
								) : (
									<p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/60">
										No recent errors
									</p>
								)}
							</div>
						</div>

						<div className="overflow-hidden rounded-3xl border border-white/20 bg-white/[0.05] p-6 backdrop-blur-xl">
							<div className="mb-4 flex items-center gap-2 text-white">
								<FileText size={19} className="text-[#a9b2ff]" />
								<h2 className="text-xl font-semibold">Log Files</h2>
							</div>
							<div className="space-y-3">
								{status?.files?.length ? (
									status.files.map((file) => (
										<div key={file.path} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
											<p className="break-words text-sm font-semibold text-white">{file.name}</p>
											<p className="mt-1 text-xs text-white/50">
												{formatBytes(file.size_bytes)} | {formatGmtPlus5Time(file.modified_at)}
											</p>
										</div>
									))
								) : (
									<p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/60">
										No log files found
									</p>
								)}
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}

export default function DeploymentPage() {
	return (
		<ProtectedRoute>
			<DeploymentContent />
		</ProtectedRoute>
	);
}
