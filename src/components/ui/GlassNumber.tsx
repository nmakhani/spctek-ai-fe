import { GlassGlow } from './GlassGlow';

interface GlassNumberProps {
	number: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassNumber = ({ number, size = 'sm' }: GlassNumberProps) => {
	const sizeClasses = {
		sm: 'h-8 w-8 text-lg',
		md: 'h-12 w-12 text-2xl',
		lg: 'h-16 w-16 text-3xl',
		xl: 'h-20 w-20 text-4xl',
	};

	return (
		<div className={`relative flex shrink-0 items-center justify-center ${sizeClasses[size]}`}>
			<div
				className="absolute inset-0 rounded-lg p-[1px]"
				style={{
					background:
						'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.8) 100%)',
				}}
			>
				{/* The inner background */}
				<div className="h-full w-full rounded-[7px] bg-[#121212]" />
			</div>

			{/* Inner glass overlay */}
			<div
				className="pointer-events-none absolute inset-[1px] overflow-hidden rounded-[7px]"
				style={{
					background:
						'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
				}}
			/>

			<GlassGlow angle={135} opacity={0.8} start={35} end={85} radius="7px" />

			<span className="relative z-10 font-bold tracking-tighter text-[#606bfa]">{number}</span>
		</div>
	);
};
