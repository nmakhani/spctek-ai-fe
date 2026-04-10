'use client';

import type { Step } from './types';

type ProgressBarProps = {
	step: Step;
};

export default function ProgressBar({ step }: ProgressBarProps) {
	const pct = (step / 5) * 100;

	return (
		<div className="relative mb-10 w-full">
			<div className="mb-4 flex items-center justify-between px-1">
				<span className="text-gray-300 text-sm tracking-wide">Step {step} of 5</span>
				<span className="text-sm font-semibold text-[#606bfa]">{Math.round(pct)}%</span>
			</div>
			{/* Progress track */}
			<div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
				{/* Progress fill */}
				<div
					className="h-full rounded-full bg-[#606bfa] shadow-[0_0_10px_#606bfa] transition-all duration-500 ease-out"
					style={{ width: `${pct}%` }}
					role="progressbar"
					aria-label={`Step ${step} of 5`}
					aria-valuenow={pct}
					aria-valuemin={0}
					aria-valuemax={100}
				/>
			</div>
		</div>
	);
}
