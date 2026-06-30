import { AlertCircle, Eye, FileText, LoaderCircle, TerminalSquare } from 'lucide-react';

import type { DeploymentFileContent, DeploymentLogFile } from './types';
import { formatBytes, formatGmtPlus5Time } from './utils';

interface DeploymentLogsPanelProps {
	recentLog: string[];
	recentErrors: string[];
	files: DeploymentLogFile[];
	selectedFile: string | null;
	fileContent: DeploymentFileContent | null;
	fileLoading: boolean;
	fileError: string;
	onFileSelect: (filename: string) => void;
}

export function DeploymentLogsPanel({
	recentLog,
	recentErrors,
	files,
	selectedFile,
	fileContent,
	fileLoading,
	fileError,
	onFileSelect,
}: DeploymentLogsPanelProps) {
	const LAST_LOG_LINES = 50;

	const visibleContent =
		fileContent?.name === 'deployment.log'
			? fileContent.content.trimEnd().split(/\r?\n/).slice(-LAST_LOG_LINES).join('\n')
			: fileContent?.content;

	return (
		<div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
			<section className="overflow-hidden rounded-3xl border border-white/20 bg-white/[0.05] p-6 backdrop-blur-xl">
				<div className="mb-4 flex items-center justify-between gap-3 text-white">
					<div className="flex items-center gap-2">
						<TerminalSquare size={19} className="text-[#a9b2ff]" />
						<h2 className="text-xl font-semibold">{selectedFile || 'Recent Log'}</h2>
					</div>
					{fileContent?.truncated && (
						<span className="border-amber-300/25 bg-amber-500/10 text-amber-200 rounded-full border px-2.5 py-1 text-xs">
							Latest 512 KB
						</span>
					)}
				</div>
				<div className="max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-white/70">
					{fileLoading ? (
						<div className="flex items-center gap-2 text-white/60">
							<LoaderCircle size={16} className="animate-spin" />
							Loading {selectedFile}...
						</div>
					) : fileError ? (
						<p className="text-red-200">{fileError}</p>
					) : fileContent ? (
						<pre className="whitespace-pre-wrap break-words font-mono">{visibleContent || 'File is empty'}</pre>
					) : recentLog.length > 0 ? (
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
								<button
									type="button"
									key={file.path}
									onClick={() => onFileSelect(file.name)}
									className={`w-full rounded-2xl border p-3 text-left transition ${
										selectedFile === file.name
											? 'border-[#8c96ff]/55 bg-[#606bfa]/15'
											: 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]'
									}`}
								>
									<div className="flex items-center justify-between gap-3">
										<p className="break-words text-sm font-semibold text-white">{file.name}</p>
										<Eye size={15} className="shrink-0 text-[#a9b2ff]" />
									</div>
									<p className="mt-1 text-xs text-white/50">
										{formatBytes(file.size_bytes)} | {formatGmtPlus5Time(file.modified_at)}
									</p>
								</button>
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
