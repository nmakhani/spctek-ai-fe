export type FormData = {
	motive: string;
	teamSize: string;
	industry: string;
	sopLocation: string;
	decisionMaking: string;
	onboardingTime: string;
	toolIntegration: string;
	founderBottleneck: string;
	customerComms: string;
	brokenProcess: string;
	timeWasted: string;
	triedToFix: string;
	name: string;
	email: string;
	company: string;
};

export type Step = 1 | 2 | 3 | 4 | 5;
export type Phase = 'form' | 'loading' | 'results';

export type Category = {
	label: string;
	color: string;
	border: string;
	glow: string;
	desc: string;
};

export type Pointer = {
	title: string;
	body: string;
	cost: string;
	accent: string;
	costColor: string;
};

export const INITIAL_FORM_DATA: FormData = {
	motive: 'Scaling without burnout',
	teamSize: 'Solo',
	industry: 'eCommerce',
	sopLocation: 'Heads',
	decisionMaking: 'Founder',
	onboardingTime: 'Long',
	toolIntegration: 'Manual',
	founderBottleneck: 'Everything',
	customerComms: 'Manual',
	brokenProcess: '',
	timeWasted: '5-10',
	triedToFix: 'Never',
	name: '',
	email: '',
	company: '',
};
