'use client';

import { DarkDropdown } from '../../ui/form-parts/DarkDropdown';
import { RadioCard } from '../../ui/form-parts/RadioCard';
import { FormData, Step } from './types';

type Step1Props = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
};

const MOTIVE_OPTIONS = [
	'Scaling without burnout',
	'Reducing manual errors',
	'Freeing up founder time',
	'Building repeatable processes',
	'Reducing operational costs',
];

export default function Step1({ form, onChange, onNext }: Step1Props) {
	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">Operational Baseline</h2>
				<p className="text-gray-400 text-sm">Tell us a bit about your team and goals.</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">What is your primary goal right now?</label>
				<DarkDropdown value={form.motive} options={MOTIVE_OPTIONS} onChange={(value) => onChange('motive', value)} />
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">Team Size</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{[
						{ v: 'Solo', l: 'Solo - 5', d: 'Founder-led' },
						{ v: '6-15', l: '6-15', d: 'Growing Team' },
						{ v: '16+', l: '16+', d: 'Established' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="teamSize"
							value={v}
							current={form.teamSize}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">Industry</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{[
						{ v: 'SaaS', l: 'SaaS', d: 'Software as a Service' },
						{ v: 'Ecommerce', l: 'Ecommerce', d: 'Online retail' },
						{ v: 'Service', l: 'Service Business', d: 'Consulting / Agency' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="industry"
							value={v}
							current={form.industry}
							label={l}
							desc={d}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="pt-6">
				<button
					type="button"
					onClick={() => onNext(2)}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6]"
				>
					Next: Knowledge Systems <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
