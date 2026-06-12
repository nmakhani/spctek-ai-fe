'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { SectionHeading } from '../ui/SectionHeading';

const beforeTasks = [
	{
		title: 'Manual Reporting',
		description: 'Teams copy from dashboards, sheets, and inboxes.',
	},
	{
		title: 'Scattered SOPs',
		description: 'Answers live across docs, Slack, email, and team memory.',
	},
	{
		title: 'Late Risk Detection',
		description: 'Operational risks are found after they slow the business down.',
	},
	{
		title: 'Repeated Handoffs',
		description: 'Managers chase updates instead of improving the system.',
	},
];

const afterTasks = [
	{
		title: 'Automated Reporting',
		description: 'KPIs, insights, and next actions are drafted automatically.',
	},
	{
		title: 'Live SOP Assistant',
		description: 'Teams get approved answers from internal process docs.',
	},
	{
		title: 'Risks Routed Early',
		description: 'Alerts become categorized tasks with urgency attached.',
	},
	{
		title: 'Faster Approvals',
		description: 'Work reaches the right person with context already attached.',
	},
];

export default function Hero() {
	return (
		<section className="font-poppins relative overflow-hidden px-4 pb-12 pt-20 md:px-6 md:pt-24 lg:px-12 lg:pt-28">
			<div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_top_left,rgba(70,182,255,0.18),transparent_34%),radial-gradient(circle_at_center,rgba(96,107,250,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(94,234,212,0.1),transparent_30%)]" />

			<div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-11">
				<div className="text-center lg:text-left">
					<div className="mx-auto max-w-4xl lg:mx-0 [&_h1]:lg:text-left">
						<SectionHeading size="large" align="center">
							We Fix Your Operations First, Then <span className="text-[#606bfa]">Automate Them With AI</span>
						</SectionHeading>
					</div>

					<p className="mx-auto mt-6 max-w-[650px] text-base font-light leading-relaxed text-[#a7b0c0] sm:text-lg md:text-xl lg:mx-0">
						SPCTEK AI maps workflows, connects tools, and builds AI systems that reduce repetitive work across
						operations, reporting, onboarding, SOPs, and support.
					</p>

					<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
						<Link
							href="/process-rating#process-diagnostic"
							className="inline-flex h-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#46b6ff] to-[#5eead4] px-6 text-sm font-bold text-[#03101d] shadow-[0_16px_40px_rgba(70,182,255,0.28)] transition-transform duration-200 hover:-translate-y-0.5 md:text-base"
						>
							Get Free AI Ops Assessment
						</Link>
						<Link
							href="#solutions"
							className="border-white/12 inline-flex h-[52px] items-center justify-center rounded-full border bg-white/[0.08] px-6 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/[0.12] md:text-base"
						>
							See What We Automate
						</Link>
					</div>
				</div>

				<BeforeAfterGraphic />
			</div>
		</section>
	);
}

