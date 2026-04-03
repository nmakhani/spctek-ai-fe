import { CSSProperties } from "react";

export const GlowBackground = ({ style }: { style: CSSProperties }) => {
  return (
    <div
      className={`absolute pointer-events-none -z-10 overflow-hidden`}
      aria-hidden="true"
      style={style}
    />
  );
};
