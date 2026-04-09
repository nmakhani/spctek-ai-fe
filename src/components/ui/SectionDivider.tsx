export const SectionDivider = () => {
	return (
		<div className="relative my-16 h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent">
			{/* The Flare Core */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,transparent_100%)] opacity-90 blur-[2px]" />

			{/* The Sharp Center Highlight */}
			<div className="absolute inset-x-1/2 top-0 h-[1px] w-1/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent" />
		</div>
	);
};
