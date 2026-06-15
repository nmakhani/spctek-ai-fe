'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

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
		<section className="font-poppins relative overflow-hidden px-4 pb-12 pt-20 md:px-6 md:pt-20 lg:px-12 lg:pt-16">
			<div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_top_left,rgba(70,182,255,0.18),transparent_34%),radial-gradient(circle_at_center,rgba(96,107,250,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(94,234,212,0.1),transparent_30%)]" />

			<div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-10">
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

					<HeroCtas className="mt-7 hidden flex-col justify-center gap-3 sm:flex-row lg:flex lg:justify-start" />
				</div>

				<BeforeAfterGraphic />

				<HeroCtas className="mt-3 flex flex-col justify-center gap-3 sm:flex-row lg:hidden" />
			</div>
		</section>
	);
}

function HeroCtas({ className }: { className: string }) {
	return (
		<div className={className}>
			<Link
				href="/process-rating#process-diagnostic"
				className="inline-flex h-[52px] items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#606bfa] px-6 text-sm font-bold text-white shadow-[0_16px_40px_rgba(70,182,255,0.28)] transition-transform duration-200 hover:-translate-y-0.5 md:text-base"
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
	);
}

function BeforeAfterGraphic() {
	const [activeIndex, setActiveIndex] = useState(0);
	const totalSlides = beforeTasks.length;

	const goToSlide = (nextIndex: number) => {
		setActiveIndex((current) => (nextIndex + totalSlides) % totalSlides);
	};

	const goToPrevious = () => {
		setActiveIndex((current) => (current - 1 + totalSlides) % totalSlides);
	};

	const goToNext = () => {
		setActiveIndex((current) => (current + 1) % totalSlides);
	};

	useEffect(() => {
		const interval = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % beforeTasks.length);
		}, 6200);

		return () => window.clearInterval(interval);
	}, []);

	return (
		<div className="relative mx-auto flex w-full max-w-[560px] justify-center overflow-visible py-6 md:py-8 lg:max-w-none lg:justify-end">
			<div className="bg-[#606bfa]/24 pointer-events-none absolute left-[3%] top-[9%] h-44 w-44 rounded-full blur-[66px]" />
			<div className="pointer-events-none absolute right-[-8%] top-[4%] h-56 w-56 rounded-full bg-[#5eead4]/10 blur-[80px]" />
			<div className="bg-[#46b6ff]/12 pointer-events-none absolute bottom-[2%] left-[28%] h-48 w-48 rounded-full blur-[78px]" />

			<div className="relative z-10 flex w-full flex-col gap-5 sm:w-[520px] lg:h-[500px] lg:w-[560px]">
				<div className="border-white/12 relative flex min-h-[268px] flex-col justify-end overflow-visible rounded-[24px] border bg-white/[0.025] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_24px_62px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-6 lg:absolute lg:left-0 lg:top-[40px] lg:h-[300px] lg:w-[305px] lg:pr-0">
					<div className="bg-white/24 pointer-events-none absolute -left-2 -top-2 h-20 w-20 rounded-full blur-2xl" />
					<div className="bg-[#a0a6fc]/18 pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 rounded-full blur-2xl" />
					<div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_22%,transparent_68%,rgba(255,255,255,0.12))]" />
					<div className="relative h-[242px] overflow-visible rounded-[18px] bg-[linear-gradient(180deg,rgba(84,96,219,0.58)_0%,rgba(22,26,68,0.82)_42%,rgba(7,10,28,0.95)_100%)] px-5 pb-9 pt-[86px] shadow-[0_16px_36px_rgba(0,0,0,0.36)] sm:px-7 lg:h-[238px] lg:w-[264px] lg:pb-8 lg:pt-[82px]">
						<ComparisonLabel tone="before" />
						<TaskSlide task={beforeTasks[activeIndex]} tone="before" />
					</div>
				</div>

				<div className="border-white/14 relative min-h-[320px] overflow-visible rounded-[26px] border bg-white/[0.035] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_30px_76px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-6 lg:absolute lg:right-0 lg:top-0 lg:h-[414px] lg:w-[340px]">
					<div className="bg-white/26 pointer-events-none absolute -left-3 -top-3 h-24 w-24 rounded-full blur-2xl" />
					<div className="bg-[#5eead4]/16 pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 rounded-full blur-2xl" />
					<div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_24%,transparent_66%,rgba(255,255,255,0.14))]" />
					<div className="relative h-[286px] overflow-visible rounded-[17px] bg-[linear-gradient(180deg,#626cff_0%,#4c55d4_31%,#202260_63%,#10122e_100%)] px-6 pb-[104px] pt-10 shadow-[0_20px_42px_rgba(0,0,0,0.42)] sm:px-8 lg:h-[360px]">
						<TaskSlide task={afterTasks[activeIndex]} tone="after" />
						<ComparisonLabel tone="after" />
					</div>
				</div>

				<div className="flex items-center justify-center gap-4 pt-1 lg:absolute lg:bottom-24 lg:w-auto lg:translate-x-0 lg:pt-0">
					<button
						type="button"
						onClick={goToPrevious}
						aria-label="Show previous comparison"
						className="border-white/18 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/[0.06] text-white/90 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/[0.11]"
					>
						<ArrowIcon direction="left" />
					</button>

					<div className="flex items-center gap-2">
						{beforeTasks.map((task, index) => {
							const isActive = index === activeIndex;

							return (
								<button
									key={task.title}
									type="button"
									onClick={() => goToSlide(index)}
									aria-label={`Show slide ${index + 1}`}
									aria-pressed={isActive}
									className={`h-2.5 rounded-full transition-all duration-300 ${
										isActive
											? 'w-7 bg-[#5eead4] shadow-[0_0_14px_rgba(94,234,212,0.58)]'
											: 'bg-white/38 hover:bg-white/58 w-2.5'
									}`}
								/>
							);
						})}
					</div>

					<button
						type="button"
						onClick={goToNext}
						aria-label="Show next comparison"
						className="border-white/18 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/[0.06] text-white/90 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/[0.11]"
					>
						<ArrowIcon direction="right" />
					</button>
				</div>
			</div>
		</div>
	);
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
	const isLeft = direction === 'left';

	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
			<path
				d="M15 18l-6-6 6-6"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				transform={isLeft ? undefined : 'rotate(180 12 12)'}
			/>
		</svg>
	);
}

