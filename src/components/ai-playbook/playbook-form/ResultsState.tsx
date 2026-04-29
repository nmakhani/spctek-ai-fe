'use client';

import EmbeddedContactForm from '../../ui/form-parts/EmbeddedContactForm';
import type { FormData, PlaybookRecommendation } from './types';

type ResultsStateProps = {
	recommendation: PlaybookRecommendation | null;
	formData: FormData;
};

export default function ResultsState({ recommendation, formData }: ResultsStateProps) {
	if (!recommendation) return null;

	return (
		<div className="flex flex-col gap-10 text-center">
			<div className="mx-auto mt-2 max-w-2xl">
				<div className="flex flex-col items-center gap-4 rounded-[23px]">
					<h2 className="text-3xl font-bold text-white">{recommendation.title}</h2>
					<p className="text-gray-300 text-lg leading-relaxed">{recommendation.message}</p>
				</div>
			</div>

			<EmbeddedContactForm
				formData={formData}
				source="ai_playbook"
				message={`AI Playbook — Business Type: ${formData.businessType} | Revenue Range: ${formData.revenueRange} | Playbook Focus: ${formData.playbookFocus} | Operational Challenge: ${formData.operationalChallenge} | Urgency: ${formData.urgency}`}
				journeyData={{
					...formData,
					recommendation,
				}}
				title="Get your full playbook via email"
				subtitle="Enter your details to receive your personalized AI automation playbook."
				buttonText="Get My Full Playbook →"
				successMessage="Your submission has been recorded. You will receive the full playbook on your email."
			/>
		</div>
	);
}
