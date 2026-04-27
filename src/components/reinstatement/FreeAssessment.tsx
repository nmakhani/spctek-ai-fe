'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { contactsApi, reinstatementApi } from '@/lib/api';
import { validateEstimatorContactForm, validateEstimatorForm } from '@/lib/validation';
import GenericForm, { type FieldConfig, type FormValues } from '../ui/GenericForm';
import { SectionHeading } from '../ui/SectionHeading';

const DOWNLOAD_FIELD: FieldConfig[] = [
	{
		name: 'sample_report',
		type: 'action',
		label: 'Have a look at a sample report',
		placeholder: 'Sample Reinstatement Report.pdf',
		actionLabel: 'View',
		onAction: () => window.open('/reports/sample.pdf'),
		gridSpan: 'full',
	},
];

const REINSTATEMENT_FIELDS: FieldConfig[] = [
	{
		name: 'performanceNotification',
		type: 'textarea',
		label: 'Amazon Performance Notification',
		placeholder: 'Paste the full text of your Amazon Performance Notification email here...',
		subtext: 'Include the complete notification text from Amazon',
		required: true,
		gridSpan: 'full',
		rows: 6,
	},

	{
		name: 'suspensionDate',
		type: 'date',
		label: 'Suspension Date',
		subtext: 'Date your account was suspended',
		required: true,
		gridSpan: 'half',
	},
	{
		name: 'previousAppeals',
		type: 'text',
		label: 'Previous Appeals',
		placeholder: '0',
		subtext: 'Number of appeal attempts made',
		required: true,
		gridSpan: 'half',
	},
	{
		name: 'businessModel',
		type: 'select',
		label: 'Business Model',
		placeholder: 'Select Business Model',
		subtext: 'Select the model that best describes your operation',
		required: true,
		gridSpan: 'half',
		options: ['Dropshipping (Retail / Online Arbitrage)', 'Private Label / White Label', 'Wholesale (Reseller)'],
	},
	{
		name: 'fulfillmentChannel',
		type: 'select',
		label: 'Fulfillment Channel',
		placeholder: 'Select Fulfillment Channel',
		subtext: 'How you fulfill your orders',
		required: true,
		gridSpan: 'half',
		options: ['Fulfilled by Amazon (FBA)', 'Fulfilled by Merchant (FBM)'],
	},
	{
		name: 'suspensionCause',
		type: 'textarea',
		label: 'Your Belief on Suspension Cause',
		placeholder: 'Describe what you believe caused the suspension...',
		subtext: 'Your perspective on what caused the suspension',
		required: true,
		gridSpan: 'full',
		rows: 4,
	},
	{
		name: 'availableDocuments',
		type: 'textarea',
		label: 'Available Documents',
		placeholder: 'List the documents you have available...',
		subtext: 'Separate with commas or line breaks',
		required: true,
		gridSpan: 'full',
		rows: 3,
	},
];

const CONTACT_FIELDS: FieldConfig[] = [
	{
		name: 'name',
		type: 'text',
		label: 'Your Name',
		placeholder: 'John Doe',
		required: true,
		gridSpan: 'full',
	},
	{
		name: 'email',
		type: 'email',
		label: 'Email Address',
		placeholder: 'john@example.com',
		required: true,
		gridSpan: 'half',
	},
	{
		name: 'phone',
		type: 'text',
		label: 'Phone Number',
		placeholder: '+1 (555) 000-0000',
		gridSpan: 'half',
	},
];

export default function FreeAssessment() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [pendingData, setPendingData] = useState<FormValues | null>(null);

	const handleStepOne = async (values: FormValues) => {
		setPendingData(values);
		setIsModalOpen(true);
	};

	const handleFinalSubmit = async (contactValues: FormValues) => {
		if (!pendingData) return;

		try {
			// Create contact first
			const contactRequest = {
				name: contactValues.name,
				email: contactValues.email,
				phone: contactValues.phone || null,
				source: 'reinstatement_estimator',
			};

			const contactResponse = await contactsApi.create(contactRequest);
			const contactId = contactResponse.data.id;

			// Create reinstatement log
			const logRequest = {
				contact_id: contactId,
				performance_notification: pendingData.performanceNotification,
				suspension_date: pendingData.suspensionDate,
				business_model: pendingData.businessModel,
				fulfillment_channel: pendingData.fulfillmentChannel,
				appeals_made: parseInt(pendingData.previousAppeals as string) || 0,
				seller_belief: pendingData.suspensionCause,
				available_documents: pendingData.availableDocuments,
			};

			const logResponse = await reinstatementApi.createLog(logRequest);
			const logId = logResponse.data.id;

			// Generate report from log
			const reportRequest = {
				log_id: logId,
			};

			await reinstatementApi.generateReportFromLog(reportRequest);
			toast.success('Report generated! Check your email.');
			setIsModalOpen(false);
		} catch (error) {
			console.error(error);
			toast.error('Failed to generate report.');
		}
	};

	return (
		<section className="font-poppins relative overflow-hidden px-4 md:px-6 lg:px-12" id="free-assessment">
			<div className="relative mx-auto w-full max-w-5xl">
				<div className="mx-auto mb-10 max-w-4xl text-center md:mb-12">
					<SectionHeading size="large">
						Amazon <span className="text-[#606bfa]">Reinstatement</span> Estimator
					</SectionHeading>
					<p className="mx-auto mt-4 max-w-4xl text-base leading-[1.45] text-white sm:text-lg md:mt-5 md:text-xl lg:text-2xl">
						Paste your Amazon performance notification to get an instant AI-powered reinstatement assessment with clear
						next steps.
					</p>
				</div>

				<div className="flex flex-col gap-12">
					<GenericForm fields={DOWNLOAD_FIELD} />
					<GenericForm
						fields={REINSTATEMENT_FIELDS}
						validate={validateEstimatorForm}
						onSubmit={handleStepOne}
						submitLabel="Generate Report"
						loadingLabel="Generating..."
						clearable={true}
					/>
				</div>
			</div>

			{isModalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
					onClick={(e) => {
						if (e.target === e.currentTarget) setIsModalOpen(false);
					}}
				>
					<div className="custom-scrollbar max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl sm:p-6 md:p-10">
						<div className="mb-6">
							<h3 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">One Last Step</h3>
							<p className="mt-2 text-white/60">Where should we send your assessment?</p>
						</div>

						<GenericForm
							fields={CONTACT_FIELDS}
							validate={validateEstimatorContactForm}
							onSubmit={handleFinalSubmit}
							submitLabel="Receive Report"
							loadingLabel="Sending..."
						/>
					</div>
				</div>
			)}
		</section>
	);
}
