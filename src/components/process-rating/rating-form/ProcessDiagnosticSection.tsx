'use client';

import { useState } from 'react';

import { contactsApi } from '../../../lib/api';

import { GlassGlow } from '../../ui/GlassGlow';
import { GradientBorder } from '../../ui/GradientBorder';
import { SectionHeading } from '../../ui/SectionHeading';

import {
	type Step,
	type Phase,
	type FormData,
	getCategory,
	buildPointers,
	calculateScore,
	ProcessDiagnosticForm,
	INITIAL_FORM_DATA,
} from '.';

const LOADING_MESSAGES = [
	'Scanning for process bottlenecks...',
	'Evaluating tool friction and knowledge leaks...',
	'Mapping founder dependency risk...',
	'Generating your personalized scorecard...',
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

export default function ProcessDiagnosticSection() {
	const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
	const [step, setStep] = useState<Step>(1);
	const [phase, setPhase] = useState<Phase>('form');
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState('');
	const [loadingIdx, setLoadingIdx] = useState(0);

	const setField = (name: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [name]: value }));
	const goToStep = (nextStep: Step) => setStep(nextStep);

	const runAnalysis = async () => {
		if (!form.email.trim() || !form.name.trim()) {
			setSubmitError('Name and email are required.');
			return;
		}

		if (!isValidName(form.name)) {
			setSubmitError('Please enter a valid full name.');
			return;
		}

		if (!isValidEmail(form.email)) {
			setSubmitError('Please enter a valid email address.');
			return;
		}

		if (!isValidPhone(form.phone)) {
			setSubmitError('Please enter a valid phone number (10 to 15 digits) or leave it empty.');
			return;
		}

		setSubmitting(true);
		setSubmitError('');
		setPhase('loading');
		setLoadingIdx(0);

		const msgInterval = setInterval(() => {
			setLoadingIdx((current) => Math.min(current + 1, LOADING_MESSAGES.length - 1));
		}, 1200);

		try {
			await contactsApi.create({
				name: form.name.trim(),
				email: form.email.trim(),
				phone: form.phone.trim() || null,
				company: form.company || null,
				message: `Process Diagnostic — Motive: ${form.motive} | Team: ${form.teamSize} | Industry: ${form.industry} | SOPs: ${form.sopLocation} | Tools: ${form.toolIntegration} | Score: ${calculateScore(form)} | Broken process: ${form.brokenProcess}`,
				source: 'process_diagnostic',
			});
		} catch {
			// Non-blocking — still show results
		}

		await new Promise((resolve) => setTimeout(resolve, 4000));
		clearInterval(msgInterval);
		setPhase('results');
		setSubmitting(false);
	};

	const score = calculateScore(form);
	const category = getCategory(score);
	const pointers = buildPointers(form);

	return (
		<div className="flex min-h-screen items-center justify-center p-4 text-white">
			<main className="w-full max-w-3xl">
				<div className="mb-12">
					<SectionHeading size="large">
						Get Your Instant <span className="text-[#606bfa]">AI-Powered</span> <br /> Process Rating
					</SectionHeading>

					<p className="font-poppins mt-8 max-w-[800px] text-center text-xl font-light leading-relaxed text-white md:text-2xl">
						Our system analyzes your inputs and gives you a clear process rating so you can quickly understand where you
						stand and what needs attention.
					</p>
				</div>

				<div className="relative z-10">
					<GradientBorder thickness={2} radius="40px" />
					<GlassGlow angle={120} opacity={0.5} start={10} end={90} radius="40px" />

					<div className="relative p-8 pb-12 shadow-2xl" style={{ borderRadius: '38px', background: 'transparent' }}>
						<ProcessDiagnosticForm
							form={form}
							step={step}
							phase={phase}
							submitting={submitting}
							submitError={submitError}
							loadingMessage={LOADING_MESSAGES[loadingIdx]}
							score={score}
							category={category}
							pointers={pointers}
							onChange={setField}
							onGoToStep={goToStep}
							onSubmit={runAnalysis}
						/>
						{phase === 'form' ? <div aria-hidden="true" /> : null}
					</div>
				</div>
			</main>
		</div>
	);
}
