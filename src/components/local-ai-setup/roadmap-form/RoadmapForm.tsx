'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import {
	buildArchitectureRecommendation,
	INITIAL_FORM_DATA,
	ResultsState,
	Step1,
	Step2,
	TOTAL_STEPS,
	type ArchitectureRecommendation,
	type FormData,
	type Phase,
	type Step,
} from '.';
import FormContainer from '../../ui/form-parts/FormContainer';
import FormLoadingState from '../../ui/form-parts/FormLoadingState';
import FormProgressBar from '../../ui/form-parts/FormProgressBar';
import StepWrapper from '../../ui/form-parts/StepWrapper';

const LOADING_MESSAGES = [
	'Understanding your deployment goals...',
	'Evaluating data sensitivity and rollout scope...',
	'Matching hardware and infrastructure needs...',
	'Preparing your custom roadmap...',
];

export default function RoadmapForm() {
	const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
	const [step, setStep] = useState<Step>(1);
	const [phase, setPhase] = useState<Phase>('form');
	const [loadingIdx, setLoadingIdx] = useState(0);
	const [recommendation, setRecommendation] = useState<ArchitectureRecommendation | null>(null);

	const setField = (name: keyof FormData, value: string) => {
		if (name === 'useCases') {
			setForm((prev) => ({ ...prev, useCases: value ? value.split('|') : [] }));
			return;
		}

		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const goToStep = (nextStep: Step) => setStep(nextStep);

	const runSubmit = async () => {
		setPhase('loading');
		setLoadingIdx(0);

		const intervalId = setInterval(() => {
			setLoadingIdx((current) => Math.min(current + 1, LOADING_MESSAGES.length - 1));
		}, 1200);

		const nextRecommendation = buildArchitectureRecommendation(form);

		await new Promise((resolve) => setTimeout(resolve, 3200));
		clearInterval(intervalId);
		setRecommendation(nextRecommendation);
		setPhase('results');
	};

	return (
		<FormContainer>
			<AnimatePresence mode="wait">
				{phase === 'loading' ? (
					<StepWrapper key="loading">
						<FormLoadingState message={LOADING_MESSAGES[loadingIdx]} title="Generating Deployment Roadmap..." />
					</StepWrapper>
				) : phase === 'results' && recommendation ? (
					<StepWrapper key="results">
						<ResultsState recommendation={recommendation} formData={form} />
					</StepWrapper>
				) : (
					<StepWrapper key={`step-${step}`}>
						<FormProgressBar step={step} totalSteps={TOTAL_STEPS} />
						{step === 1 && <Step1 form={form} onChange={setField} onNext={goToStep} />}
						{step === 2 && <Step2 form={form} onChange={setField} onBack={goToStep} onSubmit={runSubmit} />}
					</StepWrapper>
				)}
			</AnimatePresence>
		</FormContainer>
	);
}
