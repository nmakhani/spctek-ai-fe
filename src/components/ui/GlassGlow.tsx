interface GlassGlowProps {
	angle?: number;
	opacity?: number;
	start?: number;
	end?: number;
	radius?: string;
	focus?: boolean;
	classname?: string;
}

export const GlassGlow: React.FC<GlassGlowProps> = ({
	angle,
	opacity,
	start,
	end,
	radius,
	focus = false,
	classname = '',
}) => {
	const color = focus ? `96, 107, 250` : `255, 255, 255`;
	const background = focus ? 'black' : 'transparent';

	const gradient = `linear-gradient(${angle}deg, 
    rgba(${color}, ${opacity}) 0%, 
    ${background} ${start}%, 
    ${background} ${end}%, 
    rgba(${color}, ${opacity}) 100%)`;

	return (
		<div
			className={`pointer-events-none absolute inset-0 ${classname}`}
			style={{ background: gradient, borderRadius: radius }}
			aria-hidden="true"
		/>
	);
};
