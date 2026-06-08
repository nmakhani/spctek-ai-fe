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
	const classLabel = workflow.class === 'plugin' ? 'Plug & Play Automation' : 'System Automation';

	return (
		<article className="mx-auto h-[430px] w-full max-w-[340px] sm:h-[410px] sm:max-w-[360px] md:h-[460px] md:max-w-none lg:h-[480px]">
			<button
				type="button"
				onClick={() => onSelect(workflow)}
				className="group relative h-full w-full rounded-3xl text-left outline-none transition duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#a9b2ff]/70"
			>
				<ClassBadge icon={ClassIcon} />
				<CardShell>
					<div className="flex h-full flex-col text-left">
						<p className="line-clamp-2 min-h-[64px] px-5 pb-5 pt-5 text-[15px] italic leading-relaxed text-[#a9b2ff] sm:min-h-[70px] sm:px-6 sm:text-[16px] md:min-h-[74px] md:px-7 md:pt-6 md:text-[17px]">
							{workflow.teaser}
						</p>

						<div className="relative h-[150px] w-full shrink-0 overflow-hidden border-y border-white/10 bg-white/[0.04] sm:h-[160px] md:h-[180px] lg:h-[190px]">
							{thumbnailUrl ? (
								<Image
									src={thumbnailUrl}
									fill
									alt=""
									sizes="(min-width: 1280px) 560px, (min-width: 768px) 50vw, (min-width: 640px) 360px, 340px"
									className="object-cover opacity-90 transition duration-500 group-hover:scale-105"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-white/45">
									Automation System
								</div>
							)}
						</div>

						<div className="flex flex-1 flex-col px-5 py-4 sm:px-6 md:px-7">
							<h3 className="line-clamp-2 min-h-[52px] text-[1.2rem] font-semibold leading-tight text-white sm:min-h-[58px] sm:text-[1.35rem] md:min-h-[62px] md:text-[1.45rem]">
								{workflow.name}
							</h3>

							<div className="flex min-h-[40px] flex-wrap content-start justify-start gap-2">
								<span className="rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-3 py-1 text-[11px] font-medium capitalize text-[#cfd5ff]">
									{classLabel}
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

							<div className="mt-auto flex h-10 flex-col items-center justify-end text-[13px] font-bold uppercase tracking-[0.16em] text-[#a9b2ff] md:text-[14px]">
								<span className="mb-4 h-px w-[min(100%,280px)] bg-gradient-to-r from-transparent via-[#a0a6fc]/70 to-transparent transition-[width] duration-300 group-hover:w-[min(100%,320px)] group-hover:via-white sm:w-[320px] sm:group-hover:w-[360px] md:w-[400px] md:group-hover:w-[480px]" />
								<span className="inline-flex items-center justify-center gap-2 transition duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(160,166,252,0.85)]">
									View Details
									<span className="transition duration-300 group-hover:translate-x-1">-&gt;</span>
								</span>
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
	const classLabel = workflow.class === 'plugin' ? 'Plug & Play Automation' : 'System Automation';

	return (
		<div
			className="fixed inset-0 z-[70] flex items-end justify-center bg-black/35 p-2 text-left backdrop-blur-md sm:items-center sm:p-6"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="relative flex max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-t-[22px] border border-white/15 bg-[linear-gradient(155deg,rgba(5,7,18,0.98)_0%,rgba(11,15,38,0.98)_55%,rgba(16,19,41,0.98)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.72)] sm:max-h-[88vh] sm:w-[min(100%,1024px)] sm:rounded-[22px] lg:h-[min(84vh,640px)] lg:overflow-hidden">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/75 transition hover:bg-white/[0.14] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#a9b2ff]/60 sm:right-5 sm:top-5 sm:h-10 sm:w-10"
					aria-label="Close workflow details"
				>
					<X size={20} strokeWidth={2.2} />
				</button>

				<div className="grid w-full gap-0 lg:min-h-0 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
					<aside className="flex flex-col border-b border-white/10 bg-white/[0.035] p-4 pt-12 text-center sm:p-6 sm:pt-6 lg:min-h-0 lg:border-b-0 lg:border-r">
						<div className="lg:custom-scrollbar lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
							<div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04]">
								{thumbnailUrl ? (
									<Image
										src={thumbnailUrl}
										alt=""
										width={720}
										height={480}
										sizes="(min-width: 1024px) 410px, 100vw"
										className="aspect-video w-full object-cover opacity-95"
									/>
								) : (
									<div className="flex aspect-video w-full items-center justify-center px-6 text-center text-sm text-white/45">
										Automation System
									</div>
								)}
							</div>

							<div className="mt-4 sm:mt-5">
								<h3 className="text-lg font-semibold leading-tight text-white sm:text-2xl">{workflow.name}</h3>
								<p className="mt-2 text-[13px] italic leading-relaxed text-[#a9b2ff] sm:mt-3 sm:text-[15px]">
									{workflow.teaser}
								</p>
							</div>

							<div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-5">
								<span className="rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-3 py-1 text-[11px] font-medium capitalize text-[#cfd5ff]">
									{classLabel}
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
						</div>

						<div className="shrink-0 pt-5 sm:pt-6">
							<button
								type="button"
								onClick={() => onInquire(workflow)}
								className="inline-flex w-full items-center justify-center rounded-full border border-[#a0a6fc]/70 bg-[#606bfa] px-5 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_0_24px_rgba(96,107,250,0.5),0_14px_34px_rgba(96,107,250,0.25)] transition hover:-translate-y-0.5 hover:border-white/80 hover:bg-[#6f79ff] hover:shadow-[0_0_34px_rgba(160,166,252,0.7),0_18px_42px_rgba(96,107,250,0.38)] sm:px-6 sm:py-3.5 sm:text-xs"
							>
								{ctaLabel}
							</button>
						</div>
					</aside>

					<div className="flex min-h-0 flex-col px-4 pb-5 pt-5 sm:px-7 sm:pb-7 sm:pt-6 lg:px-8 lg:py-8">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa4ff]">Workflow details</p>
						<div className="lg:custom-scrollbar mt-4 min-h-0 flex-1 space-y-4 leading-relaxed text-white/75 sm:mt-5 sm:space-y-5 lg:overflow-y-auto lg:pr-1">
							<p className="text-sm leading-relaxed sm:text-base lg:text-lg">{workflow.description.body}</p>
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
					</div>
				</div>
			</div>
		</div>
	);
}

function ClassBadge({ icon: Icon }: { icon: LucideIcon }) {
	return (
		<div className="pointer-events-none absolute right-5 top-0 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#8d98ff] bg-[#07133a] text-[#d8ddff] shadow-[0_12px_28px_rgba(0,0,0,0.45),0_0_22px_rgba(96,107,250,0.35)]">
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
