export type FormData = {
	businessType: string;
	revenueRange: string;
	playbookFocus: string;
	operationalChallenge: string;
	urgency: string;
	name: string;
	email: string;
	phone: string;
	company: string;
};

export type PlaybookRecommendation = {
	title: string;
	message: string;
};

export type Step = 1 | 2 | 3;
export type Phase = 'form' | 'loading' | 'results';

export const TOTAL_STEPS = 3;

export const INITIAL_FORM_DATA: FormData = {
	businessType: 'eCommerce/Digital Marketing',
	revenueRange: 'Less than $100K',
	playbookFocus: '',
	operationalChallenge: '',
	urgency: 'Exploration',
	name: '',
	email: '',
	phone: '',
	company: '',
};