function ComparisonLabel({ tone }: { tone: 'before' | 'after' }) {
	const isAfter = tone === 'after';

	return (
		<div
			className={`absolute z-20 rounded-[10px] border-2 border-[#6a72ff] bg-white px-4 py-2.5 leading-none text-black shadow-[0_0_22px_rgba(96,107,250,0.52),0_14px_24px_rgba(0,0,0,0.3)] ${
				isAfter
					? 'bottom-[34px] right-4 sm:right-[-42px] lg:bottom-[52px] lg:right-[-62px]'
					: 'left-4 top-7 sm:left-[-42px] lg:left-[-44px] lg:top-7'
			}`}
		>
			<span className="text-[14px] font-medium sm:text-[15px]">{isAfter ? 'After' : 'Before'}</span>
			<span
				className={`ml-1 font-black tracking-normal ${isAfter ? 'text-[22px] sm:text-[24px]' : 'text-[19px] sm:text-[21px]'}`}
			>
				SPCTEK.AI
			</span>
		</div>
	);
}

function TaskSlide({ task, tone }: { task: { title: string; description: string }; tone: 'before' | 'after' }) {
	const isAfter = tone === 'after';

	return (
		<AnimatePresence mode="sync">
			<motion.div
				key={task.title}
				initial={{ clipPath: 'inset(0 100% 0 0)' }}
				animate={{ clipPath: 'inset(0 0% 0 0)' }}
				exit={{ clipPath: 'inset(0 0 0 100%)' }}
				transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
				className={
					isAfter
						? 'absolute inset-x-6 top-12 z-10 sm:inset-x-8 sm:top-14 lg:top-[54px]'
						: 'absolute bottom-9 left-5 z-10 w-[172px] sm:left-7 sm:w-[188px] lg:bottom-8 lg:w-[170px]'
				}
			>
				<motion.span
					aria-hidden="true"
					initial={{ left: '-22%', opacity: 1 }}
					animate={{ left: '110%', opacity: 0 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
					className="pointer-events-none absolute inset-y-[-14px] z-20 w-16 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),rgba(255,255,255,0.9),rgba(94,234,212,0.78),transparent)] blur-[1px] drop-shadow-[0_0_16px_rgba(94,234,212,0.72)]"
				/>
				<h2
					className={`font-heading font-bold leading-[1.16] text-white ${
						isAfter ? 'text-[1.72rem] sm:text-[2.08rem]' : 'text-[1.24rem] sm:text-[1.34rem]'
					}`}
				>
					{task.title}
				</h2>
				<p
					className={`mt-3 font-light leading-relaxed ${
						isAfter ? 'text-white/88 text-[16px] sm:text-[17px]' : 'text-[13px] text-[#c6d0e2] sm:text-sm'
					}`}
				>
					{task.description}
				</p>
			</motion.div>
		</AnimatePresence>
	);
}
