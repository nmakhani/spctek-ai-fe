'use client';

import type { FormData, Step } from './types';
import GlowTextField from '../../ui/form-parts/GlowTextField';

type Step3Props = {
	form: FormData;
	submitting: boolean;
	onChange: (name: keyof FormData, value: string) => void;
	onBack: (step: Step) => void;
	onSubmit: () => void;
};

export default function Step3({ form, submitting, onChange, onBack, onSubmit }: Step3Props) {
	const trimmedName = form.name.trim();
	const trimmedEmail = form.email.trim();
	const hasName = trimmedName.length > 0;
	const hasEmail = trimmedEmail.length > 0;
	const hasPhone = form.phone.trim().length > 0;
	const isNameValid = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(trimmedName);
	const isEmailValid =
		/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail) && !/\.\./.test(trimmedEmail);
	const phoneDigits = form.phone.replace(/\D/g, '');
	const isPhoneValid =
		!hasPhone ||
		(/^[+]?[\d()\-\s]{10,25}$/.test(form.phone.trim()) &&
			phoneDigits.length >= 10 &&
			phoneDigits.length <= 15 &&
			!/^(\d)\1+$/.test(phoneDigits));
	const canSubmit = hasEmail && isEmailValid && hasName && isNameValid && isPhoneValid && !submitting;

	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">Contact Details</h2>
				<p className="text-gray-400 text-sm">Enter your details to generate your architecture recommendation.</p>
			</div>

			<div className="border-indigo-500/20 bg-indigo-500/5 rounded-2xl border p-4 backdrop-blur-sm sm:p-6">
				<div className="flex items-center gap-4 sm:gap-6">
					<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5A5DF3] to-[#8082F8] shadow-[0_0_20px_rgba(90,93,243,0.3)] sm:h-20 sm:w-20">
						<div className="text-2xl font-bold text-white sm:text-3xl">?</div>
					</div>
					<div>
						<p className="text-base font-semibold text-white sm:text-lg">Your recommendation is ready</p>
						<p className="text-indigo-200 mt-1 text-sm">
							Enter your email below to reveal your full architecture recommendation.
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="flex flex-col gap-3">
						<label className="text-left text-sm font-bold text-white">
							Full Name <span className="text-red-400">*</span>
						</label>
						<GlowTextField value={form.name} onChange={(value) => onChange('name', value)} placeholder="Jane Smith" />
						{hasName && !isNameValid ? (
							<p className="text-red-400 text-xs font-medium">
								Enter a valid name using letters, spaces, apostrophes, or hyphens.
							</p>
						) : null}
					</div>

					<div className="flex flex-col gap-3">
						<label className="text-left text-sm font-bold text-white">
							Email <span className="text-red-400">*</span>
						</label>
						<GlowTextField
							type="email"
							value={form.email}
							onChange={(value) => onChange('email', value)}
							placeholder="jane@company.com"
						/>
						{hasEmail && !isEmailValid ? (
							<p className="text-red-400 text-xs font-medium">Enter a valid email address.</p>
						) : null}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="flex flex-col gap-3">
						<label className="text-left text-sm font-bold text-white">Company</label>
						<GlowTextField
							value={form.company}
							onChange={(value) => onChange('company', value)}
							placeholder="Acme Corp"
						/>
					</div>

					<div className="flex flex-col gap-3">
						<label className="text-left text-sm font-bold text-white">Phone</label>
						<GlowTextField
							type="tel"
							value={form.phone}
							onChange={(value) => onChange('phone', value)}
							placeholder="+1 (555) 123-4567"
						/>
						{hasPhone && !isPhoneValid ? (
							<p className="text-red-400 text-xs font-medium">
								Enter a valid phone number (10 to 15 digits) or leave this field empty.
							</p>
						) : null}
					</div>
				</div>
			</div>

			<p className="text-gray-500 text-xs leading-relaxed">
				We take privacy seriously. Your details are only used to send your roadmap and optional follow-up. No spam,
				ever.
			</p>

			<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
				<button
					type="button"
					onClick={() => onBack(2)}
					className="flex-1 rounded-xl border border-white/20 bg-transparent px-6 py-4 font-medium text-white transition-all hover:bg-white/5"
				>
					← Back
				</button>
				<button
					type="button"
					onClick={onSubmit}
					disabled={!canSubmit}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-[2]"
				>
					{submitting ? 'Generating...' : 'Generate My Architecture →'}
				</button>
			</div>
		</div>
	);
}
