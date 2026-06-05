'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type NavItem = {
	name: string;
	href?: string;
	children?: {
		name: string;
		href: string;
	}[];
};

const navItems: NavItem[] = [
	{
		name: 'Services',
		children: [
			{ name: 'Local AI Setup', href: '/local-ai-setup' },
			{ name: 'Business Process Audit', href: '/process-rating' },
		],
	},
	{ name: 'AI Automation Solutions', href: '/automation-workflows' },
	{
		name: 'Proofs & Resources',
		children: [
			{ name: 'Blog', href: '/blogs' },
			{ name: 'Case Studies', href: '/case-studies' },
			{ name: 'AI Playbooks', href: '/ai-playbook' },
		],
	},
	{
		name: 'Tools',
		children: [{ name: 'Amazon Reinstatement Estimator', href: '/reinstatement' }],
	},
	{ name: 'Contact', href: '/contact' },
];

export default function Navbar() {
	const progressRef = useRef<HTMLDivElement | null>(null);
	const frameRef = useRef<number | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const updateProgress = () => {
			frameRef.current = null;
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
			if (progressRef.current) {
				progressRef.current.style.transform = `scaleX(${scrollPercent / 100})`;
			}
		};

		const handleScroll = () => {
			if (frameRef.current === null) {
				frameRef.current = window.requestAnimationFrame(updateProgress);
			}
		};

		updateProgress();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
			if (frameRef.current !== null) {
				window.cancelAnimationFrame(frameRef.current);
			}
		};
	}, []);

	return (
		<header className="fixed left-0 right-0 top-0 z-50">
			<div
				className="border-white/12 relative flex min-h-16 items-center justify-between overflow-visible border-b bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_22%,rgba(15,17,36,0.72)_55%,rgba(6,8,18,0.82)_100%)] px-3 md:px-6 lg:h-20"
				style={{
					backdropFilter: 'blur(22px) saturate(145%)',
					boxShadow:
						'0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.04)',
				}}
			>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22)_0%,transparent_32%),radial-gradient(circle_at_bottom_right,rgba(96,107,250,0.18)_0%,transparent_34%)]" />
				<div
					ref={progressRef}
					className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#7f89ff]"
					style={{
						transform: 'scaleX(0)',
						transformOrigin: 'left center',
						transition: 'transform 0.1s ease-out',
					}}
				/>

				<div className="relative z-10 grid h-full w-full min-w-0 grid-cols-[auto_auto] items-center justify-between gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
					<Link href="/" className="flex shrink-0 items-center">
						<Image
							src="/logo.png"
							alt="SPCTEK AI Logo"
							width={500}
							height={100}
							className="h-10 w-auto max-w-[160px] object-contain md:h-12 md:max-w-[180px] lg:h-14 lg:max-w-[200px]"
							priority
						/>
					</Link>

					<nav className="hidden items-center justify-center gap-1 lg:flex xl:gap-2">
						{navItems.map((item) => (
							<DesktopNavItem key={item.name} item={item} />
						))}
					</nav>

					<Link
						href="/ai-playbook#playbook-form"
						className="nav-playbook-cta hidden shrink-0 px-4 py-2.5 text-sm font-semibold text-white lg:inline-flex xl:px-5"
					>
						<span>Get Free AI Playbook</span>
					</Link>

					<button
						type="button"
						onClick={() => setMobileMenuOpen((prev) => !prev)}
						aria-label="Toggle navigation menu"
						aria-expanded={mobileMenuOpen}
						className="mr-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
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
				</div>

				<div
					className={`custom-scrollbar absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-white/15 bg-[#0b1024]/95 px-4 pb-4 pt-3 backdrop-blur-lg transition-all duration-300 lg:hidden ${
						mobileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
					}`}
				>
					<nav className="flex flex-col gap-2">
						{navItems.map((item) => (
							<MobileNavItem key={item.name} item={item} onNavigate={() => setMobileMenuOpen(false)} />
						))}
						<Link
							href="/ai-playbook"
							onClick={() => setMobileMenuOpen(false)}
							className="nav-playbook-cta mt-2 justify-center px-4 py-3 text-sm font-semibold text-white"
						>
							<span>Get Free AI Playbook</span>
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
}

function DesktopNavItem({ item }: { item: NavItem }) {
	if (!item.children?.length && item.href) {
		return (
			<Link
				href={item.href}
				className="text-white/82 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.12] hover:text-white xl:px-4"
			>
				{item.name}
			</Link>
		);
	}

	return (
		<div className="group relative">
			<button
				type="button"
				className="text-white/82 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.12] hover:text-white xl:px-4"
			>
				{item.name}
				<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
					<path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
			<div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
				<div className="rounded-2xl border border-white/15 bg-[#0b1024]/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.48)] backdrop-blur-xl">
					{item.children?.map((child) => (
						<Link
							key={child.name}
							href={child.href}
							className="text-white/78 block rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-white/[0.08] hover:text-white"
						>
							{child.name}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
	if (!item.children?.length && item.href) {
		return (
			<Link
				href={item.href}
				onClick={onNavigate}
				className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
			>
				{item.name}
			</Link>
		);
	}

	return (
		<div className="rounded-lg border border-white/10 bg-white/5 p-2">
			<p className="px-2 pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{item.name}</p>
			<div className="flex flex-col gap-1">
				{item.children?.map((child) => (
					<Link
						key={child.name}
						href={child.href}
						onClick={onNavigate}
						className="text-white/82 rounded-lg px-2 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-white"
					>
						{child.name}
					</Link>
				))}
			</div>
		</div>
	);
}
