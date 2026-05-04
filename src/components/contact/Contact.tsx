'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import toast from 'react-hot-toast';

import { contactsApi } from '@/lib/api';
import { validateContactForm } from '@/lib/validation';
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

const CALENDLY_INLINE_URL =
	'https://calendly.com/contact-spctek/30min?background_color=060b21&text_color=ffffff&primary_color=606b96';

export default function Contact() {
	const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

	useEffect(() => {
		document.body.style.overflow = isCalendlyOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isCalendlyOpen]);

	const handleSubmit = async (values: FormValues, action?: string) => {
		if (action === 'book_call') {
			setIsCalendlyOpen(true);
			return;
		}

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

			{isCalendlyOpen && (
				<div
					className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-2 backdrop-blur-md sm:p-4"
					onClick={() => {
						setIsCalendlyOpen(false);
					}}
				>
					<div
						className="relative flex w-full max-w-[1150px] flex-col overflow-hidden rounded-[24px] border border-white/15 bg-[linear-gradient(160deg,rgba(8,12,28,0.98)_0%,rgba(16,20,42,0.98)_45%,rgba(20,24,48,0.98)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.7)] sm:rounded-[28px]"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9aa4ff]">Schedule a call</p>
								<h3 className="mt-1 text-lg font-semibold text-white sm:text-2xl">Book a 30 minute meeting</h3>
							</div>
							<button
								type="button"
								onClick={() => {
									setIsCalendlyOpen(false);
								}}
								className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
								aria-label="Close booking modal"
							>
								Close
							</button>
						</div>

						<div className="h-[min(700px,78vh)] overflow-hidden px-0 pb-0">
							<div
								data-url={CALENDLY_INLINE_URL}
								className="calendly-inline-widget w-full"
								style={{ minWidth: '320px', height: '100%' }}
							/>
							<Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
