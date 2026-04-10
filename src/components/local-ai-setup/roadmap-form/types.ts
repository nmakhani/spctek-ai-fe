import type { ReactNode } from 'react';

export type FormData = {
	useCases: string[];
	teamSize: string;
	dataSensitivity: string;
	deploymentModel: string;
	currentStack: string;
	name: string;
	email: string;
	phone: string;
	company: string;
};

export type Step = 1 | 2 | 3;
export type Phase = 'form' | 'loading' | 'results';

export const TOTAL_STEPS = 3;

export type UseCaseOption = {
	id: string;
	label: string;
	desc: string;
	icon: ReactNode;
};

export type HardwareTierOption = {
	id: string;
	label: string;
	specs: string;
	capacity: string;
	price: string;
};

export type ModelGroup = {
	modality: 'Text' | 'Vision' | 'Image' | 'Audio';
	models: string[];
	notes: string;
};

export type ArchitectureRecommendation = {
	tier: HardwareTierOption;
	reason: string;
	deploymentNote: string;
	modelGroups: ModelGroup[];
};

export const INITIAL_FORM_DATA: FormData = {
	useCases: [],
	teamSize: '1-5',
	dataSensitivity: 'high',
	deploymentModel: 'Hybrid',
	currentStack: '',
	name: '',
	email: '',
	phone: '',
	company: '',
};
