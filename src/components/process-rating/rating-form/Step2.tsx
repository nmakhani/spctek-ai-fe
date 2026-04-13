'use client';

import type { FormData, Step } from './types';
import { RadioCard } from '../../ui/form-parts/RadioCard';

type Step2Props = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
	onBack: (step: Step) => void;
};

export default function Step2({ form, onChange, onNext, onBack }: Step2Props) {
	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">
					Knowledge &amp; Decision-Making
				</h2>
				<p className="text-gray-400 text-sm">How does information flow inside your business?</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					Where do your SOPs and processes currently live?
				</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{[
						{ v: 'Heads', l: "In people's heads", d: 'Tribal knowledge, not written down' },
						{ v: 'Slack', l: 'Scattered in Slack / WhatsApp', d: 'Usually buried, hard to find' },
						{
							v: 'Docs',
							l: 'Google Docs / Notion',
							d: 'Written but often not maintained',
						},
						{ v: 'Hub', l: 'Centralized & actively used', d: 'Team actually follows them' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="sopLocation"
							value={v}
							current={form.sopLocation}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					Who makes day-to-day operational decisions?
				</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{[
						{
							v: 'Founder',
							l: 'Founder',
							d: 'Almost everything goes through the founder',
						},
						{
							v: 'Leads',
							l: 'Team leads',
							d: 'With frequent founder check-ins',
						},
						{ v: 'Autonomous', l: 'Self-sufficient', d: 'Team is largely autonomous' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="decisionMaking"
							value={v}
							current={form.decisionMaking}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					How long does it take to onboard a new team member?
				</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{[
						{ v: 'Long', l: '1+ months', d: 'Painful' },
						{ v: 'Medium', l: '2-4 weeks', d: 'Average' },
						{ v: 'Short', l: '~1 week', d: 'Streamlined' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="onboardingTime"
							value={v}
							current={form.onboardingTime}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex gap-4 pt-6">
				<button
					type="button"
					onClick={() => onBack(1)}
					className="flex-1 rounded-xl border border-white/20 bg-transparent px-6 py-4 font-medium text-white transition-all hover:bg-white/5"
				>
					← Back
				</button>
				<button
					type="button"
					onClick={() => onNext(3)}
					className="flex w-full flex-[2] items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6]"
				>
					Next: Friction Points <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
