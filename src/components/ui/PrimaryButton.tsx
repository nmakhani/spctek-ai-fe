import React from 'react';
import Link from 'next/link';

interface ButtonConfig {
	width?: string;
	bgColor?: string;
	hoverColor?: string;
	textColor?: string;
	marginTop?: string;
}

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	href?: string;
	config?: ButtonConfig;
}

export const PrimaryButton = ({ children, href, config = {}, ...props }: PrimaryButtonProps) => {
	const defaults: ButtonConfig = {
		width: '100%',
		bgColor: '#606bfa',
		hoverColor: '#6f79ff',
		textColor: '#ffffff',
		marginTop: '3rem',
	};

	const finalConfig = { ...defaults, ...config };

	const baseClasses = `
    transition-all duration-300 ease-in-out 
	h-[54px] w-full max-w-[360px] inline-flex items-center justify-center 
	rounded-[20px] text-sm font-semibold md:h-[58px] md:text-base lg:h-[60px] lg:rounded-[24px] 
    active:scale-[0.99] px-8
    [width:var(--w)]
    [color:var(--txt)]
    [margin-top:var(--mt)]
    [background-color:var(--bg)]
    hover:[background-color:var(--hbg)]
    hover:shadow-[0_0_24px_rgba(96,107,250,0.55)] 
  `
		.replace(/\s+/g, ' ')
		.trim();

	const dynamicStyles = {
		'--w': finalConfig.width,
		'--bg': finalConfig.bgColor,
		'--hbg': finalConfig.hoverColor,
		'--txt': finalConfig.textColor,
		'--mt': finalConfig.marginTop,
	} as React.CSSProperties;

	if (href) {
		return (
			<Link href={href} className={baseClasses} style={dynamicStyles}>
				{children}
			</Link>
		);
	}

	return (
		<button {...props} className={baseClasses} style={dynamicStyles}>
			{children}
		</button>
	);
};
