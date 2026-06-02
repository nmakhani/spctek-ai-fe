'use client';

import GenericForm, { type FieldConfig, type FormValues, type ValidateFn } from './GenericForm';

export interface LeadCaptureValues {
	name: string;
	email: string;
	phone?: string;
	company?: string;
}

interface LeadCaptureModalProps {
	isOpen: boolean;
	title?: string;
	subtitle?: string;
	submitLabel?: string;
	loadingLabel?: string;
	validate?: ValidateFn;
	onClose: () => void;
	onSubmit: (values: LeadCaptureValues) => Promise<void>;
}

const baseFields: FieldConfig[] = [
	{
		name: 'name',
		type: 'text',
		label: 'Name',
		placeholder: 'John Doe',
		required: true,
		gridSpan: 'half',
	},
	{
		name: 'email',
		type: 'email',
		label: 'Email',
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
	{
		name: 'company',
		type: 'text',
		label: 'Company',
		placeholder: 'Company name',
		gridSpan: 'half',
	},
];

export default function LeadCaptureModal({
	isOpen,
	title = 'One Last Step',
	subtitle = 'Where should we send your assessment?',
	submitLabel = 'Submit',
	loadingLabel = 'Sending...',
	validate,
	onClose,
	onSubmit,
}: LeadCaptureModalProps) {
	if (!isOpen) {
		return null;
	}

	const handleSubmit = async (values: FormValues) => {
		await onSubmit({
			name: values.name,
			email: values.email,
			phone: values.phone || undefined,
			company: values.company || undefined,
		});
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="custom-scrollbar max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 shadow-2xl sm:p-5 md:p-6">
				<div className="mb-4">
					<h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
					<p className="mt-2 text-white/60">{subtitle}</p>
				</div>

				<GenericForm
					fields={baseFields}
					validate={validate}
					onSubmit={handleSubmit}
					submitLabel={submitLabel}
					loadingLabel={loadingLabel}
					compact
				/>
			</div>
		</div>
	);
}
