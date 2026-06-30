'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { DeploymentControlPanel } from '@/components/portal/deployment/DeploymentControlPanel';
import { DeploymentLogsPanel } from '@/components/portal/deployment/DeploymentLogsPanel';
import type { DeploymentFileContent, DeploymentStatus } from '@/components/portal/deployment/types';
import { formatGmtPlus5Time, formatStatus, getErrorMessage } from '@/components/portal/deployment/utils';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { deploymentApi } from '@/lib/api';

function DeploymentContent() {
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [deploying, setDeploying] = useState(false);
	const [error, setError] = useState('');
	const [status, setStatus] = useState<DeploymentStatus | null>(null);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [fileContent, setFileContent] = useState<DeploymentFileContent | null>(null);
	const [fileLoading, setFileLoading] = useState(false);
	const [fileError, setFileError] = useState('');
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

	const fetchDeploymentFile = useCallback(async (filename: string) => {
		try {
			setSelectedFile(filename);
			setFileLoading(true);
			setFileError('');
			const response = await deploymentApi.file(filename);
			setFileContent(response.data as DeploymentFileContent);
		} catch (err: unknown) {
			setFileContent(null);
			setFileError(getErrorMessage(err, `Failed to load ${filename}`));
		} finally {
			setFileLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchStatus();
	}, [fetchStatus]);

	useEffect(() => {
		if (selectedFile || !status?.files?.length) {
			return;
		}

		const defaultFile = status.files.find((file) => file.name === 'deployment.log') || status.files[0];
		void fetchDeploymentFile(defaultFile.name);
	}, [fetchDeploymentFile, selectedFile, status?.files]);

	useEffect(() => {
		if (!['starting', 'running'].includes(status?.status || '')) {
			return;
		}

		const intervalId = window.setInterval(() => {
			void fetchStatus();
			if (selectedFile) {
				void fetchDeploymentFile(selectedFile);
			}
		}, 5000);

		return () => window.clearInterval(intervalId);
	}, [fetchDeploymentFile, fetchStatus, selectedFile, status?.status]);

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

				<DeploymentControlPanel
					status={status}
					deployPassword={deployPassword}
					deploying={deploying}
					refreshing={refreshing}
					onPasswordChange={setDeployPassword}
					onRefresh={() => void fetchStatus(true)}
					onRunClick={() => setConfirmOpen(true)}
				/>

				<DeploymentLogsPanel
					recentLog={recentLog}
					recentErrors={recentErrors}
					files={status?.files || []}
					selectedFile={selectedFile}
					fileContent={fileContent}
					fileLoading={fileLoading}
					fileError={fileError}
					onFileSelect={(filename) => void fetchDeploymentFile(filename)}
				/>
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
