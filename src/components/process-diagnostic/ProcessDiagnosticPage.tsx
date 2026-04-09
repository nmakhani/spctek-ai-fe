'use client';

import { useState } from 'react';

import ProcessDiagnosticForm from './ProcessDiagnosticForm';
import { buildPointers, calculateScore, getCategory } from './logic';
import { INITIAL_FORM_DATA, type FormData, type Phase, type Step } from './types';

const LOADING_MESSAGES = [
	'Scanning for process bottlenecks...',
	'Evaluating tool friction and knowledge leaks...',
	'Mapping founder dependency risk...',
	'Generating your personalized scorecard...',
];

export default function ProcessDiagnosticPage() {
	const [form, setForm] = useState<FormData>(INITIAL_FORM_DATA);
	const [step, setStep] = useState<Step>(1);
	const [phase, setPhase] = useState<Phase>('form');
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState('');
	const [loadingIdx, setLoadingIdx] = useState(0);

	const setField = (name: keyof FormData, value: string) =>
		setForm((prev) => ({ ...prev, [name]: value }));
	const goToStep = (nextStep: Step) => setStep(nextStep);

	const runAnalysis = async () => {
		if (!form.email || !form.name) return;
		setSubmitting(true);
		setSubmitError('');
		setPhase('loading');
		setLoadingIdx(0);

		const msgInterval = setInterval(() => {
			setLoadingIdx((current) => Math.min(current + 1, LOADING_MESSAGES.length - 1));
		}, 1200);

		try {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/contacts/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: form.name,
					email: form.email,
					company: form.company || null,
					message: `Process Diagnostic — Motive: ${form.motive} | Team: ${form.teamSize} | Industry: ${form.industry} | SOPs: ${form.sopLocation} | Tools: ${form.toolIntegration} | Score: ${calculateScore(form)} | Broken process: ${form.brokenProcess}`,
					source: 'process_diagnostic',
				}),
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
		<div>
			<main>
				<div>
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
			</main>
		</div>
	);
}
