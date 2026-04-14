import { CSSProperties } from 'react';

export const GlowBackground = ({ style }: { style: CSSProperties }) => {
	return <div className={`pointer-events-none absolute -z-10 overflow-hidden`} aria-hidden="true" style={style} />;
};
