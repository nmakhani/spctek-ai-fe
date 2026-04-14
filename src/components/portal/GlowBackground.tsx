'use client';

export function GlowBackground() {
	return (
		<div
			className="bg-[#606bfa]/18 pointer-events-none fixed left-1/2 top-1/2 h-[40rem] w-[40rem] rounded-full blur-[140px]"
			style={{ transform: 'translate(-50%, -50%)' }}
		/>
	);
}
