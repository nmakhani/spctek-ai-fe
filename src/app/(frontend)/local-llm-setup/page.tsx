'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────

type UseCase = {
	id: string;
	label: string;
	icon: React.ReactNode;
	desc: string;
};

type HardwareTier = 'starter' | 'professional' | 'enterprise';

type FormData = {
	useCases: string[];
	teamSize: string;
	dataSensitivity: string;
	hardwareTier: HardwareTier;
	currentStack: string;
	name: string;
	email: string;
	phone: string;
	company: string;
};

const INITIAL: FormData = {
	useCases: [],
	teamSize: '1-5',
	dataSensitivity: 'high',
	hardwareTier: 'professional',
	currentStack: '',
	name: '',
	email: '',
	phone: '',
	company: '',
};

// ─── Data ────────────────────────────────────────────────────────────────────

const USE_CASES: UseCase[] = [
	{
		id: 'docs',
		label: 'Document Processing',
		icon: (
			<svg
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
				/>
			</svg>
		),
		desc: 'Invoices, contracts, reports — parsed and understood locally',
	},
	{
		id: 'customer',
		label: 'Customer Support AI',
		icon: (
			<svg
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
				/>
			</svg>
		),
		desc: 'AI chat agents that run on your infrastructure',
	},
	{
		id: 'code',
		label: 'Code Assistant',
		icon: (
			<svg
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
				/>
			</svg>
		),
		desc: 'Private Copilot-style code completion and review',
	},
	{
		id: 'data',
		label: 'Data Analysis',
		icon: (
			<svg
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
				/>
			</svg>
		),
		desc: 'Query databases and visualize insights with natural language',
	},
	{
		id: 'content',
		label: 'Content Generation',
		icon: (
			<svg
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
				/>
			</svg>
		),
		desc: 'Product listings, emails, SOPs — generated privately',
	},
	{
		id: 'workflow',
		label: 'Workflow Automation',
		icon: (
			<svg
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
				/>
				<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		),
		desc: 'AI-powered task routing and decision automation',
	},
];

