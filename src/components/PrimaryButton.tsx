import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function PrimaryButton({
  children,
  className = "",
  onClick,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#606bfa] text-white font-semibold rounded-full px-8 py-4 transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(96,107,250,0.6)] hover:bg-[#606bfa]/90 ${className}`}
    >
      {children}
    </button>
  );
}
