import React from "react";
import Link from "next/link";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  width?: number;
  href?: string;
}

export const PrimaryButton = ({
  children,
  onClick,
  width,
  href,
  ...props
}: PrimaryButtonProps) => {
  const buttonClass = `
    mt-12 h-[60px] 
    inline-flex items-center justify-center 
    transition-all duration-300 ease-in-out 
    rounded-[24px] bg-[#606bfa] text-base font-semibold text-white 
    hover:bg-[#6f79ff] hover:shadow-[0_0_24px_rgba(96,107,250,0.55)] 
    active:scale-[0.99]
  `
    .replace(/\s+/g, " ")
    .trim();

  const dynamicStyle = { width: `${width || 360}px` };

  if (href) {
    return (
      <Link href={href} className={buttonClass} style={dynamicStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      {...props}
      className={buttonClass}
      style={dynamicStyle}
    >
      {children}
    </button>
  );
};
