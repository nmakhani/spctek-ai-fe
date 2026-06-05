import Image from 'next/image';
import Link from 'next/link';

import { FooterNewsletterForm } from './FooterNewsletterForm';

const footerSections = [
	{
		title: 'Company',
		links: [
			{ name: 'Home', href: '/' },
			{ name: 'About', href: '/about' },
			{ name: 'Contact', href: '/contact' },
		],
	},
	{
		title: 'Services',
		links: [
			{ name: 'Local AI Setup', href: '/local-ai-setup' },
			{ name: 'Business Process Audit', href: '/process-rating' },
			{ name: 'Automation Solutions', href: '/automation-workflows' },
		],
	},
	{
		title: 'Proofs & Resources',
		links: [
			{ name: 'Blog', href: '/blogs' },
			{ name: 'Case Studies', href: '/case-studies' },
			{ name: 'AI Playbooks', href: '/ai-playbook' },
		],
	},
	{
		title: 'Tools',
		links: [{ name: 'Amazon Reinstatement Estimator', href: '/reinstatement' }],
	},
];

export default function Footer() {
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
					<div className="flex flex-col items-start md:col-span-4">
						<Link href="/" className="mb-4 block">
							<Image
								src="/logo.png"
								alt="SPCTEK AI Logo"
								width={200}
								height={40}
								className="object-contain object-left"
							/>
						</Link>

						<p className="font-poppins max-w-md text-lg font-medium leading-tight text-white/90">
							Transformation through intelligent automation.
						</p>

						<p className="font-poppins mt-3 max-w-lg text-sm leading-relaxed text-white/50">
							We help operators eliminate repetitive work, standardize execution, and turn complex processes into
							reliable AI-assisted systems.
						</p>

						<Link
							href="/ai-playbook"
							className="font-poppins mt-6 inline-flex items-center justify-center rounded-[28px] border border-[#8d98ff]/55 bg-[#606bfa]/25 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(96,107,250,0.22)] transition hover:border-[#b5bdff] hover:bg-[#606bfa]/40"
						>
							Get Free AI Playbook
						</Link>
					</div>

					{/* Navigation Links */}
					<div className="grid gap-8 sm:grid-cols-2 md:col-span-5 lg:grid-cols-4">
						{footerSections.map((section) => (
							<div key={section.title}>
								<h3 className="font-poppins mb-4 text-sm font-semibold text-white">{section.title}</h3>
								<nav className="flex flex-col gap-3">
									{section.links.map((link) => (
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
						))}
					</div>

					{/* Newsletter */}
					<div className="md:col-span-3">
						<h3 className="font-poppins mb-2 text-sm font-semibold text-white">Weekly Newsletter</h3>
						<p className="font-poppins mb-4 text-sm text-white/60">Get practical AI updates and growth insights.</p>
						<FooterNewsletterForm />
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
