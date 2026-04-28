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
import { contactsApi } from '../../../lib/api';
import ContactStep from '../../ui/form-parts/ContactStep';
import FormLoadingState from '../../ui/form-parts/FormLoadingState';
import FormProgressBar from '../../ui/form-parts/FormProgressBar';
import StepWrapper from '../../ui/form-parts/StepWrapper';
import { GlassGlow } from '../../ui/GlassGlow';
import { GradientBorder } from '../../ui/GradientBorder';

const LOADING_MESSAGES = [
	'Understanding your deployment goals...',
	'Evaluating data sensitivity and rollout scope...',
	'Matching hardware and infrastructure needs...',
	'Preparing your custom roadmap...',
];

const isValidName = (name: string) => /^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(name.trim());
const isValidEmail = (email: string) =>
	/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim()) && !/\.\./.test(email.trim());
const isValidPhone = (phone: string) =>
	!phone.trim() ||
	(/^[+]?[\d()\-\s]{10,25}$/.test(phone.trim()) &&
		phone.replace(/\D/g, '').length >= 10 &&
		phone.replace(/\D/g, '').length <= 15 &&
		!/^(\d)\1+$/.test(phone.replace(/\D/g, '')));

export default function RoadmapForm() {
	const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
	const [step, setStep] = useState<Step>(1);
	const [phase, setPhase] = useState<Phase>('form');
	const [submitting, setSubmitting] = useState(false);
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
		if (!form.name.trim() || !form.email.trim()) return;
		if (!isValidName(form.name)) return;
		if (!isValidEmail(form.email)) return;
		if (!isValidPhone(form.phone)) return;

		setSubmitting(true);
		setPhase('loading');
		setLoadingIdx(0);

		const intervalId = setInterval(() => {
			setLoadingIdx((current) => Math.min(current + 1, LOADING_MESSAGES.length - 1));
		}, 1200);

		const nextRecommendation = buildArchitectureRecommendation(form);

		try {
			await contactsApi.create({
				name: form.name.trim(),
				email: form.email.trim(),
				phone: form.phone.trim() || null,
				company: form.company || null,
				message: `AI Deployment Roadmap — Use Cases: ${form.useCases.join(', ')} | Team Size: ${form.teamSize} | Data Sensitivity: ${form.dataSensitivity} | Deployment Model: ${form.deploymentModel} | Recommended Tier: ${nextRecommendation.tier.label} | Current Stack: ${form.currentStack || 'N/A'}`,
				source: 'ai_deployment_roadmap',
				journey: {
					useCases: form.useCases,
					teamSize: form.teamSize,
					dataSensitivity: form.dataSensitivity,
					deploymentModel: form.deploymentModel,
					currentStack: form.currentStack,
					recommendedTier: nextRecommendation.tier.label,
				},
			});
		} catch {
			// Non-blocking
		}

		await new Promise((resolve) => setTimeout(resolve, 3200));
		clearInterval(intervalId);
		setRecommendation(nextRecommendation);
		setPhase('results');
		setSubmitting(false);
	};

	return (
		<div className="relative z-10 mx-auto w-full max-w-3xl">
			<GradientBorder thickness={2} radius="40px" />
			<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="40px" />
			<div className="relative p-5 shadow-2xl sm:p-6 md:p-10">
				<AnimatePresence mode="wait">
					{phase === 'loading' ? (
						<StepWrapper key="loading">
							<FormLoadingState message={LOADING_MESSAGES[loadingIdx]} title="Generating Deployment Roadmap..." />
						</StepWrapper>
					) : phase === 'results' && recommendation ? (
						<StepWrapper key="results">
							<ResultsState recommendation={recommendation} />
						</StepWrapper>
					) : (
						<StepWrapper key={`step-${step}`}>
							<FormProgressBar step={step} totalSteps={TOTAL_STEPS} />
							{step === 1 && <Step1 form={form} onChange={setField} onNext={goToStep} />}
							{step === 2 && <Step2 form={form} onChange={setField} onNext={goToStep} onBack={goToStep} />}
							{step === 3 && (
								<ContactStep
									name={form.name}
									email={form.email}
									company={form.company}
									phone={form.phone}
									onChange={(field, value) => setField(field, value)}
									onBack={goToStep}
									onSubmit={runSubmit}
									submitting={submitting}
									title="Contact Details"
									subtitle="Enter your details to generate your architecture recommendation."
									infoCardTitle="Your recommendation is ready"
									infoCardSubtitle="Enter your email below to reveal your full architecture recommendation."
									privacyText="We take privacy seriously. Your details are only used to send your roadmap and optional follow-up. No spam, ever."
									submitButtonText="Generate My Architecture →"
									submittingButtonText="Generating..."
									backStep={2}
								/>
							)}
						</StepWrapper>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
