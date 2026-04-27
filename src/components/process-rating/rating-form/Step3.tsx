'use client';

import { RadioCard } from '../../ui/form-parts/RadioCard';
import type { FormData, Step } from './types';

type Step3Props = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
	onBack: (step: Step) => void;
};

export default function Step3({ form, onChange, onNext, onBack }: Step3Props) {
	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">Friction &amp; Bottlenecks</h2>
				<p className="text-gray-400 text-sm">Where does momentum die in your operations?</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">How well do your tools talk to each other?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{[
						{ v: 'Manual', l: 'Manual copy-pasting', d: 'Highest risk of errors' },
						{ v: 'Zapier', l: 'Basic Zapier / Make', d: 'Brittle automation' },
						{ v: 'Native', l: 'Native/Custom integrations', d: 'Reliable and fast' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="toolIntegration"
							value={v}
							current={form.toolIntegration}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">The Founder Bottleneck</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{[
						{
							v: 'Everything',
							l: 'Almost everything',
							d: "Team can't move without you",
						},
						{ v: 'Some', l: 'Big decisions only', d: 'Some breathing room' },
						{ v: 'Autonomous', l: 'Highly autonomous', d: 'Well-delegated' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="founderBottleneck"
							value={v}
							current={form.founderBottleneck}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">How is customer communication managed?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{[
						{ v: 'Manual', l: 'Manually by team members', d: 'Reactive and inconsistent' },
						{
							v: 'Outsourced',
							l: 'Outsourced to VA / agency',
							d: 'Off your plate but still manual',
						},
						{ v: 'Partial', l: 'Partly automated (canned responses)', d: 'Getting there' },
						{ v: 'Full', l: 'Fully automated or AI-handled', d: 'Running in the background' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="customerComms"
							value={v}
							current={form.customerComms}
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
					onClick={() => onBack(2)}
					className="flex-1 rounded-xl border border-white/20 bg-transparent px-6 py-4 font-medium text-white transition-all hover:bg-white/5"
				>
					← Back
				</button>
				<button
					type="button"
					onClick={() => onNext(4)}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] sm:flex-[2]"
				>
					Next: The Broken Link <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
