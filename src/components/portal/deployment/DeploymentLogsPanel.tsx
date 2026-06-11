import { AlertCircle, FileText, TerminalSquare } from 'lucide-react';

import type { DeploymentLogFile } from './types';
import { formatBytes, formatGmtPlus5Time } from './utils';

interface DeploymentLogsPanelProps {
	recentLog: string[];
	recentErrors: string[];
	files: DeploymentLogFile[];
}

export function DeploymentLogsPanel({ recentLog, recentErrors, files }: DeploymentLogsPanelProps) {
	return (
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
						{files.length ? (
							files.map((file) => (
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
	);
}
