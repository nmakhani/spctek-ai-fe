interface GlassGlowProps {
	angle?: number;
	opacity?: number;
	start?: number;
	end?: number;
	borderRadius?: number;
	classname?: string;
}

export const GlassGlow: React.FC<GlassGlowProps> = ({
	angle,
	opacity,
	start,
	end,
	borderRadius,
	classname = '',
}) => {
	const gradient = `linear-gradient(${angle}deg, 
    rgba(255, 255, 255, ${opacity}) 0%, 
    transparent ${start}%, 
    transparent ${end}%, 
    rgba(255, 255, 255, ${opacity}) 100%)`;

	return (
		<div
			className={`pointer-events-none absolute inset-0 rounded-[${borderRadius}px] ${classname}`}
			style={{ background: gradient }}
			aria-hidden="true"
		/>
	);
};
