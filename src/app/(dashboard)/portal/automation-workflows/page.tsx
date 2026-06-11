'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import type { AutomationWorkflow, WorkflowFormData } from '@/components/portal/automation-workflows/types';
import {
	buildWorkflowPayload,
	EMPTY_WORKFLOW_FORM,
	getErrorMessage,
	workflowToFormData,
} from '@/components/portal/automation-workflows/utils';
import { WorkflowForm } from '@/components/portal/automation-workflows/WorkflowForm';
import { type Category } from '@/components/portal/content-editor/types';
import { PageHeader } from '@/components/portal/PageHeader';
import { PortalTable, type PortalTableAction, type PortalTableColumn } from '@/components/portal/PortalTable';
import { StatCard } from '@/components/portal/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { automationWorkflowsApi, categoriesApi } from '@/lib/api';

function AutomationWorkflowsContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
	const [formData, setFormData] = useState<WorkflowFormData>(EMPTY_WORKFLOW_FORM);

	const fetchData = async () => {
		try {
			setLoading(true);
			const [workflowsResponse, categoriesResponse] = await Promise.all([
				automationWorkflowsApi.list(),
				categoriesApi.list(),
			]);
			setWorkflows(workflowsResponse.data as AutomationWorkflow[]);
			setCategories(categoriesResponse.data as Category[]);
			setError('');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to load automation workflows');
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchData();
	}, []);

	const resetForm = () => {
		setFormData(EMPTY_WORKFLOW_FORM);
		setEditingId(null);
		setShowForm(false);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!formData.name.trim() || !formData.teaser.trim() || !formData.descriptionBody.trim()) {
			toast.error('Name, teaser, and description are required');
			return;
		}

		try {
			setSaving(true);
			setError('');
			const payload = await buildWorkflowPayload(formData);

			if (editingId) {
				const response = await automationWorkflowsApi.update(editingId, payload);
				const updated = response.data as AutomationWorkflow;
				setWorkflows((prev) => prev.map((workflow) => (workflow.id === editingId ? updated : workflow)));
				toast.success('Workflow updated');
			} else {
				const response = await automationWorkflowsApi.create(payload);
				const created = response.data as AutomationWorkflow;
				setWorkflows((prev) => [created, ...prev]);
				toast.success('Workflow created');
			}

			resetForm();
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to save automation workflow');
			setError(message);
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = (workflow: AutomationWorkflow) => {
		setFormData(workflowToFormData(workflow));
		setEditingId(workflow.id);
		setShowForm(true);
	};

	const handleDelete = async () => {
		if (!pendingDeleteId) return;

		try {
			setDeletingId(pendingDeleteId);
			setError('');
			await automationWorkflowsApi.delete(pendingDeleteId);
			setWorkflows((prev) => prev.filter((workflow) => workflow.id !== pendingDeleteId));
			setPendingDeleteId(null);
			toast.success('Workflow deleted');
		} catch (err: unknown) {
			const message = getErrorMessage(err, 'Failed to delete automation workflow');
			setError(message);
			toast.error(message);
		} finally {
			setDeletingId(null);
		}
	};

	const workflowColumns: PortalTableColumn<AutomationWorkflow>[] = [
		{ header: 'Name', accessor: 'name', className: 'font-medium text-white' },
		{
			header: 'Thumbnail',
			type: 'image',
			accessor: 'thumbnail_url',
			fallback: <span className="text-sm text-white/45">None</span>,
			image: {
				width: 64,
				height: 48,
				className: 'h-12 w-16 rounded-lg object-cover',
			},
		},
		{ header: 'Class', accessor: 'class', className: 'capitalize text-white/75' },
		{
			header: 'Categories',
			accessor: (workflow) =>
				workflow.categories.length > 0
					? workflow.categories.map((category) => category.name).join(', ')
					: 'Uncategorized',
		},
		{ header: 'Teaser', accessor: 'teaser', className: 'max-w-md text-white/70' },
		{ header: 'Updated', type: 'date', accessor: 'updated_at' },
	];

	const getWorkflowActions = (workflow: AutomationWorkflow): PortalTableAction<AutomationWorkflow>[] => [
		{
			label: 'Edit',
			disabled: deletingId === workflow.id,
			onClick: handleEdit,
		},
		{
			label: 'Delete',
			loading: deletingId === workflow.id,
			loadingLabel: 'Deleting...',
			variant: 'danger',
			onClick: (selectedWorkflow) => setPendingDeleteId(selectedWorkflow.id),
		},
	];

	return (
		<div className="min-h-screen animate-[pageFade_450ms_ease] pb-12">
			<ConfirmDialog
				isOpen={Boolean(pendingDeleteId)}
				title="Delete workflow"
				message="This automation workflow will be removed from the portal. Continue?"
				confirmLabel="Delete"
				loading={Boolean(deletingId)}
				onConfirm={handleDelete}
				onCancel={() => {
					if (!deletingId) setPendingDeleteId(null);
				}}
			/>

			<PageHeader
				title="Automation Workflows"
				subtitle="Dashboard"
				backLink="/portal"
				backText="Back to Home"
				buttonText="+ New Workflow"
				buttonOnClick={() => setShowForm(!showForm)}
				showForm={showForm}
			/>

			<main className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<StatCard label="Total Workflows" loading={loading} count={workflows.length} />
					<StatCard
						label="System"
						loading={loading}
						count={workflows.filter((item) => item.class === 'system').length}
					/>
					<StatCard
						label="Plugin"
						loading={loading}
						count={workflows.filter((item) => item.class === 'plugin').length}
					/>
				</div>

				{error && (
					<div className="border-red-300/35 bg-red-500/18 text-red-200 mb-6 mt-6 rounded-2xl border px-4 py-3">
						{error}
					</div>
				)}

				{showForm && (
					<WorkflowForm
						formData={formData}
						categories={categories}
						editing={Boolean(editingId)}
						saving={saving}
						onChange={setFormData}
						onSubmit={handleSubmit}
						onCancel={resetForm}
					/>
				)}

				<PortalTable
					columns={workflowColumns}
					loading={loading}
					loadingMessage="Loading automation workflows..."
					empty={workflows.length === 0}
					emptyMessage="No automation workflows yet"
					className="mt-8"
					data={workflows}
					getRowKey={(workflow) => workflow.id}
					actions={getWorkflowActions}
				/>
			</main>
		</div>
	);
}

export default function AutomationWorkflowsPage() {
	return (
		<ProtectedRoute>
			<AutomationWorkflowsContent />
		</ProtectedRoute>
	);
}
