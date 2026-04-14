import type { HardwareTierOption, UseCaseOption } from './types';

export const USE_CASES: UseCaseOption[] = [
	{
		id: 'docs',
		label: 'Document Processing',
		desc: 'Invoices, contracts, reports and internal docs handled locally',
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
				/>
			</svg>
		),
	},
	{
		id: 'customer',
		label: 'Customer Support AI',
		desc: 'Private chat agents that answer customers on your infrastructure',
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
				/>
			</svg>
		),
	},
	{
		id: 'code',
		label: 'Code Assistant',
		desc: 'Private copilots for coding, review and developer support',
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
				/>
			</svg>
		),
	},
	{
		id: 'data',
		label: 'Data Analysis',
		desc: 'Query internal data and visualize insights with natural language',
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
				/>
			</svg>
		),
	},
	{
		id: 'workflow',
		label: 'Workflow Automation',
		desc: 'Route approvals, tasks and follow-ups through AI logic',
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
				/>
				<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		),
	},
];

export const HARDWARE_TIERS: HardwareTierOption[] = [
	{
		id: 'starter',
		label: 'Starter',
		specs: '16-32GB RAM + 8-12GB VRAM',
		capacity: 'Lean copilots, document Q&A, lightweight automation',
		price: 'Lowest hardware cost',
	},
	{
		id: 'professional',
		label: 'Professional',
		specs: '32-64GB RAM + 16-24GB VRAM',
		capacity: 'Production assistants, retrieval-heavy workflows',
		price: 'Best value for most SMB deployments',
	},
	{
		id: 'performance',
		label: 'Performance',
		specs: '64-128GB RAM + 24-48GB VRAM (single/dual GPU)',
		capacity: 'Multimodal workloads and higher concurrency',
		price: 'Best performance / cost ratio',
	},
	{
		id: 'enterprise',
		label: 'Enterprise',
		specs: '128GB+ RAM + Multi-GPU (80GB+ aggregate VRAM)',
		capacity: 'Large-context, high-availability, governed AI platform',
		price: 'Maximum throughput and compliance readiness',
	},
];

export const TEAM_SIZE_OPTIONS = [
	{ value: '1-5', label: '1 - 5', desc: 'Small team' },
	{ value: '6-20', label: '6 - 20', desc: 'Growing' },
	{ value: '20+', label: '20+', desc: 'Organization' },
];

export const DATA_SENSITIVITY_OPTIONS = [
	{ value: 'standard', label: 'Standard', desc: 'General business data' },
	{ value: 'high', label: 'High', desc: 'Customer PII, financials' },
	{ value: 'regulated', label: 'Regulated', desc: 'HIPAA, SOX, etc.' },
];

export const DEPLOYMENT_MODEL_OPTIONS = ['On-premises', 'Private cloud', 'Hybrid', 'Not sure yet'];
