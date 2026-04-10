'use client';

import { GlassGlow } from '../GlassGlow';
import { GradientBorder } from '../GradientBorder';

type RadioCardProps = {
	name: string;
	value: string;
	current: string;
	label: string;
	desc?: string;
	onChange: (name: string, value: string) => void;
};

export const RadioCard = ({ name, value, current, label, desc, onChange }: RadioCardProps) => {
	const selected = current === value;

	return (
		<div className="relative z-10 w-full">
			<GradientBorder thickness={1} radius="16px" subtle={!selected} />
			<GlassGlow angle={105} opacity={0.5} start={12} end={88} radius="16px" focus={selected} />
			<div style={{ overflow: 'hidden', borderRadius: '15px' }}>
				<button
					type="button"
					onClick={() => onChange(name, value)}
					aria-pressed={selected}
					className={`relative w-full rounded-2xl bg-transparent p-5 text-left transition-all duration-300 ease-out ${
						selected ? 'bg-indigo-500/10 shadow-[#6366f1]/20' : 'hover:bg-white/[0.07]'
					} `}
				>
					<div className="relative z-10 flex flex-col gap-1">
						{selected && (
							<div className="bg-indigo-500/20 pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-md" />
						)}
						<p className={`text-[15px] font-medium ${selected ? 'text-white' : 'text-gray-200'}`}>
							{label}
						</p>
						{desc ? (
							<p className={`text-sm ${selected ? 'text-indigo-200' : 'text-gray-400'}`}>{desc}</p>
						) : null}
					</div>
					<span className="sr-only">{selected ? 'Selected' : 'Not selected'}</span>
				</button>
			</div>
		</div>
	);
};
