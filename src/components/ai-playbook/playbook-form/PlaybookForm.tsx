'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import {
	buildPlaybookRecommendation,
	INITIAL_FORM_DATA,
	ResultsState,
	Step1,
	Step2,
	Step3,
	TOTAL_STEPS,
	type FormData,
	type Phase,
	type PlaybookRecommendation,
	type Step,
} from '.';
import FormContainer from '../../ui/form-parts/FormContainer';
import FormLoadingState from '../../ui/form-parts/FormLoadingState';
import FormProgressBar from '../../ui/form-parts/FormProgressBar';
import StepWrapper from '../../ui/form-parts/StepWrapper';

const LOADING_MESSAGES = ['Analyzing your inputs...', 'Building your playbook...', 'Preparing recommendations...'];

export default function PlaybookForm() {
	const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
	const [step, setStep] = useState<Step>(1);
	const [phase, setPhase] = useState<Phase>('form');
	const [loadingIdx, setLoadingIdx] = useState(0);
	const [recommendation, setRecommendation] = useState<PlaybookRecommendation | null>(null);

	const setField = (name: keyof FormData, value: string) => {
		setForm((prev) => {
			const updated = { ...prev, [name]: value };

			// Reset playbookFocus when businessType changes
			if (name === 'businessType') {
				updated.playbookFocus = '';
			}

			return updated;
		});
	};

	const goToStep = (nextStep: Step) => {
		if (nextStep < 1) setStep(1);
		else if (nextStep > TOTAL_STEPS) setStep(TOTAL_STEPS as Step);
		else setStep(nextStep);
	};

	const runSubmit = async () => {
		setPhase('loading');
		setLoadingIdx(0);

		const intervalId = setInterval(() => {
			setLoadingIdx((c) => Math.min(c + 1, LOADING_MESSAGES.length - 1));
		}, 1200);

		const rec = buildPlaybookRecommendation();
		setRecommendation(rec);
		setPhase('results');
		clearInterval(intervalId);
	};

	return (
		<FormContainer>
			<AnimatePresence mode="wait">
				{phase === 'loading' ? (
					<StepWrapper key="loading">
						<FormLoadingState message={LOADING_MESSAGES[loadingIdx]} title="Creating Your Playbook..." />
					</StepWrapper>
				) : phase === 'results' ? (
					<StepWrapper key="results">
						<ResultsState recommendation={recommendation} formData={form} />
					</StepWrapper>
				) : (
					<StepWrapper key={`step-${step}`}>
						<FormProgressBar step={step} totalSteps={TOTAL_STEPS} />
						{step === 1 && <Step1 form={form} onChange={setField} onNext={(s) => goToStep(s)} />}
						{step === 2 && (
							<Step2 form={form} onChange={setField} onNext={(s) => goToStep(s)} onBack={(s) => goToStep(s)} />
						)}
						{step === 3 && <Step3 form={form} onChange={setField} onBack={(s) => goToStep(s)} onSubmit={runSubmit} />}
					</StepWrapper>
				)}
			</AnimatePresence>
		</FormContainer>
	);
}
