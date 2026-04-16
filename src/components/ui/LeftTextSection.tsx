export const LeftTextSection = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="my-6 w-full max-w-[1000px] text-left md:my-8">
			<p className="text-gray-300 text-base font-light leading-relaxed sm:text-lg md:text-xl lg:text-2xl">{children}</p>
		</div>
	);
};
