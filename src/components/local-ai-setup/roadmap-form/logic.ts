import { HARDWARE_TIERS } from './data';
import type { ArchitectureRecommendation, FormData, HardwareTierOption, ModelGroup } from './types';

const TIER_BY_SCORE: Array<{ max: number; id: string }> = [
	{ max: 3, id: 'starter' },
	{ max: 6, id: 'professional' },
	{ max: 9, id: 'performance' },
	{ max: Number.POSITIVE_INFINITY, id: 'enterprise' },
];

const scoreUseCases = (useCases: string[]) => {
	let score = 0;

	for (const useCase of useCases) {
		switch (useCase) {
			case 'docs':
			case 'customer':
			case 'workflow':
				score += 1;
				break;
			case 'code':
				score += 2;
				break;
			case 'data':
				score += 3;
				break;
			default:
				score += 1;
		}
	}

	return score;
};

const scoreTeam = (teamSize: string) => {
	if (teamSize === '20+') return 3;
	if (teamSize === '6-20') return 2;
	return 1;
};

const scoreDataSensitivity = (dataSensitivity: string) => {
	if (dataSensitivity === 'regulated') return 2;
	if (dataSensitivity === 'high') return 1;
	return 0;
};

const scoreDeploymentModel = (deploymentModel: string) => {
	if (deploymentModel === 'Hybrid') return 2;
	if (deploymentModel === 'On-premises' || deploymentModel === 'Private cloud') return 1;
	return 0;
};

const selectTier = (score: number): HardwareTierOption => {
	const tierId = TIER_BY_SCORE.find((entry) => score <= entry.max)?.id ?? 'professional';
	return HARDWARE_TIERS.find((tier) => tier.id === tierId) ?? HARDWARE_TIERS[1];
};

const getModelGroups = (tierId: string): ModelGroup[] => {
	if (tierId === 'starter') {
		return [
			{
				modality: 'Text',
				models: ['Mistral-7B-Instruct-v0.3', 'Qwen2.5-7B-Instruct', 'Phi-3.5-mini-instruct'],
				notes: 'Quantized 4-bit variants run well on 8-12GB VRAM for local assistants.',
			},
			{
				modality: 'Vision',
				models: ['Llava-v1.6-7B', 'MiniCPM-V 2.6'],
				notes: 'Good for basic image understanding and screenshot/document parsing.',
			},
			{
				modality: 'Image',
				models: ['Stable Diffusion XL Base 1.0', 'FLUX.1-schnell'],
				notes: 'Use CPU offload or low-step generation for constrained VRAM setups.',
			},
			{
				modality: 'Audio',
				models: ['Whisper-small', 'Whisper-medium'],
				notes: 'Reliable speech-to-text for internal meetings and support transcripts.',
			},
		];
	}

	if (tierId === 'professional') {
		return [
			{
				modality: 'Text',
				models: ['Llama 3.1 8B Instruct', 'Qwen2.5-14B-Instruct', 'Mistral Nemo Instruct'],
				notes: 'Strong quality/performance balance for daily production workloads.',
			},
			{
				modality: 'Vision',
				models: ['Llama 3.2 11B Vision Instruct', 'Llava-v1.6-13B'],
				notes: 'Useful for image QA, visual support workflows, and dashboard analysis.',
			},
			{
				modality: 'Image',
				models: ['Stable Diffusion XL Base 1.0 + Refiner', 'FLUX.1-schnell'],
				notes: 'High-quality creative generation with better prompt adherence.',
			},
			{
				modality: 'Audio',
				models: ['Whisper-large-v3', 'Distil-Whisper large v3'],
				notes: 'Higher accuracy transcription at practical latency.',
			},
		];
	}

	if (tierId === 'performance') {
		return [
			{
				modality: 'Text',
				models: [
					'Llama 3.1 70B Instruct (quantized)',
					'Qwen2.5-32B-Instruct',
					'Mixtral-8x22B-Instruct',
				],
				notes: 'For advanced reasoning, larger context, and higher simultaneous users.',
			},
			{
				modality: 'Vision',
				models: ['Llama 3.2 11B Vision Instruct', 'Qwen2-VL-72B-Instruct (quantized)'],
				notes: 'Better visual reasoning and document intelligence quality.',
			},
			{
				modality: 'Image',
				models: ['FLUX.1-dev', 'Stable Diffusion 3.5 Large'],
				notes: 'Best suited for high-fidelity generation and internal design workflows.',
			},
			{
				modality: 'Audio',
				models: ['Whisper-large-v3-turbo', 'NVIDIA NeMo Canary-1B'],
				notes: 'Fast enterprise-grade STT and multilingual support options.',
			},
		];
	}

	return [
		{
			modality: 'Text',
			models: [
				'Llama 3.1 70B Instruct',
				'Qwen2.5-72B-Instruct',
				'DeepSeek-V3 (self-hosted variant)',
			],
			notes: 'Built for strict governance, high throughput, and long-context workflows.',
		},
		{
			modality: 'Vision',
			models: ['Llama 3.2 90B Vision Instruct', 'Qwen2-VL-72B-Instruct'],
			notes: 'Enterprise-grade multimodal analysis for documents, images, and operations.',
		},
		{
			modality: 'Image',
			models: ['FLUX.1-dev', 'Stable Diffusion 3.5 Large Turbo'],
			notes: 'For higher-resolution generation and heavier creative pipelines.',
		},
		{
			modality: 'Audio',
			models: ['Whisper-large-v3', 'Parakeet RNNT 1.1B'],
			notes: 'High-volume transcription with strong quality and observability options.',
		},
	];
};

export const buildArchitectureRecommendation = (form: FormData): ArchitectureRecommendation => {
	const score =
		scoreUseCases(form.useCases) +
		scoreTeam(form.teamSize) +
		scoreDataSensitivity(form.dataSensitivity) +
		scoreDeploymentModel(form.deploymentModel);

	const tier = selectTier(score);

	return {
		tier,
		reason: `Selected from use-case mix (${form.useCases.length || 1}), team size (${form.teamSize}), sensitivity (${form.dataSensitivity}), and deployment preference (${form.deploymentModel}).`,
		deploymentNote:
			form.dataSensitivity === 'regulated'
				? 'Prioritize private networking, audit logging, encryption-at-rest, and model gateways.'
				: 'Use staged rollout: pilot one workflow, add telemetry, then scale to additional teams.',
		modelGroups: getModelGroups(tier.id),
	};
};