const HARDWARE_TIERS: {
	id: HardwareTier;
	label: string;
	specs: string;
	models: string;
	price: string;
	recommended?: boolean;
}[] = [
	{
		id: 'starter',
		label: 'Starter',
		specs: '16GB RAM · Consumer GPU (8GB+)',
		models: '7B-13B parameter models',
		price: 'Minimal hardware cost',
	},
	{
		id: 'professional',
		label: 'Professional',
		specs: '32-64GB RAM · RTX 4090 / A4000',
		models: '13B-70B parameter models',
		price: 'Best performance / cost ratio',
		recommended: true,
	},
	{
		id: 'enterprise',
		label: 'Enterprise',
		specs: '128GB+ RAM · Multi-GPU / A100',
		models: '70B+ parameter models',
		price: 'Maximum capability',
	},
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LocalLLMSetupPage() {
	const [form, setForm] = useState<FormData>(INITIAL);
	const [phase, setPhase] = useState<'info' | 'configure' | 'contact' | 'submitted'>('info');
	const [submitting, setSubmitting] = useState(false);

	const toggleUseCase = (id: string) => {
		setForm((prev) => ({
			...prev,
			useCases: prev.useCases.includes(id)
				? prev.useCases.filter((c) => c !== id)
				: [...prev.useCases, id],
		}));
	};

	const handleSubmit = async () => {
		if (!form.name || !form.email) return;
		setSubmitting(true);

		try {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/contacts/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: form.name,
					email: form.email,
					phone: form.phone || null,
					company: form.company || null,
					message: `Local LLM Setup Inquiry — Use Cases: ${form.useCases.join(', ')} | Team Size: ${form.teamSize} | Data Sensitivity: ${form.dataSensitivity} | Hardware Tier: ${form.hardwareTier} | Current Stack: ${form.currentStack || 'N/A'}`,
					source: 'local_llm_setup',
				}),
			});
		} catch {
			// Non-blocking
		}

		await new Promise((r) => setTimeout(r, 800));
		setPhase('submitted');
		setSubmitting(false);
	};

	return (
		<div className="noise-overlay relative min-h-screen">
			<main className="px-4 pb-20 pt-24 sm:px-6">
				{/* ─── Interactive Configurator ──────────────────────────────── */}
				<section id="configurator" className="mx-auto mb-24 max-w-3xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="glass-card-elevated p-8 md:p-10"
					>
						<AnimatePresence mode="wait">
							{/* ─── Phase: Configure ─── */}
							{(phase === 'info' || phase === 'configure') && (
								<motion.div
									key="configure"
									initial={{ opacity: 0, y: 18 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -18 }}
									transition={{ duration: 0.35 }}
								>
									{/* Step indicator */}
									<div className="mb-8">
										<div className="mb-2 flex items-center justify-between">
											<span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
												Configure Your Stack
											</span>
											<span className="text-cyan text-xs font-semibold">Step 1 of 2</span>
										</div>
										<div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
											<motion.div
												className="h-full rounded-full"
												style={{
													background: 'linear-gradient(90deg, #dc3bf5, #520e60)',
												}}
												initial={false}
												animate={{ width: '50%' }}
												transition={{ duration: 0.5, ease: 'easeInOut' }}
											/>
										</div>
									</div>

									{/* Use Cases */}
									<div className="mb-8">
										<h3 className="mb-1 text-base font-bold text-white">
											What will your AI handle?
										</h3>
										<p className="mb-4 text-xs text-slate-500">Select all that apply</p>
										<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
											{USE_CASES.map((uc) => {
												const selected = form.useCases.includes(uc.id);
												return (
													<button
														key={uc.id}
														type="button"
														onClick={() => toggleUseCase(uc.id)}
														className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
															selected
																? 'border-cyan bg-cyan/[0.08] shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.15)]'
																: 'hover:border-cyan/30 hover:bg-cyan/[0.04] border-white/[0.07] bg-white/[0.02]'
														}`}
													>
														<div className="flex items-start gap-3">
															<div
																className={`mt-0.5 flex-shrink-0 transition-colors ${selected ? 'text-cyan' : 'text-slate-500'}`}
															>
																{uc.icon}
															</div>
															<div>
																<p
																	className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-300'}`}
																>
																	{uc.label}
																</p>
																<p className="mt-0.5 text-xs text-slate-500">{uc.desc}</p>
															</div>
														</div>
													</button>
												);
											})}
										</div>
									</div>

									{/* Team Size */}
									<div className="mb-8">
										<label className="form-label">How many people will use the AI?</label>
										<div className="grid grid-cols-3 gap-3">
											{[
												{ v: '1-5', l: '1 - 5', d: 'Small team' },
												{ v: '6-20', l: '6 - 20', d: 'Growing' },
												{ v: '20+', l: '20+', d: 'Organization' },
											].map(({ v, l, d }) => {
												const selected = form.teamSize === v;
												return (
													<button
														key={v}
														type="button"
														onClick={() => setForm((p) => ({ ...p, teamSize: v }))}
														className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
															selected
																? 'border-cyan bg-cyan/[0.08] shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.15)]'
																: 'hover:border-cyan/30 hover:bg-cyan/[0.04] border-white/[0.07] bg-white/[0.02]'
														}`}
													>
														<p
															className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-300'}`}
														>
															{l}
														</p>
														<p className="mt-0.5 text-xs text-slate-500">{d}</p>
													</button>
												);
											})}
										</div>
									</div>

									{/* Data Sensitivity */}
									<div className="mb-8">
										<label className="form-label">Data sensitivity level?</label>
										<div className="grid grid-cols-3 gap-3">
											{[
												{
													v: 'standard',
													l: 'Standard',
													d: 'General business data',
												},
												{ v: 'high', l: 'High', d: 'Customer PII, financials' },
												{
													v: 'regulated',
													l: 'Regulated',
													d: 'HIPAA, SOX, etc.',
												},
											].map(({ v, l, d }) => {
												const selected = form.dataSensitivity === v;
												return (
													<button
														key={v}
														type="button"
														onClick={() => setForm((p) => ({ ...p, dataSensitivity: v }))}
														className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
															selected
																? 'border-cyan bg-cyan/[0.08] shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.15)]'
																: 'hover:border-cyan/30 hover:bg-cyan/[0.04] border-white/[0.07] bg-white/[0.02]'
														}`}
													>
														<p
															className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-300'}`}
														>
															{l}
														</p>
														<p className="mt-0.5 text-xs text-slate-500">{d}</p>
													</button>
												);
											})}
										</div>
									</div>

									{/* Hardware Tier */}
									<div className="mb-8">
										<label className="form-label">Hardware tier</label>
										<div className="space-y-3">
											{HARDWARE_TIERS.map((tier) => {
												const selected = form.hardwareTier === tier.id;
												return (
													<button
														key={tier.id}
														type="button"
														onClick={() => setForm((p) => ({ ...p, hardwareTier: tier.id }))}
														className={`relative w-full rounded-xl border p-5 text-left transition-all duration-200 ${
															selected
																? 'border-cyan bg-cyan/[0.08] shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.15)]'
																: 'hover:border-cyan/30 hover:bg-cyan/[0.04] border-white/[0.07] bg-white/[0.02]'
														}`}
													>
														{tier.recommended && (
															<span className="text-cyan bg-cyan/[0.1] border-cyan/20 absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-bold">
																Recommended
															</span>
														)}
														<p
															className={`text-sm font-bold ${selected ? 'text-white' : 'text-slate-300'}`}
														>
															{tier.label}
														</p>
														<p className="mt-1 text-xs text-slate-500">{tier.specs}</p>
														<div className="mt-2 flex items-center gap-4">
															<span className="text-xs text-slate-400">{tier.models}</span>
															<span className="text-cyan/70 text-xs">· {tier.price}</span>
														</div>
													</button>
												);
											})}
										</div>
									</div>

									{/* Current Stack */}
									<div className="mb-8">
										<label className="form-label">
											What tools do you currently use? (optional)
										</label>
										<textarea
											rows={2}
											value={form.currentStack}
											onChange={(e) => setForm((p) => ({ ...p, currentStack: e.target.value }))}
											className="form-input resize-none"
											placeholder="e.g., Shopify, Slack, PostgreSQL, Google Workspace…"
										/>
									</div>

									<button
										onClick={() => setPhase('contact')}
										disabled={form.useCases.length === 0}
										className="glow-btn w-full justify-center disabled:transform-none disabled:cursor-not-allowed disabled:opacity-40"
									>
										Next: Get Your Custom Plan →
									</button>
								</motion.div>
							)}

							{/* ─── Phase: Contact ─── */}
							{phase === 'contact' && (
								<motion.div
									key="contact"
									initial={{ opacity: 0, y: 18 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -18 }}
									transition={{ duration: 0.35 }}
								>
									{/* Step indicator */}
									<div className="mb-8">
										<div className="mb-2 flex items-center justify-between">
											<span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
												Your Details
											</span>
											<span className="text-cyan text-xs font-semibold">Step 2 of 2</span>
										</div>
										<div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
											<motion.div
												className="h-full rounded-full"
												style={{
													background: 'linear-gradient(90deg, #dc3bf5, #520e60)',
												}}
												initial={false}
												animate={{ width: '100%' }}
												transition={{ duration: 0.5, ease: 'easeInOut' }}
											/>
										</div>
									</div>

									<h3 className="mb-1 text-xl font-black text-white">Almost there</h3>
									<p className="mb-8 text-sm text-slate-400">
										Enter your details and we&apos;ll send you a custom AI deployment plan tailored
										to your requirements.
									</p>

									{/* Config summary */}
									<div className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
										<p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
											Your Configuration
										</p>
										<div className="flex flex-wrap gap-2">
											{form.useCases.map((uc) => (
												<span
													key={uc}
													className="text-cyan bg-cyan/[0.08] border-cyan/20 rounded-full border px-2.5 py-1 text-xs"
												>
													{USE_CASES.find((u) => u.id === uc)?.label}
												</span>
											))}
											<span className="text-purple-light bg-purple/[0.08] border-purple/20 rounded-full border px-2.5 py-1 text-xs">
												{HARDWARE_TIERS.find((t) => t.id === form.hardwareTier)?.label} Tier
											</span>
											<span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
												Team: {form.teamSize}
											</span>
										</div>
									</div>

									<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<label className="form-label">
												Full Name <span className="text-cyan">*</span>
											</label>
											<input
												value={form.name}
												onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
												placeholder="Jane Smith"
												className="form-input"
											/>
										</div>
										<div>
											<label className="form-label">Company</label>
											<input
												value={form.company}
												onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
												placeholder="Acme Corp"
												className="form-input"
											/>
										</div>
									</div>

									<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<label className="form-label">
												Email <span className="text-cyan">*</span>
											</label>
											<input
												type="email"
												value={form.email}
												onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
												placeholder="jane@company.com"
												className="form-input"
											/>
										</div>
										<div>
											<label className="form-label">
												Phone <span className="text-slate-600">(optional)</span>
											</label>
											<input
												type="tel"
												value={form.phone}
												onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
												placeholder="+1 (555) 123-4567"
												className="form-input"
											/>
										</div>
									</div>

									<p className="mb-6 text-xs leading-relaxed text-slate-600">
										We take privacy seriously — your details are only used to send your custom plan
										and optional follow-up. No spam, ever.
									</p>

									<div className="flex gap-3">
										<button
											onClick={() => setPhase('configure')}
											className="outline-btn w-1/3 justify-center"
										>
											← Back
										</button>
										<button
											onClick={handleSubmit}
											disabled={!form.name || !form.email || submitting}
											className="glow-btn flex-1 justify-center disabled:transform-none disabled:cursor-not-allowed disabled:opacity-40"
										>
											{submitting ? 'Submitting...' : 'Get My Custom AI Plan →'}
										</button>
									</div>
								</motion.div>
							)}

							{/* ─── Phase: Submitted ─── */}
							{phase === 'submitted' && (
								<motion.div
									key="submitted"
									initial={{ opacity: 0, y: 18 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -18 }}
									transition={{ duration: 0.35 }}
									className="py-12 text-center"
								>
									<div className="bg-cyan/[0.1] border-cyan mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2">
										<svg
											className="text-cyan h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M4.5 12.75l6 6 9-13.5"
											/>
										</svg>
									</div>
									<h3 className="mb-3 text-2xl font-black text-white">You&apos;re All Set!</h3>
									<p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-slate-400">
										We&apos;ve received your custom AI stack configuration. Our team will review
										your requirements and send you a detailed deployment plan within 24 hours.
									</p>
									<div className="border-cyan/20 bg-cyan/[0.04] mx-auto mb-8 max-w-sm rounded-xl border p-5">
										<p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
											What happens next
										</p>
										<ul className="space-y-2 text-left text-sm text-slate-300">
											<li className="flex gap-2">
												<span className="text-cyan shrink-0">1.</span>
												Custom plan emailed to {form.email}
											</li>
											<li className="flex gap-2">
												<span className="text-cyan shrink-0">2.</span>
												15-min discovery call scheduled
											</li>
											<li className="flex gap-2">
												<span className="text-cyan shrink-0">3.</span>
												Hardware + model recommendation delivered
											</li>
										</ul>
									</div>
									<Link href="/" className="outline-btn inline-flex">
										← Back to Home
									</Link>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</section>
			</main>
		</div>
	);
}
