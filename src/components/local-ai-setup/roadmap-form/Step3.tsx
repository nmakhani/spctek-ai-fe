'use client';

import type { FormData, Step } from './types';
import { GlassGlow } from '../../ui/GlassGlow';
import { GradientBorder } from '../../ui/GradientBorder';

type Step3Props = {
	form: FormData;
	submitting: boolean;
	onChange: (name: keyof FormData, value: string) => void;
	onBack: (step: Step) => void;
	onSubmit: () => void;
};

export default function Step3({ form, submitting, onChange, onBack, onSubmit }: Step3Props) {
	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">Contact Details</h2>
				<p className="text-gray-400 text-sm">
					Enter your details to generate your architecture recommendation.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<label className="text-sm font-semibold text-white">Full Name</label>
					<div className="relative z-10">
						<GradientBorder thickness={1} radius="16px" subtle={true} />
						<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
						<div style={{ overflow: 'hidden', borderRadius: '15px' }}>
							<input
								className="w-full bg-transparent px-5 py-4 text-sm text-white/90 outline-none transition-all placeholder:text-white/25 focus:ring-0"
								value={form.name}
								onChange={(event) => onChange('name', event.target.value)}
								placeholder="Jane Smith"
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<label className="text-sm font-semibold text-white">Company</label>
					<div className="relative z-10">
						<GradientBorder thickness={1} radius="16px" subtle={true} />
						<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
						<div style={{ overflow: 'hidden', borderRadius: '15px' }}>
							<input
								className="w-full bg-transparent px-5 py-4 text-sm text-white/90 outline-none transition-all placeholder:text-white/25 focus:ring-0"
								value={form.company}
								onChange={(event) => onChange('company', event.target.value)}
								placeholder="Acme Corp"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<label className="text-sm font-semibold text-white">Work Email</label>
					<div className="relative z-10">
						<GradientBorder thickness={1} radius="16px" subtle={true} />
						<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
						<div style={{ overflow: 'hidden', borderRadius: '15px' }}>
							<input
								type="email"
								className="w-full bg-transparent px-5 py-4 text-sm text-white/90 outline-none transition-all placeholder:text-white/25 focus:ring-0"
								value={form.email}
								onChange={(event) => onChange('email', event.target.value)}
								placeholder="jane@company.com"
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<label className="text-sm font-semibold text-white">
						Phone <span className="text-gray-500 font-normal">(optional)</span>
					</label>
					<div className="relative z-10">
						<GradientBorder thickness={1} radius="16px" subtle={true} />
						<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
						<div style={{ overflow: 'hidden', borderRadius: '15px' }}>
							<input
								type="tel"
								className="w-full bg-transparent px-5 py-4 text-sm text-white/90 outline-none transition-all placeholder:text-white/25 focus:ring-0"
								value={form.phone}
								onChange={(event) => onChange('phone', event.target.value)}
								placeholder="+1 (555) 123-4567"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-4 pt-6">
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
					disabled={!form.name || !form.email || submitting}
					className="flex w-full flex-[2] items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{submitting ? 'Generating...' : 'Generate My Architecture →'}
				</button>
			</div>
		</div>
	);
}
