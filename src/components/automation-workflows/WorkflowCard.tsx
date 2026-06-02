'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Gem, Plug, type LucideIcon } from 'lucide-react';

import { GlassGlow } from '@/components/ui/GlassGlow';
import { GradientBorder } from '@/components/ui/GradientBorder';
import { resolveR2PublicUrl } from '@/lib/r2';
import type { AutomationWorkflow } from './Workflows';

export function WorkflowCard({
	workflow,
	onInquire,
}: {
	workflow: AutomationWorkflow;
	onInquire: (workflow: AutomationWorkflow) => void;
}) {
	const thumbnailUrl = resolveR2PublicUrl(workflow.thumbnail_url || '');
	const displayedCategories = workflow.categories.slice(0, 2);
	const remainingCount = workflow.categories.length - displayedCategories.length;
	const ClassIcon = workflow.class === 'system' ? Gem : Plug;

	return (
		<article className="group mx-auto h-[430px] w-full max-w-[340px] [perspective:1400px] sm:h-[410px] sm:max-w-[360px] lg:h-[400px]">
			<div className="relative h-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
				<div className="pointer-events-none absolute inset-0 overflow-visible rounded-3xl [backface-visibility:hidden]">
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
				</div>

				<div className="pointer-events-auto absolute inset-0 overflow-visible rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
					<ClassBadge icon={ClassIcon} />
					<CardShell focus>
						<div className="flex h-full flex-col p-5 text-left sm:p-6">
							<p className="text-white/76 text-[14px] leading-relaxed sm:text-[15px]">{workflow.description.body}</p>

							<ul className="ml-4 mt-2 space-y-2 text-[10.5px] text-white/65 sm:text-[11px]">
								{workflow.description.bullets.map((bullet) => (
									<li key={bullet} className="flex gap-2">
										<span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#606bfa]" />
										<span>{bullet}</span>
									</li>
								))}
							</ul>

							<button
								type="button"
								onClick={() => onInquire(workflow)}
								className="mx-auto mt-auto inline-flex w-fit max-w-full items-center justify-center rounded-full border border-[#7d89ff]/45 bg-[#606bfa]/20 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#cfd5ff] transition hover:border-[#a9b2ff] hover:bg-[#606bfa]/40 hover:text-white hover:shadow-[0_0_22px_rgba(96,107,250,0.35)] sm:px-5 sm:text-[11px] sm:tracking-widest"
							>
								Inquire for Implementation
							</button>
						</div>
					</CardShell>
				</div>
			</div>
		</article>
	);
}

function ClassBadge({ icon: Icon }: { icon: LucideIcon }) {
	return (
		<div className="absolute right-5 top-0 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#8d98ff] bg-[#07133a] text-[#d8ddff] shadow-[0_12px_28px_rgba(0,0,0,0.45),0_0_22px_rgba(96,107,250,0.35)]">
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