function BeforeAfterGraphic() {
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % beforeTasks.length);
		}, 6200);

		return () => window.clearInterval(interval);
	}, []);

	return (
		<div className="relative mx-auto flex w-full max-w-[560px] justify-center overflow-visible py-6 md:py-8 lg:max-w-none lg:justify-end">
			<div className="pointer-events-none absolute left-[3%] top-[9%] h-44 w-44 rounded-full bg-[#606bfa]/24 blur-[66px]" />
			<div className="pointer-events-none absolute right-[-8%] top-[4%] h-56 w-56 rounded-full bg-[#5eead4]/10 blur-[80px]" />
			<div className="pointer-events-none absolute bottom-[2%] left-[28%] h-48 w-48 rounded-full bg-[#46b6ff]/12 blur-[78px]" />

			<div className="relative z-10 flex w-full flex-col gap-5 sm:w-[520px] lg:h-[410px] lg:w-[560px]">
				<div className="relative flex min-h-[268px] flex-col justify-end overflow-visible rounded-[24px] border border-white/12 bg-white/[0.025] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_24px_62px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-6 lg:absolute lg:left-0 lg:top-[58px] lg:h-[300px] lg:w-[305px] lg:pr-0">
					<div className="pointer-events-none absolute -left-2 -top-2 h-20 w-20 rounded-full bg-white/24 blur-2xl" />
					<div className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 rounded-full bg-[#a0a6fc]/18 blur-2xl" />
					<div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_22%,transparent_68%,rgba(255,255,255,0.12))]" />
					<div className="relative h-[242px] overflow-visible rounded-[18px] bg-[linear-gradient(180deg,rgba(84,96,219,0.58)_0%,rgba(22,26,68,0.82)_42%,rgba(7,10,28,0.95)_100%)] px-5 pb-7 pt-[96px] shadow-[0_16px_36px_rgba(0,0,0,0.36)] sm:px-7 lg:h-[238px] lg:w-[264px]">
						<ComparisonLabel tone="before" />
						<TaskSlide task={beforeTasks[activeIndex]} tone="before" />
					</div>
				</div>

				<div className="relative min-h-[304px] overflow-visible rounded-[26px] border border-white/14 bg-white/[0.035] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_30px_76px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-6 lg:absolute lg:right-0 lg:top-0 lg:h-[382px] lg:w-[315px]">
					<div className="pointer-events-none absolute -left-3 -top-3 h-24 w-24 rounded-full bg-white/26 blur-2xl" />
					<div className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 rounded-full bg-[#5eead4]/16 blur-2xl" />
					<div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_24%,transparent_66%,rgba(255,255,255,0.14))]" />
					<div className="relative h-[272px] overflow-visible rounded-[17px] bg-[linear-gradient(180deg,#626cff_0%,#4c55d4_31%,#202260_63%,#10122e_100%)] px-6 pb-[104px] pt-10 shadow-[0_20px_42px_rgba(0,0,0,0.42)] sm:px-8 lg:h-[334px]">
						<TaskSlide task={afterTasks[activeIndex]} tone="after" />
						<ComparisonLabel tone="after" />
					</div>
				</div>
			</div>
		</div>
	);
}

function ComparisonLabel({ tone }: { tone: 'before' | 'after' }) {
	const isAfter = tone === 'after';

	return (
		<div
			className={`absolute z-20 rounded-[10px] border-2 border-[#6a72ff] bg-white px-4 py-2.5 leading-none text-black shadow-[0_0_22px_rgba(96,107,250,0.52),0_14px_24px_rgba(0,0,0,0.3)] ${
				isAfter
					? 'bottom-[38px] right-4 sm:right-[-42px] lg:bottom-[48px] lg:right-[-58px]'
					: 'left-4 top-7 sm:left-[-42px] lg:left-[-44px] lg:top-7'
			}`}
		>
			<span className="text-[14px] font-medium sm:text-[15px]">{isAfter ? 'After' : 'Before'}</span>
			<span className="ml-1 text-[19px] font-black tracking-normal sm:text-[21px]">SPCTEK.AI</span>
		</div>
	);
}

function TaskSlide({
	task,
	tone,
}: {
	task: { title: string; description: string };
	tone: 'before' | 'after';
}) {
	const isAfter = tone === 'after';

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={task.title}
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -8 }}
				transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
				className={
					isAfter
						? 'absolute inset-x-6 top-12 z-10 sm:inset-x-8 sm:top-14 lg:top-16'
						: 'absolute bottom-7 left-5 z-10 w-[172px] sm:left-7 sm:w-[188px] lg:w-[170px]'
				}
			>
				<h2
					className={`font-heading font-bold leading-[1.16] text-white ${
						isAfter ? 'text-[1.6rem] sm:text-[1.95rem]' : 'text-[1.24rem] sm:text-[1.34rem]'
					}`}
				>
					{task.title}
				</h2>
				<p
					className={`mt-3 font-light leading-relaxed ${
						isAfter ? 'text-[15px] text-white/86 sm:text-base' : 'text-[13px] text-[#c6d0e2] sm:text-sm'
					}`}
				>
					{task.description}
				</p>
			</motion.div>
		</AnimatePresence>
	);
}
