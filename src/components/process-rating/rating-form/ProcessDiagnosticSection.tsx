'use client';

import { useState } from 'react';

import {
	buildPointers,
	calculateScore,
	getCategory,
	INITIAL_FORM_DATA,
	ProcessDiagnosticForm,
	type FormData,
	type Phase,
	type Step,
} from '.';
import FormContainer from '../../ui/form-parts/FormContainer';
import { SectionHeading } from '../../ui/SectionHeading';

const LOADING_MESSAGES = [
	'Scanning for process bottlenecks...',
	'Evaluating tool friction and knowledge leaks...',
	'Mapping founder dependency risk...',
	'Generating your personalized scorecard...',
];

export default function ProcessDiagnosticSection() {
	const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
	const [step, setStep] = useState<Step>(1);
	const [phase, setPhase] = useState<Phase>('form');
	const [loadingIdx, setLoadingIdx] = useState(0);

	const setField = (name: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [name]: value }));
	const goToStep = (nextStep: Step) => setStep(nextStep);

	const runAnalysis = async () => {
		setPhase('loading');
		setLoadingIdx(0);

		const msgInterval = setInterval(() => {
			setLoadingIdx((current) => Math.min(current + 1, LOADING_MESSAGES.length - 1));
		}, 1200);

		await new Promise((resolve) => setTimeout(resolve, 4000));
		clearInterval(msgInterval);
		setPhase('results');
	};

	const score = calculateScore(form);
	const category = getCategory(score);
	const pointers = buildPointers(form);

	return (
		<div className="flex min-h-screen items-center justify-center p-4 text-white">
			<main className="w-full max-w-3xl">
				<div className="mb-8 md:mb-10 lg:mb-12">
					<SectionHeading size="large">
						Get Your Instant <span className="text-[#606bfa]">AI-Powered</span> <br /> Process Rating
					</SectionHeading>

					<p className="font-poppins mt-5 max-w-[800px] text-center text-base font-light leading-relaxed text-white sm:text-lg md:mt-6 md:text-xl lg:text-2xl">
						Our system analyzes your inputs and gives you a clear process rating so you can quickly understand where you
						stand and what needs attention.
					</p>
				</div>

				<FormContainer>
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
					{phase === 'form' ? <div aria-hidden="true" /> : null}
				</FormContainer>
			</main>
		</div>
	);
}
