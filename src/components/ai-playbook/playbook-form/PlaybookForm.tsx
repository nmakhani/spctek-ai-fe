'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
import { contactsApi } from '../../../lib/api';
import ContactStep from '../../ui/form-parts/ContactStep';
import FormLoadingState from '../../ui/form-parts/FormLoadingState';
import FormProgressBar from '../../ui/form-parts/FormProgressBar';
import StepWrapper from '../../ui/form-parts/StepWrapper';
import { GlassGlow } from '../../ui/GlassGlow';
import { GradientBorder } from '../../ui/GradientBorder';

const LOADING_MESSAGES = ['Analyzing your inputs...', 'Building your playbook...', 'Preparing recommendations...'];

const isValidName = (name: string) => /^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(name.trim());
const isValidEmail = (email: string) =>
	/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim()) && !/\.\./.test(email.trim());
const isValidPhone = (phone: string) =>
	!phone.trim() ||
	(/^[+]?[\d()\-\s]{10,25}$/.test(phone.trim()) &&
		phone.replace(/\D/g, '').length >= 10 &&
		phone.replace(/\D/g, '').length <= 15 &&
		!/^(\d)\1+$/.test(phone.replace(/\D/g, '')));

export default function PlaybookForm() {
	const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
	const [step, setStep] = useState<Step>(1);
	const [phase, setPhase] = useState<Phase>('form');
	const [submitting, setSubmitting] = useState(false);
	const [loadingIdx, setLoadingIdx] = useState(0);
	const [submitError, setSubmitError] = useState('');
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
		const nameTrimmed = form.name.trim();
		const emailTrimmed = form.email.trim();
		const phoneTrimmed = form.phone.trim();
		const companyTrimmed = form.company.trim();

		let error = '';
		if (!nameTrimmed) error = 'Name is required';
		else if (!isValidName(nameTrimmed)) error = 'Please enter a valid name';
		else if (!emailTrimmed) error = 'Email is required';
		else if (!isValidEmail(emailTrimmed)) error = 'Please enter a valid email address';
		else if (phoneTrimmed && !isValidPhone(phoneTrimmed)) error = 'Please enter a valid phone number';

		if (error) {
			setSubmitError(error);
			toast.error(error);
			return;
		}

		setSubmitError('');
		setSubmitting(true);
		setPhase('loading');
		setLoadingIdx(0);

		const intervalId = setInterval(() => {
			setLoadingIdx((c) => Math.min(c + 1, LOADING_MESSAGES.length - 1));
		}, 1200);

		try {
			await contactsApi.create({
				name: nameTrimmed,
				email: emailTrimmed,
				phone: phoneTrimmed,
				company: companyTrimmed,
				source: 'ai_playbook',
				journey: {
					businessType: form.businessType,
					revenueRange: form.revenueRange,
					playbookFocus: form.playbookFocus,
					operationalChallenge: form.operationalChallenge,
					urgency: form.urgency,
				},
			});

			const rec = buildPlaybookRecommendation();
			setRecommendation(rec);
			setPhase('results');
		} catch (err: unknown) {
			console.error('Failed to submit form:', err);
			setPhase('form');
			setStep(TOTAL_STEPS as Step);
			const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
			setSubmitError(msg);
			toast.error(msg);
		} finally {
			clearInterval(intervalId);
			setSubmitting(false);
		}
	};

	return (
		<div className="relative z-10 mx-auto w-full max-w-3xl">
			<GradientBorder thickness={2} radius="40px" />
			<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="40px" />
			<div className="relative p-5 shadow-2xl sm:p-6 md:p-10">
				<AnimatePresence mode="wait">
					{phase === 'loading' ? (
						<StepWrapper key="loading">
							<FormLoadingState message={LOADING_MESSAGES[loadingIdx]} title="Creating Your Playbook..." />
						</StepWrapper>
					) : phase === 'results' ? (
						<StepWrapper key="results">
							<ResultsState recommendation={recommendation} />
						</StepWrapper>
					) : (
						<StepWrapper key={`step-${step}`}>
							<FormProgressBar step={step} totalSteps={TOTAL_STEPS} />
							{step === 1 && <Step1 form={form} onChange={setField} onNext={(s) => goToStep(s)} />}
							{step === 2 && (
								<Step2 form={form} onChange={setField} onNext={(s) => goToStep(s)} onBack={(s) => goToStep(s)} />
							)}
							{step === 3 && (
								<Step3 form={form} onChange={setField} onNext={(s) => goToStep(s)} onBack={(s) => goToStep(s)} />
							)}
							{step === TOTAL_STEPS && (
								<ContactStep
									name={form.name}
									email={form.email}
									company={form.company}
									phone={form.phone}
									onChange={(field, value) => setField(field as keyof FormData, value)}
									onBack={() => goToStep((TOTAL_STEPS - 1) as Step)}
									onSubmit={runSubmit}
									submitting={submitting}
									submitError={submitError}
									title="Where should we send your playbook?"
									subtitle="We'll build your personalized AI automation playbook and send it to your inbox"
									infoCardTitle="Custom AI Playbook"
									infoCardSubtitle="Usually ready within 24 hours"
									privacyText="No spam, ever. Your information is used only to build and deliver your playbook."
									submitButtonText="Claim My Free AI Automation Playbook"
									submittingButtonText="Building..."
									backStep={(TOTAL_STEPS - 1) as Step}
								/>
							)}
						</StepWrapper>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
