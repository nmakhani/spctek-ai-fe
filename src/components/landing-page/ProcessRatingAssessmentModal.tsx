'use client';

import { useEffect, useState } from 'react';

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

const LOADING_MESSAGES = [
	'Scanning for process bottlenecks...',
	'Evaluating tool friction and knowledge leaks...',
	'Mapping founder dependency risk...',
	'Generating your personalized scorecard...',
];

export default function ProcessRatingAssessmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
