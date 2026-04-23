interface GradientNumberProps {
	value: string | number;
	subValue?: string;
	width?: string;
	height?: string;
	rotation?: number;
	borderRadius?: string;
	className?: string;
}

export function GradientNumber({
	value,
	subValue,
	width,
	height,
	rotation,
	borderRadius,
	className = '',
}: GradientNumberProps) {
	const hasSubValue = Boolean(subValue?.trim());

	return (
		<div
			className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-white ${className}`}
			style={{
				width,
				height,
				borderRadius,
			}}
		>
			<div
				className="absolute inset-0 -z-10"
				style={{
					background: `linear-gradient(${rotation}deg, #131532 0%, #606bfa 40%, #606bfa 60%, #131532 100%)`,
					filter: 'blur(8px)',
				}}
			/>

			<div className="relative z-10 flex flex-col items-center justify-center px-2 text-center">
				<span
					className={
						hasSubValue ? 'text-3xl font-bold text-white md:text-4xl' : 'text-4xl font-bold text-white md:text-6xl'
					}
				>
					{value}
				</span>
				{hasSubValue && (
					<span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/75">{subValue}</span>
				)}
			</div>
		</div>
	);
}
