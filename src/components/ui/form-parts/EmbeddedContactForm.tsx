'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { contactsApi } from '../../../lib/api';
import { isValidEmail, isValidName, isValidPhone } from '../../../lib/validation';
import { GlassGlow } from '../GlassGlow';
import GlowTextField from './GlowTextField';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

interface EmbeddedContactFormProps {
	formData: JsonObject;
	source: 'process_diagnostic' | 'ai_deployment_roadmap' | 'ai_playbook';
	message: string;
	journeyData: JsonObject;
	title?: string;
	subtitle?: string;
	buttonText?: string;
	submittingText?: string;
	successMessage?: string;
}

export default function EmbeddedContactForm({
	source,
	message,
	journeyData,
	title = 'Get your full report via email',
	subtitle = 'Enter your details to receive your complete report.',
	buttonText = 'Get My Full Report →',
	submittingText = 'Submitting...',
	successMessage = 'Your submission has been recorded. You will receive the full report on your email.',
}: EmbeddedContactFormProps) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [company, setCompany] = useState('');
	const [phone, setPhone] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async () => {
		if (!name.trim() || !email.trim()) {
			toast.error('Name and email are required');
			return;
		}
		if (!isValidName(name)) {
			toast.error('Please enter a valid name');
			return;
		}
		if (!isValidEmail(email)) {
			toast.error('Please enter a valid email');
			return;
		}
		if (!isValidPhone(phone)) {
			toast.error('Please enter a valid phone number or leave empty');
			return;
		}

		setSubmitting(true);
		try {
			await contactsApi.create({
				name: name.trim(),
				email: email.trim(),
				phone: phone.trim() || null,
				company: company || null,
				message,
				source,
				journey: journeyData,
			});
			toast.success(successMessage);
			setSubmitted(true);
		} catch {
			toast.error('Submission failed. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	const canSubmit =
		name.trim() &&
		email.trim() &&
		isValidName(name) &&
		isValidEmail(email) &&
		isValidPhone(phone) &&
		!submitting &&
		!submitted;

	return (
		<div className="relative z-10 mt-6">
			<GlassGlow angle={120} opacity={0.4} start={20} end={80} radius="24px" />

			<div className="relative flex flex-col gap-6 rounded-[23px] bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6 md:p-8">
				{submitted ? (
					<div className="text-center">
						<p className="text-xl font-bold text-white sm:text-2xl">Your submission has been recorded</p>
						<p className="text-gray-400 mt-2 text-sm leading-relaxed">
							You will receive the full report on your email.
						</p>
					</div>
				) : (
					<>
						<div className="text-center">
							<p className="text-xl font-bold text-white sm:text-2xl">{title}</p>
							<p className="text-gray-400 mt-2 text-sm leading-relaxed">{subtitle}</p>
						</div>

						<div className="flex flex-col gap-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="flex flex-col gap-3">
									<label className="text-left text-sm font-bold text-white">
										Full Name <span className="text-red-400">*</span>
									</label>
									<GlowTextField value={name} onChange={setName} placeholder="Jane Smith" />
								</div>

								<div className="flex flex-col gap-3">
									<label className="text-left text-sm font-bold text-white">
										Email <span className="text-red-400">*</span>
									</label>
									<GlowTextField type="email" value={email} onChange={setEmail} placeholder="jane@company.com" />
								</div>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="flex flex-col gap-3">
									<label className="text-left text-sm font-bold text-white">Company</label>
									<GlowTextField value={company} onChange={setCompany} placeholder="Acme Corp" />
								</div>

								<div className="flex flex-col gap-3">
									<label className="text-left text-sm font-bold text-white">Phone</label>
									<GlowTextField type="tel" value={phone} onChange={setPhone} placeholder="+1 (555) 123-4567" />
								</div>
							</div>
						</div>

						<button
							type="button"
							onClick={handleSubmit}
							disabled={!canSubmit}
							className="w-full rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{submitting ? submittingText : buttonText}
						</button>

						<p className="text-gray-500 text-center text-xs leading-relaxed">
							We take privacy seriously. Your details are only used to send your report and optional follow-up. No spam,
							ever.
						</p>
					</>
				)}
			</div>
		</div>
	);
}
