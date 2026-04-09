'use client';

import RadioCard from './RadioCard';
import type { FormData, Step } from './types';

type Step4BrokenLinkProps = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
	onBack: (step: Step) => void;
};

export default function Step4BrokenLink({ form, onChange, onNext, onBack }: Step4BrokenLinkProps) {
	return (
		<div>
			<div>
				<h2>The Broken Link</h2>
				<p>Tell us about the one process that keeps costing you.</p>
			</div>

			<div>
				<label>Describe the most tedious or error-prone manual process in your business</label>
				<textarea
					rows={4}
					value={form.brokenProcess}
					onChange={(e) => onChange('brokenProcess', e.target.value)}
					placeholder="e.g., We manually download orders from Shopify and re-enter them into a spreadsheet for the warehouse team, then manually email tracking updates to customers..."
				/>
			</div>

			<div>
				<label>How much time does this process waste per week?</label>
				<div>
					{[
						{ v: '2', l: 'Under 2 hrs/wk', d: 'Minor friction' },
						{ v: '2-5', l: '2 – 5 hrs/wk', d: 'Noticeable drag' },
						{ v: '5-10', l: '5 – 10 hrs/wk', d: 'Significant cost' },
						{ v: '10+', l: '10+ hrs/wk', d: 'Major bottleneck' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="timeWasted"
							value={v}
							current={form.timeWasted}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<label>Have you tried to fix this before?</label>
				<div>
					{[
						{ v: 'Never', l: 'Never — not sure where to start' },
						{ v: 'Attempted', l: 'Attempted, but nothing stuck' },
						{ v: 'Partial', l: 'Partially solved, still has gaps' },
					].map(({ v, l }) => (
						<RadioCard
							key={v}
							name="triedToFix"
							value={v}
							current={form.triedToFix}
							label={l}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<button type="button" onClick={() => onBack(3)}>
					← Back
				</button>
				<button type="button" onClick={() => onNext(5)}>
					Get My Scorecard →
				</button>
			</div>
		</div>
	);
}
