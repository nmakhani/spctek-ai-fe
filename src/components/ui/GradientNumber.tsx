interface GradientNumberProps {
	value: string | number;
	subValue?: string;
	width?: string;
	height?: string;
	rotation?: number;
	borderRadius?: string;
	enlarge?: boolean;
	className?: string;
	valueClassName?: string;
}

export function GradientNumber({
	value,
	subValue,
	width,
	height,
	rotation,
	borderRadius,
	enlarge = false,
	className = '',
	valueClassName,
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
						valueClassName ||
						`font-bold text-white ${
							enlarge
								? 'text-5xl sm:text-6xl md:text-9xl'
								: hasSubValue
									? 'text-3xl md:text-4xl'
									: 'text-3xl sm:text-4xl md:text-6xl'
						}`
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
