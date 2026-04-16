'use client';

import type { FormData, Step } from './types';
import { RadioCard } from '../../ui/form-parts/RadioCard';
import GlowTextField from '../../ui/form-parts/GlowTextField';

type Step4Props = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
	onBack: (step: Step) => void;
};

export default function Step4({ form, onChange, onNext, onBack }: Step4Props) {
	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">The Broken Link</h2>
				<p className="text-gray-400 text-sm">Tell us about the one process that keeps costing you.</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					Describe the most tedious or error-prone manual process in your business
				</label>
				<GlowTextField
					value={form.brokenProcess}
					onChange={(value) => onChange('brokenProcess', value)}
					placeholder="e.g., We manually download orders from Shopify and re-enter them into a spreadsheet for the warehouse team, then manually email tracking updates to customers..."
					multiline={true}
					rows={4}
				/>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">How much time does this process waste per week?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{[
						{ v: '2', l: 'Under 2 hrs/wk', d: 'Minor friction' },
						{ v: '2-5', l: '2 - 5 hrs/wk', d: 'Noticeable drag' },
						{ v: '5-10', l: '5 - 10 hrs/wk', d: 'Significant cost' },
						{ v: '10+', l: '10+ hrs/wk', d: 'Major bottleneck' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="timeWasted"
							value={v}
							current={form.timeWasted}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">Have you tried to fix this before?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{[
						{ v: 'Never', l: 'Never', d: 'Not sure where to start' },
						{ v: 'Attempted', l: 'Attempted', d: 'But nothing stuck' },
						{ v: 'Partial', l: 'Partially solved', d: 'Still has gaps' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="triedToFix"
							value={v}
							current={form.triedToFix}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3 pt-6 sm:flex-row sm:gap-4">
				<button
					type="button"
					onClick={() => onBack(3)}
					className="flex-1 rounded-xl border border-white/20 bg-transparent px-6 py-4 font-medium text-white transition-all hover:bg-white/5"
				>
					← Back
				</button>
				<button
					type="button"
					onClick={() => onNext(5)}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] sm:flex-[2]"
				>
					Get My Scorecard <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
