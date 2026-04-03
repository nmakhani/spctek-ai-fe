import React from "react";
import Link from "next/link";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
  href?: string;
}

export function PrimaryButton({
  children,
  className = "",
  fullWidth = false,
  onClick,
  href,
  ...props
}: PrimaryButtonProps) {
  const buttonClass = `inline-flex items-center justify-center rounded-[28px] bg-[#606bfa] px-10 py-5 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-[#6f79ff] hover:shadow-[0_0_24px_rgba(96,107,250,0.55)] active:scale-[0.99] ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} {...props} className={buttonClass}>
      {children}
    </button>
  );
}
