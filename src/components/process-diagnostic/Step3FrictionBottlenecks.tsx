'use client';

import RadioCard from './RadioCard';
import type { FormData, Step } from './types';

type Step3FrictionBottlenecksProps = {
	form: FormData;
	onChange: (name: keyof FormData, value: string) => void;
	onNext: (step: Step) => void;
	onBack: (step: Step) => void;
};

export default function Step3FrictionBottlenecks({
	form,
	onChange,
	onNext,
	onBack,
}: Step3FrictionBottlenecksProps) {
	return (
		<div>
			<div>
				<h2>Friction &amp; Bottlenecks</h2>
				<p>Where does momentum die in your operations?</p>
			</div>

			<div>
				<label>How well do your tools talk to each other?</label>
				<div>
					{[
						{ v: 'Manual', l: 'Manual copy-pasting between tools', d: 'Highest risk of errors' },
						{ v: 'Zapier', l: 'Basic Zapier / Make (breaks sometimes)', d: 'Brittle automation' },
						{ v: 'Native', l: 'Native integrations or custom code', d: 'Reliable and fast' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="toolIntegration"
							value={v}
							current={form.toolIntegration}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<label>The Founder Bottleneck</label>
				<div>
					{[
						{
							v: 'Everything',
							l: 'Founder approves almost everything',
							d: "Team can't move without you",
						},
						{ v: 'Some', l: 'Founder approves big decisions only', d: 'Some breathing room' },
						{ v: 'Autonomous', l: 'Team is highly autonomous', d: 'Well-delegated' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="founderBottleneck"
							value={v}
							current={form.founderBottleneck}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<label>How is customer communication managed?</label>
				<div>
					{[
						{ v: 'Manual', l: 'Manually by team members', d: 'Reactive and inconsistent' },
						{
							v: 'Outsourced',
							l: 'Outsourced to VA / agency',
							d: 'Off your plate but still manual',
						},
						{ v: 'Partial', l: 'Partly automated (canned responses, etc.)', d: 'Getting there' },
						{ v: 'Full', l: 'Fully automated or AI-handled', d: 'Running in the background' },
					].map(({ v, l, d }) => (
						<RadioCard
							key={v}
							name="customerComms"
							value={v}
							current={form.customerComms}
							label={l}
							desc={d}
							onChange={onChange}
						/>
					))}
				</div>
			</div>

			<div>
				<button type="button" onClick={() => onBack(2)}>
					← Back
				</button>
				<button type="button" onClick={() => onNext(4)}>
					Next: The Broken Link →
				</button>
			</div>
		</div>
	);
}
