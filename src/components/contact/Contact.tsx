'use client';

import { useEffect, useState } from 'react';
import { InlineWidget } from 'react-calendly';
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

const CALENDLY_URL = 'https://calendly.com/f-ali-spctek/30min';

export default function Contact() {
	const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
	const [calendlyPrefill, setCalendlyPrefill] = useState<{ name: string; email: string } | null>(null);

	useEffect(() => {
		document.body.style.overflow = isCalendlyOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isCalendlyOpen]);

	const handleSubmit = async (values: FormValues, action?: string) => {
		await contactsApi.create({
			name: values.name,
			company: values.company,
			email: values.email || undefined,
			phone: values.phone || undefined,
			message: values.message,
			source: 'website',
		});

		toast.success("Thank you! We'll be in touch soon.");

		if (action === 'book_call') {
			setCalendlyPrefill({ name: values.name, email: values.email });
			setIsCalendlyOpen(true);
		}
	};

	return (
		<section className="font-poppins relative mt-20 md:mt-24" id="contact">
			<div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-12">
				<div className="grid grid-cols-1 items-start gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14">
					<div className="relative w-full p-4 sm:p-6 lg:sticky lg:top-28 lg:self-start lg:p-6">
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
								<span className="text-xl">📞</span> +1-469-909-2002
							</div>
							<div className="flex items-center gap-3 break-words">
								<span className="text-xl">📧</span> contact@spctek.com
							</div>
							<div className="flex items-center gap-3 break-words">
								<span className="text-xl">📍</span> 17714 Bannister St, Dallas, TX
							</div>
						</div>
					</div>

					<GenericForm
						fields={CONTACT_FIELDS}
						validate={validateContactForm}
						onSubmit={handleSubmit}
						submitActions={[
							{ label: 'Get in Touch', value: 'get_in_touch' },
							{ label: 'Book a Call', value: 'book_call' },
						]}
						loadingLabel="Contacting..."
					/>
				</div>
			</div>

			{isCalendlyOpen && calendlyPrefill && (
				<div
					className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
					onClick={() => {
						setIsCalendlyOpen(false);
						setCalendlyPrefill(null);
					}}
				>
					<div
						className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(160deg,rgba(8,12,28,0.98)_0%,rgba(16,20,42,0.98)_45%,rgba(20,24,48,0.98)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9aa4ff]">Schedule a call</p>
								<h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Book a 30 minute meeting</h3>
							</div>
							<button
								type="button"
								onClick={() => {
									setIsCalendlyOpen(false);
									setCalendlyPrefill(null);
								}}
								className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
								aria-label="Close booking modal"
							>
								Close
							</button>
						</div>

						<div className="h-[min(76vh,760px)] w-full p-2 sm:p-4">
							<InlineWidget
								url={CALENDLY_URL}
								prefill={{
									name: calendlyPrefill.name,
									email: calendlyPrefill.email,
								}}
								pageSettings={{
									backgroundColor: '0f172a',
									primaryColor: '606bfa',
									textColor: 'ffffff',
									hideLandingPageDetails: true,
									hideEventTypeDetails: true,
									hideGdprBanner: true,
								}}
								styles={{ height: '100%', width: '100%' }}
							/>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
