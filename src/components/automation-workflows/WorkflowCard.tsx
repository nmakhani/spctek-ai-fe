'use client';

import type { ReactNode } from 'react';
import { Gem, Plug, X, type LucideIcon } from 'lucide-react';
import Image from 'next/image';

import { GlassGlow } from '@/components/ui/GlassGlow';
import { GradientBorder } from '@/components/ui/GradientBorder';
import { resolveR2PublicUrl } from '@/lib/r2';
import type { AutomationWorkflow } from './Workflows';

export function WorkflowCard({
	workflow,
	onSelect,
}: {
	workflow: AutomationWorkflow;
	onSelect: (workflow: AutomationWorkflow) => void;
}) {
	const thumbnailUrl = resolveR2PublicUrl(workflow.thumbnail_url || '');
	const displayedCategories = workflow.categories.slice(0, 2);
	const remainingCount = workflow.categories.length - displayedCategories.length;
	const ClassIcon = workflow.class === 'system' ? Gem : Plug;

	return (
		<article className="mx-auto h-[430px] w-full max-w-[340px] sm:h-[410px] sm:max-w-[360px] lg:h-[400px]">
			<button
				type="button"
				onClick={() => onSelect(workflow)}
				className="group relative h-full w-full rounded-3xl text-left outline-none transition duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#a9b2ff]/70"
			>
				<ClassBadge icon={ClassIcon} />
				<CardShell>
					<div className="flex h-full flex-col text-left">
						<p className="line-clamp-2 min-h-[70px] px-5 pb-4 pt-6 text-[14px] italic leading-relaxed text-[#a9b2ff] sm:min-h-[76px] sm:px-6 sm:text-[15px]">
							{workflow.teaser}
						</p>

						<div className="relative h-[160px] w-full shrink-0 overflow-hidden border-y border-white/10 bg-white/[0.04] sm:h-[170px]">
							{thumbnailUrl ? (
								<Image
									src={thumbnailUrl}
									alt=""
									fill
									sizes="(min-width: 1280px) 360px, (min-width: 640px) 360px, 340px"
									className="object-cover opacity-90 transition duration-500 group-hover:scale-105"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-white/45">
									Automation System
								</div>
							)}
						</div>

						<div className="flex flex-1 flex-col px-5 py-4 sm:px-6">
							<h3 className="line-clamp-2 min-h-[56px] text-[1.2rem] font-semibold leading-tight text-white sm:min-h-[64px] sm:text-[1.35rem]">
								{workflow.name}
							</h3>

							<div className="mt-auto flex min-h-[60px] flex-wrap content-end justify-start gap-2 pt-3">
								<span className="rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-3 py-1 text-[11px] font-medium capitalize text-[#cfd5ff]">
									{workflow.class}
								</span>
								{displayedCategories.map((category) => (
									<span
										key={category.id}
										className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/65"
									>
										{category.name}
									</span>
								))}
								{remainingCount > 0 && (
									<span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/55">
										+{remainingCount} more
									</span>
								)}
							</div>
						</div>
					</div>
				</CardShell>
			</button>
		</article>
	);
}

export function WorkflowDetailsModal({
	workflow,
	onClose,
	onInquire,
}: {
	workflow: AutomationWorkflow | null;
	onClose: () => void;
	onInquire: (workflow: AutomationWorkflow) => void;
}) {
	if (!workflow) {
		return null;
	}

	const thumbnailUrl = resolveR2PublicUrl(workflow.thumbnail_url || '');
	const ctaLabel = workflow.class === 'plugin' ? 'Get This Template' : 'Inquire for Implementation';

	return (
		<div
			className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4 text-left backdrop-blur-md sm:p-6"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="custom-scrollbar relative max-h-[84vh] w-full max-w-4xl overflow-y-auto rounded-[22px] border border-white/15 bg-[linear-gradient(155deg,rgba(5,7,18,0.98)_0%,rgba(11,15,38,0.98)_55%,rgba(16,19,41,0.98)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/75 transition hover:bg-white/[0.14] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#a9b2ff]/60 sm:right-5 sm:top-5"
					aria-label="Close workflow details"
				>
					<X size={20} strokeWidth={2.2} />
				</button>

				<div className="grid gap-0 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
					<aside className="border-b border-white/10 bg-white/[0.035] p-5 pt-6 sm:p-6 sm:pt-6 lg:border-b-0 lg:border-r">
						<div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04]">
							{thumbnailUrl ? (
								<Image
									src={thumbnailUrl}
									alt=""
									width={720}
									height={480}
									sizes="(min-width: 1024px) 430px, 100vw"
									className="h-auto w-full opacity-95"
								/>
							) : (
								<div className="flex aspect-video w-full items-center justify-center px-6 text-center text-sm text-white/45">
									Automation System
								</div>
							)}
						</div>

						<div className="mt-5">
							<h3 className="text-xl font-semibold leading-tight text-white sm:text-2xl">{workflow.name}</h3>
							<p className="mt-3 text-[14px] italic leading-relaxed text-[#a9b2ff] sm:text-[15px]">{workflow.teaser}</p>
						</div>

						<div className="mt-5 flex flex-wrap gap-2">
							<span className="rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-3 py-1 text-[11px] font-medium capitalize text-[#cfd5ff]">
								{workflow.class}
							</span>
							{workflow.categories.map((category) => (
								<span
									key={category.id}
									className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/65"
								>
									{category.name}
								</span>
							))}
						</div>
					</aside>

					<div className="flex min-h-[360px] flex-col px-5 pb-6 pt-6 sm:px-7 sm:pb-7 lg:px-8 lg:py-8">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa4ff]">Workflow details</p>
						<div className="mt-5 space-y-5 leading-relaxed text-white/75">
							<p className="text-base leading-relaxed sm:text-lg">{workflow.description.body}</p>
							{workflow.description.bullets.length > 0 && (
								<ul className="space-y-3 text-sm leading-relaxed text-white/65 sm:text-[15px]">
									{workflow.description.bullets.map((bullet) => (
										<li key={bullet} className="flex gap-3">
											<span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#606bfa] shadow-[0_0_12px_rgba(96,107,250,0.65)]" />
											<span>{bullet}</span>
										</li>
									))}
								</ul>
							)}
						</div>

						<button
							type="button"
							onClick={() => onInquire(workflow)}
							className="mt-8 inline-flex w-fit max-w-full items-center justify-center rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-5 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-[#cfd5ff] transition hover:border-[#a9b2ff] hover:bg-[#606bfa]/40 hover:text-white hover:shadow-[0_0_22px_rgba(96,107,250,0.35)] sm:px-6 sm:text-xs"
						>
							{ctaLabel}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function ClassBadge({ icon: Icon }: { icon: LucideIcon }) {
	return (
		<div className="pointer-events-none absolute right-5 top-0 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#8d98ff] bg-[#07133a] text-[#d8ddff] shadow-[0_12px_28px_rgba(0,0,0,0.45),0_0_22px_rgba(96,107,250,0.35)]">
			<Icon size={22} strokeWidth={2.1} />
		</div>
	);
}

function CardShell({ children, focus = false }: { children: ReactNode; focus?: boolean }) {
	return (
		<div className="relative h-full rounded-3xl bg-[#050712]/80">
			<GlassGlow angle={120} opacity={focus ? 0.35 : 0.24} start={12} end={88} radius="24px" focus={focus} />
			<div className="relative z-10 h-full">{children}</div>
			<div className="pointer-events-none absolute inset-0 z-30 rounded-3xl">
				<GradientBorder thickness={1.5} radius="24px" />
			</div>
		</div>
	);
}
