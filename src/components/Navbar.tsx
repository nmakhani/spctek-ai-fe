'use client';

import Link from 'next/link';
import Image from 'next/image';

import { GlassPill } from './ui/GlassPill';

import { useEffect, useState } from 'react';

export default function Navbar() {
	const [scrollProgress, setScrollProgress] = useState(0);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
		{ name: 'About', href: '/about' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Amazon Recovery', href: '/reinstatement' },
		{ name: 'Set Up Local AI', href: '/local-ai-setup' },
		{ name: 'Rate my Process', href: '/process-rating' },
	];

	return (
		<header className="fixed left-0 right-0 top-0 z-50">
			<div
				className="border-white/12 relative flex min-h-16 items-center justify-between overflow-visible border-b bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_22%,rgba(15,17,36,0.72)_55%,rgba(6,8,18,0.82)_100%)] px-4 md:px-6 lg:h-20 lg:px-8"
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

				<div className="relative z-10 flex h-full w-full min-w-0 items-center justify-between py-3 lg:py-0">
					{/* Logo Placeholder */}
					<Link href="/" className="flex shrink-0 items-center">
						<Image
							src="/logo-light.png"
							alt="SPCTEK AI Logo"
							width={130}
							height={44}
							className="h-8 w-auto max-w-[185px] object-contain md:h-9 md:max-w-[210px] lg:max-w-[220px]"
							priority
						/>
					</Link>

					<button
						type="button"
						onClick={() => setMobileMenuOpen((prev) => !prev)}
						aria-label="Toggle navigation menu"
						aria-expanded={mobileMenuOpen}
						className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
					>
						<span className="sr-only">Toggle navigation menu</span>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
							{mobileMenuOpen ? (
								<path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
							) : (
								<path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
							)}
						</svg>
					</button>

					{/* Center/Right-aligned Menu */}
					<nav className="ml-auto hidden items-center gap-2 lg:flex">
						{navLinks.map((link) => (
							<GlassPill key={link.name} href={link.href}>
								{link.name}
							</GlassPill>
						))}
					</nav>
				</div>

				<div
					className={`absolute inset-x-0 top-full border-b border-white/15 bg-[#0b1024]/95 px-4 pb-4 pt-3 backdrop-blur-lg transition-all duration-300 lg:hidden ${
						mobileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
					}`}
				>
					<nav className="flex flex-col gap-2">
						{navLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								onClick={() => setMobileMenuOpen(false)}
								className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
							>
								{link.name}
							</Link>
						))}
					</nav>
				</div>
			</div>
		</header>
	);
}
