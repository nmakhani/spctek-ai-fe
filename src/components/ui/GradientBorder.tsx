export const GradientBorder = ({
	thickness = 1,
	radius = '1rem',
	subtle = false,
	hasError = false,
}: {
	thickness?: number;
	radius?: string;
	subtle?: boolean;
	hasError?: boolean;
}) => {
	const defaultGradient = hasError
		? 'linear-gradient(135deg, rgba(248,113,113,0.85) 0%, #a0a6fc 50%, rgba(248,113,113,0.85) 100%)'
		: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, #a0a6fc 50%, rgba(255,255,255,0.75) 100%)';

	const subtleGradient = hasError
		? 'linear-gradient(135deg, rgba(248,113,113,0.85) 0%, rgba(255,255,255,0.25) 50%, rgba(248,113,113,0.85) 100%)'
		: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.75) 100%)';

	const gradient = subtle ? subtleGradient : defaultGradient;

	return (
		<div
			className="pointer-events-none absolute inset-0"
			style={{
				padding: thickness,
				borderRadius: radius,
				background: gradient,
				WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
				WebkitMaskComposite: 'destination-out',
				maskComposite: 'exclude',
			}}
		/>
	);
};
