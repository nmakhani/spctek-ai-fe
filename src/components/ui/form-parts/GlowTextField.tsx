'use client';

import { GlassGlow } from '../GlassGlow';
import { GradientBorder } from '../GradientBorder';

type GlowTextFieldProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: 'text' | 'email' | 'tel';
	multiline?: boolean;
	rows?: number;
};

const baseClass =
	'w-full bg-transparent px-5 py-4 text-sm text-white/90 outline-none transition-all placeholder:text-white/25 focus:ring-0';

export default function GlowTextField({
	value,
	onChange,
	placeholder,
	type = 'text',
	multiline = false,
	rows = 4,
}: GlowTextFieldProps) {
	return (
		<div className="relative z-10">
			<GradientBorder thickness={1} radius="16px" subtle={true} />
			<GlassGlow angle={105} opacity={0.5} start={5} end={95} radius="16px" />
			<div style={{ overflow: 'hidden', borderRadius: '15px' }}>
				{multiline ? (
					<textarea
						rows={rows}
						className={`${baseClass} resize-none`}
						value={value}
						onChange={(event) => onChange(event.target.value)}
						placeholder={placeholder}
					/>
				) : (
					<input
						type={type}
						className={baseClass}
						value={value}
						onChange={(event) => onChange(event.target.value)}
						placeholder={placeholder}
					/>
				)}
			</div>
		</div>
	);
}
