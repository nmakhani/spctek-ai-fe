import React from 'react';

type SectionHeadingSize = 'hero' | 'large';
type SectionHeadingAlign = 'left' | 'center' | 'right';

interface SectionHeadingProps {
	size: SectionHeadingSize;
	align?: SectionHeadingAlign;
	children: React.ReactNode;
}

const sizeClasses: Record<SectionHeadingSize, string> = {
	hero: 'text-5xl md:text-7xl leading-tight',
	large: 'text-[2.5rem] md:text-[3.5rem] leading-tight',
};

const alignClasses: Record<SectionHeadingAlign, string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
};

export const SectionHeading = ({ size, align = 'center', children }: SectionHeadingProps) => {
	return (
		<h1 className={`font-heading text-white ${sizeClasses[size]} ${alignClasses[align]}`}>
			{children}
		</h1>
	);
};
