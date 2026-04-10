'use client';

import Link from 'next/link';
import Image from 'next/image';

import { GlassPill } from './ui/GlassPill';

import { useEffect, useState } from 'react';

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
		{ name: 'About', href: '/about' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Reinstatement', href: '/reinstatement' },
		{ name: 'Rate my Process', href: '/process-rating' },
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
					<nav className="ml-auto hidden items-center gap-2 md:flex">
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
