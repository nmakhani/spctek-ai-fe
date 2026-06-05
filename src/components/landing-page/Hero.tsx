'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import {
	buildPointers,
	calculateScore,
	getCategory,
	INITIAL_FORM_DATA,
	ProcessDiagnosticForm,
	type FormData,
	type Phase,
	type Step,
} from '../process-rating/rating-form';
import FormContainer from '../ui/form-parts/FormContainer';
import { SectionHeading } from '../ui/SectionHeading';

const LOADING_MESSAGES = [
	'Scanning for process bottlenecks...',
	'Evaluating tool friction and knowledge leaks...',
	'Mapping founder dependency risk...',
	'Generating your personalized scorecard...',
];

const beforeTasks = [
	{
		title: 'Manual reporting',
		description: 'Teams copy from dashboards, sheets, and inboxes.',
	},
	{
		title: 'Scattered SOPs',
		description: 'Answers live across docs, Slack, email, and team memory.',
	},
	{
		title: 'Late issue detection',
		description: 'Operational risks are found after they already slowed the business down.',
	},
	{
		title: 'Repeated handoffs',
		description: 'Managers chase updates instead of improving the system.',
	},
];

const afterTasks = [
	{
		title: 'Reports generated',
		description: 'KPIs, insights, and next actions are drafted automatically.',
	},
	{
		title: 'SOP assistant live',
		description: 'Teams get approved answers from internal process docs.',
	},
	{
		title: 'Risks routed early',
		description: 'Alerts become categorized tasks with owners and urgency attached.',
	},
	{
		title: 'Approvals move faster',
		description: 'Work reaches the right person with context already attached.',
	},
];

export default function Hero() {
	const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

	return (
		<section className="font-poppins relative overflow-hidden px-4 pb-12 pt-20 md:px-6 md:pt-24 lg:px-12 lg:pt-28">
			<div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_top_left,rgba(70,182,255,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(94,234,212,0.12),transparent_30%)]" />

			<div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-11">
				<div className="text-center lg:text-left">
					<div className="mx-auto max-w-4xl lg:mx-0 [&_h1]:lg:text-left">
						<SectionHeading size="large" align="center">
							We Fix Your Operations First, Then <span className="text-[#606bfa]">Automate Them With AI</span>
						</SectionHeading>
					</div>

					<p className="mx-auto mt-6 max-w-[650px] text-base font-light leading-relaxed text-[#a7b0c0] sm:text-lg md:text-xl lg:mx-0">
						SPCTEK AI maps your manual workflows, connects your tools, and builds AI-powered systems that reduce
						repetitive work across reporting, client onboarding, SOPs, marketplace operations, support, and task
						execution.
					</p>

					<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
						<button
							type="button"
							onClick={() => setIsAssessmentOpen(true)}
							className="inline-flex h-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#46b6ff] to-[#5eead4] px-6 text-sm font-bold text-[#03101d] shadow-[0_16px_40px_rgba(70,182,255,0.28)] transition-transform duration-200 hover:-translate-y-0.5 md:text-base"
						>
							Get Free AI Ops Assessment
						</button>
						<Link
							href="#solutions"
							className="border-white/12 inline-flex h-[52px] items-center justify-center rounded-full border bg-white/[0.08] px-6 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/[0.12] md:text-base"
						>
							See What We Automate
						</Link>
					</div>
				</div>

				<div className="relative grid gap-3 sm:grid-cols-2">
					<div className="pointer-events-none absolute inset-6 -z-10 rounded-full bg-[#606bfa]/20 blur-3xl" />
					<WorkflowColumn title="Before SPCTEK AI" tone="before" tasks={beforeTasks} />
					<WorkflowColumn title="After SPCTEK AI" tone="after" tasks={afterTasks} />
				</div>
			</div>

			<ProcessRatingModal isOpen={isAssessmentOpen} onClose={() => setIsAssessmentOpen(false)} />
		</section>
	);
}

function ProcessRatingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
	const [step, setStep] = useState<Step>(1);
	const [phase, setPhase] = useState<Phase>('form');
	const [loadingIdx, setLoadingIdx] = useState(0);

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	const setField = (name: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [name]: value }));
	const goToStep = (nextStep: Step) => setStep(nextStep);

	const runAnalysis = async () => {
		setPhase('loading');
		setLoadingIdx(0);

		const msgInterval = window.setInterval(() => {
			setLoadingIdx((current) => Math.min(current + 1, LOADING_MESSAGES.length - 1));
		}, 1200);

		await new Promise((resolve) => window.setTimeout(resolve, 4000));
		window.clearInterval(msgInterval);
		setPhase('results');
	};

	const score = calculateScore(form);
	const category = getCategory(score);
	const pointers = buildPointers(form);

	return (
		<div
			className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-4"
			onClick={onClose}
		>
			<div
				className="custom-scrollbar max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/15 bg-[#070b14] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="mb-6 flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a6fc]">Free AI Ops Assessment</p>
						<h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Get Your Instant Process Rating</h2>
						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
							Answer a few operational questions and get a clear scorecard for where AI automation can remove friction.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.12]"
					>
						Close
					</button>
				</div>

				<FormContainer className="max-w-none">
					<ProcessDiagnosticForm
						form={form}
						step={step}
						phase={phase}
						loadingMessage={LOADING_MESSAGES[loadingIdx]}
						score={score}
						category={category}
						pointers={pointers}
						onChange={setField}
						onGoToStep={goToStep}
						onSubmit={runAnalysis}
					/>
				</FormContainer>
			</div>
		</div>
	);
}

function WorkflowColumn({
	title,
	tone,
	tasks,
}: {
	title: string;
	tone: 'before' | 'after';
	tasks: Array<{ title: string; description: string }>;
}) {
	const isAfter = tone === 'after';

	return (
		<div
			className={`group/column relative overflow-hidden rounded-[22px] border p-4 transition duration-300 hover:-translate-y-1 ${
				isAfter
					? 'border-[#8bffb0]/42 bg-[linear-gradient(180deg,rgba(139,255,176,0.13),rgba(7,11,20,0.7))] shadow-[0_20px_60px_rgba(139,255,176,0.15),0_0_28px_rgba(139,255,176,0.08)] hover:border-[#8bffb0]/70 hover:shadow-[0_26px_80px_rgba(139,255,176,0.24),0_0_36px_rgba(139,255,176,0.14)]'
					: 'hover:border-[#ffd166]/28 border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(7,11,20,0.68))] shadow-[0_14px_42px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_58px_rgba(255,209,102,0.08)]'
			}`}
		>
			<div
				className={`pointer-events-none absolute inset-x-8 top-0 h-px transition duration-300 group-hover/column:inset-x-4 ${
					isAfter
						? 'bg-gradient-to-r from-transparent via-[#8bffb0] to-transparent'
						: 'via-white/24 bg-gradient-to-r from-transparent to-transparent'
				}`}
			/>
			<div
				className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full blur-2xl transition duration-300 group-hover/column:scale-125 ${
					isAfter ? 'bg-[#8bffb0]/20' : 'bg-white/8'
				}`}
			/>
			<h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
				<span
					className={`h-2.5 w-2.5 rounded-full shadow-[0_0_14px_currentColor] ${
						isAfter ? 'bg-[#8bffb0] text-[#8bffb0]' : 'bg-[#ff6b6b] text-[#ff6b6b]'
					}`}
				/>
				{title}
			</h2>
			<div className="grid gap-2">
				{tasks.map((task) => (
					<div
						key={task.title}
						className={`relative overflow-hidden rounded-2xl border p-3 text-xs leading-relaxed text-[#dce6f5] transition duration-300 group-hover/column:translate-x-0.5 ${
							isAfter
								? 'border-[#8bffb0]/34 bg-[#8bffb0]/12 hover:bg-[#8bffb0]/18 hover:border-[#8bffb0]/60'
								: 'border-white/12 hover:border-[#ffd166]/32 hover:bg-[#ffd166]/8 bg-white/[0.045]'
						}`}
					>
						<div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover/column:opacity-100">
							<div className={`absolute inset-y-0 left-0 w-1 ${isAfter ? 'bg-[#8bffb0]/70' : 'bg-[#ffd166]/70'}`} />
						</div>
						<strong className="mb-1 block text-sm leading-tight text-white">{task.title}</strong>
						{task.description}
					</div>
				))}
			</div>
		</div>
	);
}
