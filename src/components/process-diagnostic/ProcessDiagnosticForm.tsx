'use client';

import { AnimatePresence } from 'framer-motion';

import LoadingState from './LoadingState';
import ProgressBar from './ProgressBar';
import ResultsState from './ResultsState';
import Step1OperationalBaseline from './Step1OperationalBaseline';
import Step2KnowledgeDecision from './Step2KnowledgeDecision';
import Step3FrictionBottlenecks from './Step3FrictionBottlenecks';
import Step4BrokenLink from './Step4BrokenLink';
import Step5Contact from './Step5Contact';
import StepWrapper from './StepWrapper';
import type { Category, FormData, Phase, Pointer, Step } from './types';

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
						<LoadingState message={loadingMessage} />
					</StepWrapper>
				) : phase === 'results' ? (
					<StepWrapper key="results">
						<ResultsState score={score} category={category} pointers={pointers} />
					</StepWrapper>
				) : (
					<StepWrapper key={`step-${step}`}>
						<ProgressBar step={step} />
						{step === 1 && (
							<Step1OperationalBaseline form={form} onChange={onChange} onNext={onGoToStep} />
						)}
						{step === 2 && (
							<Step2KnowledgeDecision
								form={form}
								onChange={onChange}
								onNext={onGoToStep}
								onBack={onGoToStep}
							/>
						)}
						{step === 3 && (
							<Step3FrictionBottlenecks
								form={form}
								onChange={onChange}
								onNext={onGoToStep}
								onBack={onGoToStep}
							/>
						)}
						{step === 4 && (
							<Step4BrokenLink
								form={form}
								onChange={onChange}
								onNext={onGoToStep}
								onBack={onGoToStep}
							/>
						)}
						{step === 5 && (
							<Step5Contact
								form={form}
								score={score}
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
