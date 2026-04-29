'use client';

import EmbeddedContactForm from '../../ui/form-parts/EmbeddedContactForm';
import { GlassGlow } from '../../ui/GlassGlow';
import { GradientBorder } from '../../ui/GradientBorder';
import type { ArchitectureRecommendation, FormData } from './types';

type ResultsStateProps = {
	recommendation: ArchitectureRecommendation;
	formData: FormData;
};

const loremIpsumText = 'Lorem ipsum dolor sit amet.';

export default function ResultsState({ recommendation, formData }: ResultsStateProps) {
	return (
		<div className="flex flex-col gap-10 text-left">
			<div className="flex flex-col gap-3 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
				<div>
					<p className="text-gray-400 mb-1 text-xs font-bold uppercase tracking-widest">Recommended Architecture</p>
					<h3 className="text-2xl font-bold text-[#606bfa] md:text-3xl">{recommendation.tier.label} Tier</h3>
				</div>
				<div className="rounded-xl border border-white px-4 py-3 text-sm text-white">{recommendation.tier.specs}</div>
			</div>

			<div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
				<p className="text-sm font-semibold text-white">Why this tier</p>
				<p className="text-gray-400 mt-2 text-sm leading-relaxed">{recommendation.reason}</p>
				<p className="text-indigo-200 mt-2 text-sm leading-relaxed">{recommendation.deploymentNote}</p>
			</div>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				{recommendation.modelGroups.map((group) => (
					<div key={group.modality} className="group relative z-10 w-full">
						<GradientBorder thickness={1.5} radius="16px" />
						<GlassGlow angle={105} opacity={0.5} start={10} end={90} radius="16px" />
						<div className="relative overflow-hidden rounded-[15px] p-5">
							<p className="text-xs font-bold uppercase tracking-widest text-[#606bfa]">{group.modality}</p>
							<ul className="mt-3 space-y-2">
								{group.models.map((_, index) => {
									return (
										<li key={index} className="select-none text-sm text-white blur-sm">
											• {loremIpsumText}
										</li>
									);
								})}
							</ul>
							<p className="text-gray-400 mt-3 text-xs leading-relaxed">{group.notes}</p>
						</div>
					</div>
				))}
			</div>

			<EmbeddedContactForm
				formData={formData}
				source="ai_deployment_roadmap"
				message={`AI Deployment Roadmap — Use Cases: ${formData.useCases.join(', ')} | Team Size: ${formData.teamSize} | Data Sensitivity: ${formData.dataSensitivity} | Deployment Model: ${formData.deploymentModel} | Recommended Tier: ${recommendation.tier.label} | Current Stack: ${formData.currentStack || 'N/A'}`}
				journeyData={{
					...formData,
					recommendation,
				}}
				title="Get your full roadmap via email"
				subtitle="Enter your details to receive your complete AI deployment architecture recommendation."
				buttonText="Get My Full Roadmap →"
				successMessage="Your submission has been recorded. You will receive the full plan on your email."
			/>
		</div>
	);
}
