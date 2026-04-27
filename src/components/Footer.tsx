'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { contactsApi } from '@/lib/api';

export default function Footer() {
	const footerLinks = [
		{ name: 'About', href: '/about' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Reinstatement', href: '/reinstatement' },
		{ name: 'Set Up Local AI', href: '/local-ai-setup' },
		{ name: 'Rate my Process', href: '/process-rating' },
	];

	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	const validateEmail = (value: string) => {
		return String(value)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const handleSubscribe = async () => {
		setIsError(false);

		if (!email) {
			toast.error('Email is required');
			setIsError(true);
			return;
		}

		if (!validateEmail(email)) {
			toast.error('Please enter a valid email address');
			setIsError(true);
			return;
		}

		try {
			setIsLoading(true);
			await contactsApi.create({
				email,
				source: 'footer-newsletter-subscription',
			});
			toast.success('Subscribed successfully. Welcome aboard.');
			setEmail('');
		} catch {
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const currentYear = new Date().getFullYear();

	return (
		<footer
			className="border-white/12 relative mt-48 border-t bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_22%,rgba(15,17,36,0.52)_55%,rgba(6,8,18,0.62)_100%)]"
			style={{
				backdropFilter: 'blur(22px) saturate(145%)',
				boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
			}}
		>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(96,107,250,0.12)_0%,transparent_40%)]" />

			<div className="relative z-10 mx-auto max-w-7xl px-8 py-8">
				<div className="mb-6 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
					{/* Brand */}
					<div className="flex flex-col items-start md:col-span-5">
						<Link href="/" className="mb-4 block">
							<Image
								src="/logo.png"
								alt="SPCTEK AI Logo"
								width={200}
								height={40}
								className="object-contain object-left"
								priority
							/>
						</Link>

						<p className="font-poppins max-w-md text-lg font-medium leading-tight text-white/90">
							Transformation through intelligent automation.
						</p>

						<p className="font-poppins mt-3 max-w-lg text-sm leading-relaxed text-white/50">
							We help operators eliminate repetitive work, standardize execution, and turn complex processes into
							reliable AI-assisted systems.
						</p>

						<div className="mt-6 flex flex-wrap gap-2">
							<span className="font-poppins rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
								Automation-first
							</span>
							<span className="font-poppins rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
								Operator-centric
							</span>
							<span className="font-poppins rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
								Execution-ready
							</span>
						</div>
					</div>

					{/* Navigation Links */}
					<div className="md:col-span-2">
						<h3 className="font-poppins mb-4 text-sm font-semibold text-white">Explore</h3>
						<nav className="flex flex-col gap-3">
							{footerLinks.map((link) => (
								<Link
									key={link.name}
									href={link.href}
									className="font-poppins text-sm font-light text-white/70 transition-colors hover:text-white"
								>
									{link.name}
								</Link>
							))}
						</nav>
					</div>

					{/* Middle Column */}
					<div className="md:col-span-2">
						<h3 className="font-poppins mb-4 text-sm font-semibold text-white">What You Get</h3>
						<ul className="font-poppins flex flex-col gap-3 text-sm text-white/65">
							<li>Actionable AI implementation ideas</li>
							<li>Practical process optimization playbooks</li>
							<li>Simple roadmaps for operator adoption</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div className="md:col-span-3">
						<h3 className="font-poppins mb-2 text-sm font-semibold text-white">Weekly Newsletter</h3>
						<p className="font-poppins mb-4 text-sm text-white/60">Get practical AI updates and growth insights.</p>
						<div className="flex flex-col gap-3">
							<input
								type="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									if (isError) setIsError(false);
								}}
								placeholder="your@email.com"
								className={`font-poppins rounded-xl border bg-white/10 px-4 py-2.5 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-white/40 ${isError ? 'border-red-400/70' : 'border-white/15'}`}
							/>
							<button
								type="button"
								onClick={handleSubscribe}
								disabled={isLoading}
								className="font-poppins inline-flex w-fit items-center justify-center rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(124,134,255,0.98)_0%,rgba(96,107,250,0.98)_100%)] px-6 py-[10px] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(96,107,250,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(96,107,250,0.36),inset_0_1px_0_rgba(255,255,255,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
							>
								{isLoading ? 'Subscribing...' : 'Subscribe'}
							</button>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className="border-t border-white/10 pt-4">
					<p className="font-poppins text-center text-sm text-white/40">
						© {currentYear} SPCTEK AI. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
