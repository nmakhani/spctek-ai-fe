'use client';

import type { Step } from './types';

type ProgressBarProps = {
	step: Step;
};

export default function ProgressBar({ step }: ProgressBarProps) {
	const pct = (step / 5) * 100;

	return (
		<div>
			<div>
				<span>Step {step} of 5</span>
				<span>{Math.round(pct)}%</span>
			</div>
			<progress value={pct} max={100} aria-label={`Step ${step} of 5`} />
		</div>
	);
}
