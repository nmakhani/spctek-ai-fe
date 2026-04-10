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
				<h2 className="mb-2 text-2xl font-semibold tracking-tight text-white">
					AI Deployment Scope
				</h2>
				<p className="text-gray-400 text-sm">
					Tell us what you want to deploy and how large the rollout is.
				</p>
			</div>

			<div className="flex flex-col gap-3">
				<label className="text-sm font-semibold text-white">What will your AI handle?</label>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{USE_CASES.map((useCase) => {
						const selected = form.useCases.includes(useCase.id);

						return (
							<button
								key={useCase.id}
								type="button"
								onClick={() => toggleUseCase(useCase.id)}
								className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
									selected
										? 'border-[#606bfa] bg-[#606bfa]/10 shadow-[0_0_20px_rgba(96,107,250,0.15)]'
										: 'border-white/[0.07] bg-white/[0.02] hover:border-[#606bfa]/30 hover:bg-[#606bfa]/5'
								}`}
							>
								<div className="flex items-start gap-3">
									<div
										className={`mt-0.5 flex-shrink-0 ${selected ? 'text-[#606bfa]' : 'text-slate-500'}`}
									>
										{useCase.icon}
									</div>
									<div>
										<p
											className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-300'}`}
										>
											{useCase.label}
										</p>
										<p className="mt-0.5 text-xs text-slate-500">{useCase.desc}</p>
									</div>
								</div>
							</button>
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
							onChange={onChange}
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
