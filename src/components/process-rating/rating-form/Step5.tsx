'use client';

import GlowTextField from '../../ui/form-parts/GlowTextField';
import type { FormData, Step } from './types';

type Step5Props = {
	form: FormData;
	submitError: string;
	submitting: boolean;
	onChange: (name: keyof FormData, value: string) => void;
	onBack: (step: Step) => void;
	onSubmit: () => void;
};

export default function Step5({
	form,
	submitError,
	submitting,
	onChange,
	onBack,
	onSubmit,
}: Step5Props) {
	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">Almost There</h2>
				<p className="text-gray-400 text-sm">
					Enter your details to unlock your Process Health Score and personalized automation
					playbook.
				</p>
			</div>

			<div className="border-indigo-500/20 bg-indigo-500/5 rounded-2xl border p-6 backdrop-blur-sm">
				<div className="flex items-center gap-6">
					<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5A5DF3] to-[#8082F8] shadow-[0_0_20px_rgba(90,93,243,0.3)]">
						<div className="text-3xl font-bold text-white">?</div>
					</div>
					<div>
						<p className="text-lg font-semibold text-white">Your score is ready</p>
						<p className="text-indigo-200 mt-1 text-sm">
							Enter your email below to reveal your full scorecard &amp; top 4 fixes.
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
						<GlowTextField
							value={form.name}
							onChange={(value) => onChange('name', value)}
							placeholder="Jane Smith"
						/>
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
					</div>
				</div>
			</div>

			{submitError ? <p className="text-red-500 text-sm font-medium">{submitError}</p> : null}

			<p className="text-gray-500 text-xs leading-relaxed">
				We take privacy seriously. Your details are only used to send your scorecard and optional
				follow-up. No spam, ever.
			</p>

			<div className="flex gap-4 pt-2">
				<button
					type="button"
					onClick={() => onBack(4)}
					className="flex-1 rounded-xl border border-white/20 bg-transparent px-6 py-4 font-medium text-white transition-all hover:bg-white/5"
				>
					← Back
				</button>
				<button
					type="button"
					onClick={onSubmit}
					disabled={!form.name || !form.email || submitting}
					className="flex w-full flex-[2] items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{submitting ? 'Analyzing...' : 'Reveal My Scorecard →'}
				</button>
			</div>
		</div>
	);
}
