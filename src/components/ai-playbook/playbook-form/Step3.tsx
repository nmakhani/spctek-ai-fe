'use client';

import { RadioCard } from '../../ui/form-parts/RadioCard';
import { URGENCIES } from './data';
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
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">
					Describe the Challenge Holding You Back
				</h2>
				<p className="text-gray-400 text-sm">3–5 sentences to help us understand your challenge.</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">Your operational challenge</label>
				<textarea
					className="min-h-[120px] w-full resize-y rounded-xl border border-white/20 bg-black/20 p-4 font-sans text-sm text-white placeholder-white/40 focus:border-[#5A5DF3] focus:outline-none focus:ring-1 focus:ring-[#5A5DF3]"
					placeholder="Describe your current situation..."
					value={form.operationalChallenge}
					onChange={(e) => onChange('operationalChallenge', e.target.value)}
				/>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">
					If this problem were solved, what would it mean for your business?
				</label>
				<p className="text-gray-400 mb-2 text-xs">
					This helps us calibrate the urgency and ROI framing in your playbook.
				</p>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{URGENCIES.map(({ label, desc }) => (
						<RadioCard
							key={label}
							name="urgency"
							value={label}
							current={form.urgency}
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
					onClick={() => onBack(2)}
					className="flex w-1/3 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-white/5"
				>
					<span className="mr-1">←</span> Back
				</button>
				<button
					type="button"
					onClick={() => onNext(4 as Step)}
					disabled={!form.operationalChallenge || !form.urgency}
					className="flex w-2/3 items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] disabled:cursor-not-allowed disabled:opacity-40"
				>
					Next: Contact Info <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
