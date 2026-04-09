export const LeftTextSection = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="my-8 max-w-[1000px] text-left">
			<p className="text-gray-300 text-lg font-light leading-relaxed md:text-3xl">{children}</p>
		</div>
	);
};
