'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { contactsApi } from '@/lib/api';
import { trackFormSubmitted } from '@/lib/klaviyoTracking';
import { validateContactForm } from '@/lib/validation';
import CalendlyModal from '../ui/CalendlyModal';
import GenericForm, { type FieldConfig, type FormValues } from '../ui/GenericForm';
import { GradientBorder } from '../ui/GradientBorder';
import { SectionHeading } from '../ui/SectionHeading';

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
	const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

	const handleSubmit = async (values: FormValues, action?: string) => {
		if (action === 'book_call') {
			setIsCalendlyOpen(true);
			return;
		}

		await contactsApi.create({
			name: values.name,
			email: values.email,
			company: values.company,
			message: values.message,
			phone: values.phone || undefined,
			source: 'website',
		});

		trackFormSubmitted({
			formName: 'Contact Page Form',
			source: 'website',
			fields: {
				name: values.name,
				email: values.email,
				company: values.company,
				phone: values.phone,
				message: values.message,
				source: 'website',
			},
			profile: {
				email: values.email,
				name: values.name,
				phone: values.phone,
				company: values.company,
			},
		});

		toast.success("Thank you! We'll be in touch soon.");
	};

	return (
		<section className="font-poppins relative mt-24 md:mt-32" id="contact">
			<div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-12">
				<div className="grid grid-cols-1 items-start gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14">
					<div className="relative w-full p-4 sm:p-6 lg:sticky lg:top-32 lg:self-start lg:p-6">
						<GradientBorder thickness={2} radius="24px" />
						<SectionHeading size="large" align="left">
							We&apos;d <span className="text-[#606bfa]">Love</span> to Hear <br className="hidden sm:block" /> From You
						</SectionHeading>
						<p className="mt-5 max-w-lg text-base leading-[1.45] text-white sm:text-lg md:text-xl">
							Our team will reach out within 24 hours with personalized insights and next steps.
						</p>

						<div className="relative mt-5 flex flex-col gap-3 p-4 text-sm text-white/80 sm:gap-4 sm:text-base">
							<GradientBorder thickness={2} radius="24px" />
							<div className="flex items-center gap-3 break-words">
								<span className="text-xl">📞</span> +1-469-545-1517
							</div>
							<div className="flex items-center gap-3 break-words">
								<span className="text-xl">📧</span> info@spctek.ai
							</div>
							<div className="flex items-center gap-3 break-words">
								<span className="text-xl">📍</span> 11311 Harry Hines Blvd, Dallas, TX
							</div>
						</div>
					</div>

					<GenericForm
						fields={CONTACT_FIELDS}
						validate={validateContactForm}
						onSubmit={handleSubmit}
						skipValidationForActions={['book_call']}
						submitActions={[
							{ label: 'Get in Touch', value: 'get_in_touch' },
							{ label: 'Book a Call', value: 'book_call' },
						]}
						loadingLabel="Contacting..."
					/>
				</div>
			</div>

			<CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
		</section>
	);
}
