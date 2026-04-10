'use client';

import type { FormData, Step } from './types';
import { GlassGlow } from '../../ui/GlassGlow';
import { GradientBorder } from '../../ui/GradientBorder';
import { RadioCard } from '../../ui/form-parts/RadioCard';

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
				<p className="text-gray-400 text-sm">
					Tell us about the one process that keeps costing you.
				</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					Describe the most tedious or error-prone manual process in your business
				</label>
				<div className="relative z-10">
					<GradientBorder thickness={1} radius="16px" subtle={true} />
					<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
					<div style={{ overflow: 'hidden', borderRadius: '15px' }}>
						<textarea
							rows={4}
							className="w-full resize-none bg-transparent px-5 py-4 text-sm text-white/90 outline-none transition-all placeholder:text-white/25 focus:ring-0"
							value={form.brokenProcess}
							onChange={(e) => onChange('brokenProcess', e.target.value)}
							placeholder="e.g., We manually download orders from Shopify and re-enter them into a spreadsheet for the warehouse team, then manually email tracking updates to customers..."
						/>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					How much time does this process waste per week?
				</label>
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
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					Have you tried to fix this before?
				</label>
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
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div className="flex gap-4 pt-6">
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
					className="flex w-full flex-[2] items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6]"
				>
					Get My Scorecard <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
