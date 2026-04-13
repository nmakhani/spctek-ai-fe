'use client';

import { AnimatePresence } from 'framer-motion';

import {
	Step1,
	Step2,
	Step3,
	Step4,
	Step5,
	StepWrapper,
	ResultsState,
	TOTAL_STEPS,
	type Category,
	type FormData,
	type Pointer,
	type Phase,
	type Step,
} from '.';

import FormProgressBar from '../../ui/form-parts/FormProgressBar';
import FormLoadingState from '../../ui/form-parts/FormLoadingState';

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
						{step === 2 && (
							<Step2 form={form} onChange={onChange} onNext={onGoToStep} onBack={onGoToStep} />
						)}
						{step === 3 && (
							<Step3 form={form} onChange={onChange} onNext={onGoToStep} onBack={onGoToStep} />
						)}
						{step === 4 && (
							<Step4 form={form} onChange={onChange} onNext={onGoToStep} onBack={onGoToStep} />
						)}
						{step === 5 && (
							<Step5
								form={form}
								submitError={submitError}
								submitting={submitting}
								onChange={onChange}
								onBack={onGoToStep}
								onSubmit={onSubmit}
							/>
						)}
					</StepWrapper>
				)}
			</AnimatePresence>
		</div>
	);
}
