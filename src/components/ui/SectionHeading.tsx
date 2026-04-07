import React from "react";

type SectionHeadingSize = "hero" | "large";

interface SectionHeadingProps {
  size: SectionHeadingSize;
  children: React.ReactNode;
}

const sizeClasses: Record<SectionHeadingSize, string> = {
  hero: "text-5xl md:text-7xl leading-tight",
  large: "text-[2.5rem] md:text-[3.5rem] leading-tight",
};

export const SectionHeading = ({ size, children }: SectionHeadingProps) => {
  return (
    <h1 className={`font-heading text-white text-center ${sizeClasses[size]}`}>
      {children}
    </h1>
  );
};
