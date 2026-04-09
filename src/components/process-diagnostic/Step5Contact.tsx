'use client';

import type { FormData, Step } from './types';

type Step5ContactProps = {
	form: FormData;
	score: number;
	submitError: string;
	submitting: boolean;
	onChange: (name: keyof FormData, value: string) => void;
	onBack: (step: Step) => void;
	onSubmit: () => void;
};

export default function Step5Contact({
	form,
	score,
	submitError,
	submitting,
	onChange,
	onBack,
	onSubmit,
}: Step5ContactProps) {
	return (
		<div>
			<div>
				<h2>Almost There</h2>
				<p>
					Enter your details to unlock your Process Health Score and personalized automation
					playbook.
				</p>
			</div>

			<div>
				<div>
					<div>
						<div>{score}</div>
					</div>
					<div>
						<p>Your score is ready</p>
						<p>Enter your email below to reveal your full scorecard &amp; top 3 fixes.</p>
					</div>
				</div>
			</div>

			<div>
				<div>
					<label>
						Full Name <span>*</span>
					</label>
					<input
						value={form.name}
						onChange={(e) => onChange('name', e.target.value)}
						placeholder="Jane Smith"
					/>
				</div>
				<div>
					<label>Company</label>
					<input
						value={form.company}
						onChange={(e) => onChange('company', e.target.value)}
						placeholder="Acme Corp"
					/>
				</div>
			</div>

			<div>
				<label>
					Work Email <span>*</span>
				</label>
				<input
					type="email"
					value={form.email}
					onChange={(e) => onChange('email', e.target.value)}
					placeholder="jane@company.com"
				/>
			</div>

			{submitError ? <p>{submitError}</p> : null}

			<p>
				We take privacy seriously — your details are only used to send your scorecard and optional
				follow-up. No spam, ever.
			</p>

			<div>
				<button type="button" onClick={() => onBack(4)}>
					← Back
				</button>
				<button type="button" onClick={onSubmit} disabled={!form.name || !form.email || submitting}>
					{submitting ? 'Analyzing...' : 'Reveal My Scorecard →'}
				</button>
			</div>
		</div>
	);
}
