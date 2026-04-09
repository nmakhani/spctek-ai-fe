'use client';

import toast from 'react-hot-toast';
import GenericForm, { type FieldConfig, type FormValues } from '../ui/GenericForm';
import { SectionHeading } from '../ui/SectionHeading';

import { contactsApi } from '@/lib/api';
import { validateContactForm } from '@/lib/validation';

const CONTACT_FIELDS: FieldConfig[] = [
	{
		name: 'name',
		label: 'Full Name',
		type: 'text',
		placeholder: 'Nick Smith',
		required: true,
	},
	{
		name: 'company',
		label: 'Company',
		type: 'text',
		placeholder: 'Spctek',
		required: true,
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email',
		placeholder: 'nicksmith@company.com',
	},
	{
		name: 'phone',
		label: 'Phone',
		type: 'tel',
		placeholder: '+1 (555) 123-6454',
	},
	{
		name: 'message',
		label: 'Message',
		type: 'textarea',
		placeholder: 'Tell us about your business challenges...',
		required: true,
		gridSpan: 'full',
		rows: 4,
	},
];

export default function Contact() {
	const handleSubmit = async (values: FormValues) => {
		await contactsApi.create({
			name: values.name,
			company: values.company,
			email: values.email || undefined,
			phone: values.phone || undefined,
			message: values.message,
			source: 'website',
		});

		toast.success("Thank you! We'll be in touch soon.");
	};

	return (
		<section className="font-poppins relative overflow-hidden px-6 md:px-12" id="contact">
			<div className="relative mx-auto w-full max-w-5xl">
				<div className="mx-auto mb-10 max-w-4xl text-center md:mb-12">
					<SectionHeading size="large">
						Ready to See How <span className="text-[#606bfa]">AI</span> Can Improve Your Operations?
					</SectionHeading>
					<p className="mx-auto mt-5 max-w-3xl text-lg leading-[1.35] text-white md:text-2xl">
						Provide your details, and we&apos;ll prepare a custom AI plan tailored to your business.
					</p>
				</div>

				<GenericForm
					fields={CONTACT_FIELDS}
					validate={validateContactForm}
					onSubmit={handleSubmit}
					submitLabel="Contact Us"
					loadingLabel="Contacting..."
				/>
			</div>
		</section>
	);
}
