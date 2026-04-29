'use client';

import { GlassGlow } from '../GlassGlow';
import { GradientBorder } from '../GradientBorder';

interface FormContainerProps {
	children: React.ReactNode;
	className?: string;
}

export default function FormContainer({ children, className = '' }: FormContainerProps) {
	return (
		<div className={`relative z-10 mx-auto w-full max-w-3xl ${className}`}>
			<GradientBorder thickness={2} radius="40px" />
			<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="40px" />
			<div
				className="relative p-5 shadow-2xl sm:p-6 md:p-10"
				style={{ borderRadius: '38px', background: 'transparent' }}
			>
				{children}
			</div>
		</div>
	);
}
