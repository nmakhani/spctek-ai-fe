export const BUSINESS_TYPES = ['eCommerce/Digital Marketing', 'Agency', 'Other'];

export const REVENUE_RANGES = ['Less than $100K', '$100K – $250K', '$250K – $500K', '$500K – $1M', '$1M+'];

export const PLAYBOOK_FOCUSES: Record<string, { label: string; desc: string }[]> = {
	'eCommerce/Digital Marketing': [
		{ label: 'Fragmented Data', desc: 'No Single Source of Truth' },
		{ label: 'AI Adoption & Use', desc: 'Confusion over how to practically integrate AI tools' },
		{ label: 'Product Launch', desc: 'Guesswork Instead of Strategy' },
		{ label: 'Inventory Management & Forecast', desc: 'No reliable way to predict demand and replenishment' },
	],
	Agency: [
		{ label: 'Fragmented Data', desc: 'Your data lives in different tools, but nothing connects' },
		{ label: 'Client Onboarding', desc: 'Slow, manual, and inconsistent onboarding process' },
		{ label: 'AI Adoption & Use', desc: 'Confusion over how to practically integrate AI tools' },
		{ label: 'Scope Creep', desc: 'Work expands without tracking, profit shrinks' },
	],
	Other: [
		{ label: 'Fragmented Data', desc: 'No Single Source of Truth' },
		{ label: 'AI Adoption & Use', desc: 'Confusion over how to practically integrate AI tools' },
		{ label: 'Product Launch', desc: 'Guesswork Instead of Strategy' },
		{ label: 'Inventory Management & Forecast', desc: 'No reliable way to predict demand and replenishment' },
		{ label: 'Client Onboarding', desc: 'Slow, manual, and inconsistent onboarding process' },
		{ label: 'Scope Creep', desc: 'Work expands without tracking, profit shrinks' },
	],
};

export const URGENCIES = [
	{ label: 'Critical', desc: 'Direct revenue or margin impact' },
	{ label: 'High', desc: 'Time, efficiency, or workflow improvement' },
	{ label: 'Exploration', desc: 'Still evaluating or early-stage' },
];
