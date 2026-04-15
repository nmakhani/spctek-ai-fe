interface GradientNumberProps {
	id: string | number;
	width?: string;
	height?: string;
	rotation?: number;
	borderRadius?: string;
	className?: string;
}

export function GradientNumber({ id, width, height, rotation, borderRadius, className = '' }: GradientNumberProps) {
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

			{/* ID Text */}
			<span className="relative z-10 text-4xl font-bold text-white md:text-6xl">{id}</span>
		</div>
	);
}
