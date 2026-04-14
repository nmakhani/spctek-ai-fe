'use client';

import type { FormData, Step } from './types';
import { RadioCard } from '../../ui/form-parts/RadioCard';
import { USE_CASES, TEAM_SIZE_OPTIONS } from './data';

type Step1Props = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
};

export default function Step1({ form, onChange, onNext }: Step1Props) {
	const toggleUseCase = (id: string) => {
		onChange(
			'useCases',
			form.useCases.includes(id)
				? form.useCases.filter((item) => item !== id).join('|')
				: [...form.useCases, id].join('|')
		);
	};

	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">AI Deployment Scope</h2>
				<p className="text-gray-400 text-sm">Tell us what you want to deploy and how large the rollout is.</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">What will your AI handle?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{USE_CASES.map((useCase) => {
						const selected = form.useCases.includes(useCase.id);

						return (
							<RadioCard
								key={useCase.id}
								name="useCases"
								value={useCase.id}
								current=""
								label={useCase.label}
								desc={useCase.desc}
								onChange={(_, selectedValue) => toggleUseCase(selectedValue)}
								selected={selected}
								leadingIcon={useCase.icon}
							/>
						);
					})}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">How many people will use the AI?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{TEAM_SIZE_OPTIONS.map(({ value, label, desc }) => (
						<RadioCard
							key={value}
							name="teamSize"
							value={value}
							current={form.teamSize}
							label={label}
							desc={desc}
							onChange={onChange as (name: string, value: string) => void}
						/>
					))}
				</div>
			</div>

			<div className="pt-6">
				<button
					type="button"
					onClick={() => onNext(2)}
					disabled={form.useCases.length === 0}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A5DF3] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#4d50d6] disabled:cursor-not-allowed disabled:opacity-40"
				>
					Next: Deployment Details <span className="ml-1">→</span>
				</button>
			</div>
		</div>
	);
}
