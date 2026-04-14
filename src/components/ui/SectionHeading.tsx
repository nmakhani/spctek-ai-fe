import React from 'react';

type SectionHeadingSize = 'hero' | 'large';
type SectionHeadingAlign = 'left' | 'center' | 'right';

interface SectionHeadingProps {
	size: SectionHeadingSize;
	align?: SectionHeadingAlign;
	children: React.ReactNode;
}

const sizeClasses: Record<SectionHeadingSize, string> = {
	hero: 'text-3xl leading-tight md:text-5xl lg:text-7xl',
	large: 'text-[1.9rem] leading-tight md:text-[2.6rem] lg:text-[3.5rem]',
};

const alignClasses: Record<SectionHeadingAlign, string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
};

export const SectionHeading = ({ size, align = 'center', children }: SectionHeadingProps) => {
	return <h1 className={`font-heading text-white ${sizeClasses[size]} ${alignClasses[align]}`}>{children}</h1>;
};
