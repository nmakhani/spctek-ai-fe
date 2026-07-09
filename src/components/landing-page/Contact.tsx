'use client';

import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

import { contactsApi } from '@/lib/api';
import { trackFormSubmitted } from '@/lib/klaviyoTracking';
import { validateContactForm } from '@/lib/validation';
import GenericForm, { type FieldConfig, type FormValues } from '../ui/GenericForm';
import { GradientBorder } from '../ui/GradientBorder';

const CONTACT_FIELDS: FieldConfig[] = [
	{
		name: 'name',
		label: 'Name',
		type: 'text',
		placeholder: 'Your name',
		required: true,
	},
	{
		name: 'email',
		label: 'Work Email',
		type: 'email',
		placeholder: 'you@company.com',
		required: true,
	},
	{
		name: 'company',
		label: 'Company',
		type: 'text',
		placeholder: 'Company name',
		required: true,
	},
	{
		name: 'businessType',
		label: 'Business Type',
		type: 'select',
		placeholder: 'Select business type',
		required: true,
		options: ['eCommerce SMB', 'Agency', 'Amazon / Marketplace Operator', 'Operations-heavy SMB'],
	},
	{
		name: 'automationGoal',
		label: 'First Workflow to Automate',
		type: 'select',
		placeholder: 'Select workflow',
		required: true,
		gridSpan: 'full',
		menuMaxHeightClass: 'max-h-36',
		options: [
			'Reporting',
			'Client onboarding',
			'SOP / internal knowledge',
			'Amazon account health',
			'Listing / catalog workflow',
			'Support / email replies',
			'I am not sure yet',
		],
	},
	{
		name: 'message',
		label: 'Manual Work Slowing You Down',
		type: 'textarea',
		placeholder: 'Describe the repetitive work or reporting your team wants to reduce.',
		required: true,
		gridSpan: 'full',
		rows: 3,
	},
];

const validateAssessmentForm = (values: FormValues) => {
	const errors = validateContactForm(values);

	if (!values.email?.trim()) {
		errors.email = 'Work email is required';
	}

	if (!values.company?.trim()) {
		errors.company = 'Company is required';
	}

	if (!values.businessType?.trim()) {
		errors.businessType = 'Business type is required';
	}

	if (!values.automationGoal?.trim()) {
		errors.automationGoal = 'Please choose a workflow';
	}

	if (!values.message?.trim()) {
		errors.message = 'Please describe the manual work slowing your team down';
	}

	return errors;
};

export default function Contact() {
	const handleSubmit = async (values: FormValues) => {
		await contactsApi.create({
			name: values.name,
			company: values.company,
			email: values.email,
			message: [
				values.message,
				'',
				`Business type: ${values.businessType}`,
				`First workflow to automate: ${values.automationGoal}`,
			].join('\n'),
			source: 'landing-page-assessment',
		});

		trackFormSubmitted({
			formName: 'Landing Page AI Ops Assessment Form',
			source: 'landing-page-assessment',
			fields: {
				name: values.name,
				email: values.email,
				company: values.company,
				businessType: values.businessType,
				automationGoal: values.automationGoal,
				message: values.message,
				source: 'landing-page-assessment',
			},
			profile: {
				email: values.email,
				name: values.name,
				company: values.company,
			},
		});

		toast.success("Thank you! We'll be in touch soon.");
	};

	return (
		<section className="font-poppins relative px-4 pt-6 md:px-6 md:pt-8 lg:px-12" id="contact">
			<div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
				<div className="relative flex self-start overflow-hidden rounded-[24px] px-5 py-6 sm:px-6 sm:py-7 lg:sticky lg:top-36 lg:min-h-[400px] lg:px-7 lg:py-8">
					<GradientBorder thickness={2} radius="24px" />

					<div className="relative z-10 flex flex-col justify-center gap-6">
						<h2 className="max-w-xl text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.65rem]">
							Get Your Free <span className="text-[#606bfa]">AI Ops</span> Assessment
						</h2>

						<ul className="mt-5 grid gap-2.5 text-sm font-medium leading-6 text-white/85 sm:text-base">
							{[
								'Built for eCommerce, agency, and ops-heavy SMB teams',
								'Clear workflow recommendation with implementation priorities',
								'Practical next step after the assessment call',
								'No generic AI pitch',
							].map((item) => (
								<li key={item} className="flex items-start gap-3">
									<span className="bg-cyan-300/15 text-cyan-200 mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs">
										<Check className="h-3.5 w-3.5" aria-hidden="true" />
									</span>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				<GenericForm
					fields={CONTACT_FIELDS}
					validate={validateAssessmentForm}
					onSubmit={handleSubmit}
					submitLabel="Request Assessment"
					loadingLabel="Requesting..."
					compact
				/>
			</div>
		</section>
	);
}
