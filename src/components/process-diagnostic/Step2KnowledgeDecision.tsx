'use client';

import RadioCard from './RadioCard';
import type { FormData, Step } from './types';

type Step2KnowledgeDecisionProps = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
	onBack: (step: Step) => void;
};

export default function Step2KnowledgeDecision({
	form,
	onChange,
	onNext,
	onBack,
}: Step2KnowledgeDecisionProps) {
	return (
		<div>
			<div>
				<h2>Knowledge &amp; Decision-Making</h2>
				<p>How does information flow inside your business?</p>
			</div>

			<div>
				<label>Where do your SOPs and processes currently live?</label>
				<div>
					{[
						{ v: 'Heads', l: "In people's heads", d: 'Tribal knowledge, not written down' },
						{ v: 'Slack', l: 'Scattered in Slack / WhatsApp', d: 'Usually buried, hard to find' },
						{
							v: 'Docs',
							l: 'Google Docs / Notion (often outdated)',
							d: 'Written but not maintained',
						},
						{ v: 'Hub', l: 'Centralized & actively used', d: 'Team actually follows them' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="sopLocation"
							value={v}
							current={form.sopLocation}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<label>Who makes day-to-day operational decisions?</label>
				<div>
					{[
						{
							v: 'Founder',
							l: 'Almost everything goes through the founder',
							d: 'High dependency risk',
						},
						{
							v: 'Leads',
							l: 'Team leads with frequent founder check-ins',
							d: 'Partial delegation',
						},
						{ v: 'Autonomous', l: 'Team is largely self-sufficient', d: 'Healthy structure' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="decisionMaking"
							value={v}
							current={form.decisionMaking}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<label>How long does it take to onboard a new team member?</label>
				<div>
					{[
						{ v: 'Long', l: '1+ months', d: 'Painful' },
						{ v: 'Medium', l: '2–4 weeks', d: 'Average' },
						{ v: 'Short', l: '~1 week', d: 'Streamlined' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="onboardingTime"
							value={v}
							current={form.onboardingTime}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<button type="button" onClick={() => onBack(1)}>
					← Back
				</button>
				<button type="button" onClick={() => onNext(3)}>
					Next: Friction Points →
				</button>
			</div>
		</div>
	);
}
