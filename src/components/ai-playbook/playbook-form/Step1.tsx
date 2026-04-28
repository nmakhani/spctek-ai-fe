'use client';

import { RadioCard } from '../../ui/form-parts/RadioCard';
import { BUSINESS_TYPES, REVENUE_RANGES } from './data';
import type { FormData, Step } from './types';

type Step1Props = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
};

export default function Step1({ form, onChange, onNext }: Step1Props) {
	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">Tell Us About Your Business</h2>
				<p className="text-gray-400 text-sm">We map AI opportunities differently depending on your model and scale.</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">What type of business do you run?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{BUSINESS_TYPES.map((val) => (
						<RadioCard
							key={val}
							name="businessType"
							value={val}
							current={form.businessType}
							label={val}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">What&apos;s your annual revenue range?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{REVENUE_RANGES.map((val) => (
						<RadioCard
							key={val}
							name="revenueRange"
							value={val}
							current={form.revenueRange}
							label={val}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="pt-6">
				<button
					type="button"
					onClick={() => onNext(2)}
					disabled={!form.businessType || !form.revenueRange}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] disabled:cursor-not-allowed disabled:opacity-40"
				>
					Next: Needs <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
