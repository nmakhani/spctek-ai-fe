'use client';

import { RadioCard } from '../../ui/form-parts/RadioCard';
import { PLAYBOOK_FOCUSES } from './data';
import type { FormData, Step } from './types';

type Step2Props = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
	onBack: (step: Step) => void;
};

export default function Step2({ form, onChange, onNext, onBack }: Step2Props) {
	const currentFocuses = PLAYBOOK_FOCUSES[form.businessType] || PLAYBOOK_FOCUSES['Other'];

	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">Where Do You Need the Most Clarity?</h2>
				<p className="text-gray-400 text-sm">
					Select your AI Playbook Focus. Choose the area where you need the most clarity.
				</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">{form.businessType} AI Focus</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{currentFocuses.map(({ label, desc }) => (
						<RadioCard
							key={label}
							name="playbookFocus"
							value={label}
							current={form.playbookFocus}
							label={label}
							desc={desc}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="flex gap-4 pt-6">
				<button
					type="button"
					onClick={() => onBack(1)}
					className="flex w-1/3 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-white/5"
				>
					<span className="mr-1">←</span> Back
				</button>
				<button
					type="button"
					onClick={() => onNext(3)}
					disabled={!form.playbookFocus}
					className="flex w-2/3 items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] disabled:cursor-not-allowed disabled:opacity-40"
				>
					Next: Challenges <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
