import { CSSProperties } from 'react';

export const GlowBackground = ({ style }: { style: CSSProperties }) => {
	return (
		<div
			className="pointer-events-none absolute left-0 -z-10 hidden w-full overflow-hidden lg:block"
			style={{ ...style, maxWidth: '100vw' }}
			aria-hidden="true"
		/>
	);
};
