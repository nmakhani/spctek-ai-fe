import Link from 'next/link';

interface GlassPillProps {
	href: string;
	children: React.ReactNode;
	highlight?: boolean;
}

export const GlassPill = ({ href, children, highlight = false }: GlassPillProps) => {
	return (
		<Link
			href={href}
			className={`group relative isolate inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-2.5 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98] ${
				highlight ? 'glass-pill-highlight' : ''
			}`}
		>
			{highlight && (
				<div className="glass-pill-animated-border pointer-events-none absolute -inset-[1.5px] rounded-full" />
			)}

			{/* Layer 1: frosted glass base */}
			<div
				className={`absolute inset-0 rounded-full backdrop-blur-xl transition-[background,border] duration-300 ${
					highlight
						? 'bg-white/8 group-hover:bg-white/14 border border-transparent'
						: 'bg-white/8 group-hover:bg-white/14 border border-white/80 group-hover:border-white'
				}`}
				style={{
					WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
					backdropFilter: 'blur(16px) saturate(1.8)',
				}}
			/>

			{/* Layer 2: convex lens */}
			<div
				className="absolute inset-0.5 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background:
						'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)',
				}}
			/>

			{/* Layer 4: bottom inner shadow */}
			<div
				className="absolute bottom-0 left-[10%] right-[10%] h-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
				}}
			/>

			{/* Layer 6: glint sweep */}
			<div className="absolute inset-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				<div
					className="glint-line absolute left-[-60%] top-[-60%] h-[200%] w-[60%] group-hover:animate-glint"
					style={{
						background:
							'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 60%, transparent 100%)',
					}}
				/>
			</div>

			{/* Layer 7: outer glow */}
			<div className="absolute -inset-px rounded-full transition-[box-shadow] duration-300 group-hover:[box-shadow:0_4px_20px_rgba(255,255,255,0.12),0_0_40px_rgba(180,150,255,0.15)]" />

			{highlight && (
				<div className="glass-pill-highlight-aura pointer-events-none absolute -inset-[5px] rounded-full" />
			)}

			<span
				className={`relative z-10 text-sm tracking-wide transition-colors duration-200 group-hover:text-white ${
					highlight ? 'glass-pill-highlight-text font-bold text-white' : 'font-medium text-white/90'
				}`}
			>
				{children}
			</span>
		</Link>
	);
};
