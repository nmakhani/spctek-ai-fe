'use client';

import { useEffect, useRef } from 'react';

interface Contact {
	id: string;
	source?: string;
	journey?: Record<string, unknown>;
}

interface JourneyModalProps {
	contact: Contact | null;
	onClose: () => void;
}

export function JourneyModal({ contact, onClose }: JourneyModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		if (contact) {
			document.addEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'hidden';
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
				document.body.style.overflow = '';
			};
		}
	}, [contact, onClose]);

	if (!contact) return null;

	const getSourceLabel = (source?: string) => {
		switch (source) {
			case 'ai_deployment_roadmap':
				return 'AI Deployment Roadmap';
			case 'process_diagnostic':
				return 'Process Diagnostic';
			case 'ai_playbook':
				return 'AI Playbook';
			default:
				return source;
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 pt-24 backdrop-blur-sm">
			<div
				ref={modalRef}
				className="flex max-h-[75vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_46%,rgba(96,107,250,0.12)_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
			>
				<div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/25 px-6 py-4">
					<h3 className="text-lg font-semibold text-white">User Journey - {getSourceLabel(contact.source)}</h3>
					<button
						onClick={onClose}
						className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
					>
						Close
					</button>
				</div>
				<div className="overflow-y-auto p-6">
					{contact.source === 'ai_deployment_roadmap' && contact.journey ? (
						<AiDeploymentRoadmapJourney journey={contact.journey} />
					) : contact.source === 'process_diagnostic' && contact.journey ? (
						<ProcessDiagnosticJourney journey={contact.journey} />
					) : contact.source === 'ai_playbook' && contact.journey ? (
						<AiPlaybookJourney journey={contact.journey} />
					) : (
						<RawJourneyData journey={contact.journey} />
					)}
				</div>
			</div>
		</div>
	);
}

function AiDeploymentRoadmapJourney({ journey }: { journey: Record<string, unknown> }) {
	return (
		<div className="space-y-4">
			<div>
				<h4 className="mb-2 text-sm font-semibold text-white/90">Use Cases</h4>
				<div className="flex flex-wrap gap-2">
					{Array.isArray(journey.useCases) ? (
						journey.useCases.map((uc: string, i: number) => (
							<span
								key={i}
								className="rounded-full border border-[#606bfa]/30 bg-[#606bfa]/20 px-3 py-1 text-sm text-white/80"
							>
								{uc}
							</span>
						))
					) : (
						<span className="text-white/60">—</span>
					)}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<JourneyField label="Team Size" value={journey.teamSize} />
				<JourneyField label="Data Sensitivity" value={journey.dataSensitivity} />
				<JourneyField label="Deployment Model" value={journey.deploymentModel} />
				<JourneyField label="Recommended Tier" value={journey.recommendedTier} />
			</div>
			<JourneyField label="Current Stack" value={journey.currentStack} />
		</div>
	);
}

function ProcessDiagnosticJourney({ journey }: { journey: Record<string, unknown> }) {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<JourneyField label="Motive" value={journey.motive} />
				<JourneyField label="Team Size" value={journey.teamSize} />
				<JourneyField label="Industry" value={journey.industry} />
				<JourneyField label="SOP Location" value={journey.sopLocation} />
				<JourneyField label="Decision Making" value={journey.decisionMaking} />
				<JourneyField label="Onboarding Time" value={journey.onboardingTime} />
				<JourneyField label="Tool Integration" value={journey.toolIntegration} />
				<JourneyField label="Founder Bottleneck" value={journey.founderBottleneck} />
				<JourneyField label="Customer Comms" value={journey.customerComms} />
				<JourneyField label="Time Wasted" value={journey.timeWasted} />
				<JourneyField label="Tried to Fix" value={journey.triedToFix} />
				<JourneyField label="Score" value={journey.score} />
			</div>
			<JourneyField label="Broken Process" value={journey.brokenProcess} />
		</div>
	);
}

function AiPlaybookJourney({ journey }: { journey: Record<string, unknown> }) {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<JourneyField label="Business Type" value={journey.businessType} />
				<JourneyField label="Revenue Range" value={journey.revenueRange} />
				<JourneyField label="Playbook Focus" value={journey.playbookFocus} />
				<JourneyField label="Urgency" value={journey.urgency} />
			</div>
			<JourneyField label="Operational Challenge" value={journey.operationalChallenge} />
		</div>
	);
}

function RawJourneyData({ journey }: { journey: Record<string, unknown> | undefined }) {
	return (
		<div>
			<h4 className="mb-2 text-sm font-semibold text-white/90">Raw Journey Data</h4>
			<pre className="overflow-auto rounded-xl bg-black/30 p-4 text-xs text-white/70">
				{JSON.stringify(journey, null, 2)}
			</pre>
		</div>
	);
}

function JourneyField({ label, value }: { label: string; value: unknown }) {
	return (
		<div>
			<h4 className="mb-1 text-sm font-semibold text-white/90">{label}</h4>
			<p className="text-white/70">{String(value || '—')}</p>
		</div>
	);
}
