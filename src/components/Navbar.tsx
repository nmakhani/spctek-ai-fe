'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface GlassPillProps {
	href: string;
	children: React.ReactNode;
}

const GlassPill = ({ href, children }: GlassPillProps) => {
	return (
		<Link
			href={href}
			className="group relative isolate inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-2.5 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98]"
		>
			{/* Layer 1: frosted glass base */}
			<div
				className="border-white/18 bg-white/8 group-hover:bg-white/14 group-hover:border-white/32 absolute inset-0 rounded-full border backdrop-blur-xl transition-[background,border-color] duration-300"
				style={{
					WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
					backdropFilter: 'blur(16px) saturate(1.8)',
				}}
			/>

			{/* Layer 2: convex lens — thick glass illusion */}
			<div
				className="duration-400 absolute inset-0.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
				style={{
					background:
						'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)',
				}}
			/>

			{/* Layer 3: top edge specular highlight */}
			<div
				className="absolute left-[12%] right-[12%] top-0 h-[1.5px] rounded-full opacity-40 transition-all duration-300 group-hover:left-[6%] group-hover:right-[6%] group-hover:opacity-100"
				style={{
					background:
						'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, white 50%, rgba(255,255,255,0.9) 70%, transparent 100%)',
				}}
			/>

			{/* Layer 4: bottom inner shadow (glass thickness) */}
			<div
				className="absolute bottom-0 left-[10%] right-[10%] h-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background:
						'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
				}}
			/>

			{/* Layer 5: inset edge highlights */}
			<div
				className="duration-400 absolute inset-0 rounded-full transition-[box-shadow]"
				style={{
					boxShadow: 'inset 0 0 0 rgba(255,255,255,0)',
				}}
			/>

			{/* Layer 6: glint sweep animation */}
			<div className="absolute inset-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				<div
					className="glint-line group-hover:animate-glint absolute left-[-60%] top-[-60%] h-[200%] w-[60%]"
					style={{
						background:
							'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 60%, transparent 100%)',
					}}
				/>
			</div>

			{/* Layer 7: outer glow */}
			<div className="duration-400 absolute -inset-px rounded-full transition-[box-shadow] group-hover:[box-shadow:0_4px_20px_rgba(255,255,255,0.12),0_0_40px_rgba(180,150,255,0.15)]" />

			{/* Label */}
			<span className="relative z-10 text-sm font-medium tracking-wide text-white/90 transition-colors duration-200 group-hover:text-white">
				{children}
			</span>
		</Link>
	);
};

export default function Navbar() {
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
			setScrollProgress(scrollPercent);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navLinks = [
		{ name: 'Reinstatement', href: '/reinstatement' },
		{ name: 'Free Assessment', href: '/#contact' },
	];

	return (
		<header className="fixed left-0 right-0 top-0 z-50">
			<div
				className="border-white/12 relative flex h-20 items-center justify-between overflow-visible border-b bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_22%,rgba(15,17,36,0.72)_55%,rgba(6,8,18,0.82)_100%)] px-8"
				style={{
					backdropFilter: 'blur(22px) saturate(145%)',
					boxShadow:
						'0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.04)',
				}}
			>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22)_0%,transparent_32%),radial-gradient(circle_at_bottom_right,rgba(96,107,250,0.18)_0%,transparent_34%)]" />
				<div
					className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#7f89ff]"
					style={{
						width: `${scrollProgress}%`,
						transition: 'width 0.1s ease-out',
					}}
				/>

				<div className="relative z-10 flex h-full w-full items-center justify-between">
					{/* Logo Placeholder */}
					<Link href="/" className="flex items-center">
						<Image
							src="/logo-light.png"
							alt="SPCTEK AI Logo"
							width={120}
							height={40}
							className="object-contain"
							style={{ width: 'auto', height: 'auto' }}
							priority
						/>
					</Link>

					{/* Center/Right-aligned Menu */}
					<nav className="ml-auto mr-8 hidden items-center gap-2 md:flex">
						{navLinks.map((link) => (
							<GlassPill key={link.name} href={link.href}>
								{link.name}
							</GlassPill>
						))}
					</nav>
				</div>
			</div>
		</header>
	);
}
