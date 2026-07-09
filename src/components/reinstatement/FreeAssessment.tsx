'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { contactsApi, reinstatementApi } from '@/lib/api';
import { trackFormSubmitted } from '@/lib/klaviyoTracking';
import { validateEstimatorContactForm, validateEstimatorForm } from '@/lib/validation';
import GenericForm, { type FieldConfig, type FormValues } from '../ui/GenericForm';
import LeadCaptureModal, { type LeadCaptureValues } from '../ui/LeadCaptureModal';
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

export default function FreeAssessment() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [pendingData, setPendingData] = useState<FormValues | null>(null);

	const handleStepOne = async (values: FormValues) => {
		setPendingData(values);
		setIsModalOpen(true);
	};

	const handleFinalSubmit = async (contactValues: LeadCaptureValues) => {
		if (!pendingData) return;

		try {
			// Create contact first
			const contactRequest = {
				name: contactValues.name,
				email: contactValues.email,
				phone: contactValues.phone || null,
				company: contactValues.company || null,
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
			trackFormSubmitted({
				formName: 'Amazon Reinstatement Estimator Form',
				source: 'reinstatement_estimator',
				fields: {
					...contactRequest,
					performanceNotification: pendingData.performanceNotification,
					suspensionDate: pendingData.suspensionDate,
					previousAppeals: pendingData.previousAppeals,
					businessModel: pendingData.businessModel,
					fulfillmentChannel: pendingData.fulfillmentChannel,
					suspensionCause: pendingData.suspensionCause,
					availableDocuments: pendingData.availableDocuments,
				},
				profile: {
					email: contactValues.email,
					name: contactValues.name,
					phone: contactValues.phone,
					company: contactValues.company,
				},
			});
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

			<LeadCaptureModal
				isOpen={isModalOpen}
				validate={validateEstimatorContactForm}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleFinalSubmit}
				submitLabel="Receive Report"
				loadingLabel="Sending..."
			/>
		</section>
	);
}
