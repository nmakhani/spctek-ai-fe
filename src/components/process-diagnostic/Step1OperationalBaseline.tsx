'use client';

import RadioCard from './RadioCard';
import type { FormData, Step } from './types';

type Step1OperationalBaselineProps = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
};

export default function Step1OperationalBaseline({
	form,
	onChange,
	onNext,
}: Step1OperationalBaselineProps) {
	return (
		<div>
			<div>
				<h2>Operational Baseline</h2>
				<p>Tell us a bit about your team and goals.</p>
			</div>

			<div>
				<label>What is your primary goal right now?</label>
				<select value={form.motive} onChange={(e) => onChange('motive', e.target.value)}>
					<option>Scaling without burnout</option>
					<option>Reducing manual errors</option>
					<option>Freeing up founder time</option>
					<option>Building repeatable processes</option>
					<option>Reducing operational costs</option>
				</select>
			</div>

			<div>
				<label>Team Size</label>
				<div>
					{[
						{ v: 'Solo', l: 'Solo – 5', d: 'Founder-led' },
						{ v: '6-15', l: '6 – 15', d: 'Growing team' },
						{ v: '16+', l: '16+', d: 'Established' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="teamSize"
							value={v}
							current={form.teamSize}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<label>Industry / Vertical</label>
				<div>
					{[
						{ v: 'eCommerce', l: 'eCommerce' },
						{ v: 'Agency/Services', l: 'Agency / Services' },
						{ v: 'SaaS', l: 'SaaS / Tech' },
						{ v: 'Professional Services', l: 'Professional Services' },
						{ v: 'Logistics', l: 'Logistics' },
						{ v: 'Other', l: 'Other' },
					].map(({ v, l }) => (
						<RadioCard
							key={v}
							name="industry"
							value={v}
							current={form.industry}
							label={l}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<button type="button" onClick={() => onNext(2)}>
					Next: Knowledge Systems →
				</button>
			</div>
		</div>
	);
}
