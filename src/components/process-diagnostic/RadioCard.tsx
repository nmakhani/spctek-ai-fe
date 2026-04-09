'use client';

import type { FormData } from './types';

type RadioCardProps = {
	name: keyof FormData;
	value: string;
	current: string;
	label: string;
	desc?: string;
	onChange: (name: keyof FormData, value: string) => void;
};

export default function RadioCard({ name, value, current, label, desc, onChange }: RadioCardProps) {
	const selected = current === value;

	return (
		<button type="button" onClick={() => onChange(name, value)} aria-pressed={selected}>
			<div>
				<div>{selected ? 'Selected' : 'Not selected'}</div>
				<div>
					<p>{label}</p>
					{desc ? <p>{desc}</p> : null}
				</div>
			</div>
		</button>
	);
}
