'use client';

import { GlassGlow } from '../../ui/GlassGlow';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { GradientBorder } from '../../ui/GradientBorder';
import type { ArchitectureRecommendation } from './types';

type ResultsStateProps = {
	recommendation: ArchitectureRecommendation;
};

export default function ResultsState({ recommendation }: ResultsStateProps) {
	return (
		<div className="flex flex-col gap-10 text-left">
			<div className="flex flex-col gap-3 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
				<div>
					<p className="text-gray-400 mb-1 text-xs font-bold uppercase tracking-widest">
						Recommended Architecture
					</p>
					<h3 className="text-2xl font-bold text-white md:text-3xl">
						{recommendation.tier.label} Tier
					</h3>
				</div>
				<div className="text-indigo-100 rounded-xl border border-[#606bfa]/25 bg-[#606bfa]/10 px-4 py-3 text-sm">
					{recommendation.tier.specs}
				</div>
			</div>

			<div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
				<p className="text-sm font-semibold text-white">Why this tier</p>
				<p className="text-gray-400 mt-2 text-sm leading-relaxed">{recommendation.reason}</p>
				<p className="text-indigo-200 mt-2 text-sm leading-relaxed">
					{recommendation.deploymentNote}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				{recommendation.modelGroups.map((group) => (
					<div key={group.modality} className="group relative z-10 w-full">
						<GradientBorder thickness={1} radius="16px" subtle={true} />
						<GlassGlow angle={105} opacity={0.35} start={5} end={95} radius="16px" />
						<div className="relative overflow-hidden rounded-[15px] bg-[#0A0E17]/80 p-5 backdrop-blur-sm">
							<p className="text-xs font-bold uppercase tracking-widest text-[#606bfa]">
								{group.modality}
							</p>
							<ul className="mt-3 space-y-2">
								{group.models.map((model) => (
									<li key={model} className="text-sm text-white">
										• {model}
									</li>
								))}
							</ul>
							<p className="text-gray-400 mt-3 text-xs leading-relaxed">{group.notes}</p>
						</div>
					</div>
				))}
			</div>

			<div className="relative z-10 mt-2 text-center">
				<GlassGlow angle={120} opacity={0.35} start={20} end={80} radius="24px" />
				<div className="relative flex flex-col items-center gap-4 rounded-[23px] bg-white/[0.03] p-8 backdrop-blur-xl">
					<p className="text-2xl font-bold text-white">Ready to implement this roadmap?</p>
					<p className="text-gray-400 max-w-lg text-sm leading-relaxed">
						We can turn this architecture into a concrete rollout plan with stack choices, security
						controls, and deployment milestones.
					</p>
					<PrimaryButton href="/contact">Book My Deployment Call</PrimaryButton>
				</div>
			</div>
		</div>
	);
}
