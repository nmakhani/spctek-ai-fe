import React from 'react';

type SectionHeadingSize = 'hero' | 'large';

interface SectionHeadingProps {
	size: SectionHeadingSize;
	children: React.ReactNode;
}

const sizeClasses: Record<SectionHeadingSize, string> = {
	hero: 'text-5xl md:text-7xl leading-tight',
	large: 'text-[2.5rem] md:text-[3.5rem] leading-tight',
};

export const SectionHeading = ({ size, children }: SectionHeadingProps) => {
	return <h1 className={`text-center font-heading text-white ${sizeClasses[size]}`}>{children}</h1>;
};
