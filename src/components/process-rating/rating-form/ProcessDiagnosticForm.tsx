'use client';

import { AnimatePresence } from 'framer-motion';

import {
	ResultsState,
	Step1,
	Step2,
	Step3,
	Step4,
	TOTAL_STEPS,
	type Category,
	type FormData,
	type Phase,
	type Pointer,
	type Step,
} from '.';
import ContactStep from '../../ui/form-parts/ContactStep';
import FormLoadingState from '../../ui/form-parts/FormLoadingState';
import FormProgressBar from '../../ui/form-parts/FormProgressBar';
import StepWrapper from '../../ui/form-parts/StepWrapper';

type ProcessDiagnosticFormProps = {
	form: FormData;
	step: Step;
	phase: Phase;
	submitting: boolean;
	submitError: string;
	loadingMessage: string;
	score: number;
	category: Category;
	pointers: Pointer[];
	onChange: (name: keyof FormData, value: string) => void;
	onGoToStep: (step: Step) => void;
	onSubmit: () => void;
};

export default function ProcessDiagnosticForm({
	form,
	step,
	phase,
	submitting,
	submitError,
	loadingMessage,
	score,
	category,
	pointers,
	onChange,
	onGoToStep,
	onSubmit,
}: ProcessDiagnosticFormProps) {
	return (
		<div>
			<AnimatePresence mode="wait">
				{phase === 'loading' ? (
					<StepWrapper key="loading">
						<FormLoadingState message={loadingMessage} title="Analyzing Process Architecture..." />
					</StepWrapper>
				) : phase === 'results' ? (
					<StepWrapper key="results">
						<ResultsState score={score} category={category} pointers={pointers} />
					</StepWrapper>
				) : (
					<StepWrapper key={`step-${step}`}>
						<FormProgressBar step={step} totalSteps={TOTAL_STEPS} />
						{step === 1 && <Step1 form={form} onChange={onChange} onNext={onGoToStep} />}
						{step === 2 && <Step2 form={form} onChange={onChange} onNext={onGoToStep} onBack={onGoToStep} />}
						{step === 3 && <Step3 form={form} onChange={onChange} onNext={onGoToStep} onBack={onGoToStep} />}
						{step === 4 && <Step4 form={form} onChange={onChange} onNext={onGoToStep} onBack={onGoToStep} />}
						{step === 5 && (
							<ContactStep<Step>
								name={form.name}
								email={form.email}
								company={form.company}
								phone={form.phone}
								onChange={(field, value) => onChange(field, value)}
								onBack={onGoToStep}
								onSubmit={onSubmit}
								submitting={submitting}
								submitError={submitError}
								title="Almost There"
								subtitle="Enter your details to unlock your Process Health Score and personalized automation playbook."
								infoCardTitle="Your score is ready"
								infoCardSubtitle="Enter your email below to reveal your full scorecard &amp; top 4 fixes."
								privacyText="We take privacy seriously. Your details are only used to send your scorecard and optional follow-up. No spam, ever."
								submitButtonText="Reveal My Scorecard →"
								submittingButtonText="Analyzing..."
								backStep={4}
							/>
						)}
					</StepWrapper>
				)}
			</AnimatePresence>
		</div>
	);
}
