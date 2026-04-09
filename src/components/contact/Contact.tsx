'use client';

import toast from 'react-hot-toast';

import { SectionHeading } from '../ui/SectionHeading';
import { GradientBorder } from '../ui/GradientBorder';
import GenericForm, { type FieldConfig, type FormValues } from '../ui/GenericForm';

import { contactsApi } from '@/lib/api';
import { validateContactForm } from '@/lib/validation';

const CONTACT_FIELDS: FieldConfig[] = [
	{ name: 'name', label: 'Full Name', type: 'text', placeholder: 'Name', required: true },
	{ name: 'email', label: 'Email', type: 'email', placeholder: 'Email', required: true },
	{ name: 'company', label: 'Company', type: 'text', placeholder: 'Company name', required: true },
	{ name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Phone number' },
	{
		name: 'message',
		label: 'Message',
		type: 'textarea',
		placeholder: 'Message',
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
		<section className="font-poppins relative mt-24" id="contact">
			<div className="mx-auto w-full max-w-7xl px-6 md:px-12">
				<div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
					<div className="self-start p-6 lg:sticky lg:top-28">
						<GradientBorder thickness={2} radius="24px" />
						<SectionHeading size="large" align="left">
							We&apos;d <span className="text-[#606bfa]">Love</span> to Hear <br /> From You
						</SectionHeading>
						<p className="mt-6 max-w-lg text-lg leading-[1.35] text-white md:text-xl">
							Our team will reach out within 24 hours with personalized insights and next steps.
						</p>

						<div className="relative mt-6 flex flex-col gap-4 p-4 text-white/80">
							<GradientBorder thickness={2} radius="24px" />
							<div className="flex items-center gap-3">
								<span className="text-xl">📞</span> +1-469-909-2002
							</div>
							<div className="flex items-center gap-3">
								<span className="text-xl">📧</span> contact@spctek.com
							</div>
							<div className="flex items-center gap-3">
								<span className="text-xl">📍</span> 17714 Bannister St, Dallas, TX
							</div>
						</div>
					</div>

					<GenericForm
						fields={CONTACT_FIELDS}
						validate={validateContactForm}
						onSubmit={handleSubmit}
						submitLabel="GET IN TOUCH"
						loadingLabel="Contacting..."
					/>
				</div>
			</div>
		</section>
	);
}
