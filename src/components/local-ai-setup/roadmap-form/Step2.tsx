'use client';

import type { FormData, Step } from './types';
import { RadioCard } from '../../ui/form-parts/RadioCard';
import { DarkDropdown } from '../../ui/form-parts/DarkDropdown';
import { DATA_SENSITIVITY_OPTIONS, DEPLOYMENT_MODEL_OPTIONS } from './data';

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
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">Security &amp; Deployment Model</h2>
				<p className="text-gray-400 text-sm">We use this to scope your deployment boundaries.</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">How sensitive is the data?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{DATA_SENSITIVITY_OPTIONS.map(({ value, label, desc }) => (
						<RadioCard
							key={value}
							name="dataSensitivity"
							value={value}
							current={form.dataSensitivity}
							label={label}
							desc={desc}
							onChange={(name, selected) => onChange(name as keyof FormData, selected)}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">Preferred deployment model</label>
				<DarkDropdown
					value={form.deploymentModel}
					options={DEPLOYMENT_MODEL_OPTIONS}
					placeholder="Choose a deployment model"
					onChange={(value) => onChange('deploymentModel', value)}
				/>
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
					Next: Contact Details <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
