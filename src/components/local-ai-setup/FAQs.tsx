import GenericFAQs from '../generic-sections/FAQs';

const faqs = [
	{
		question: 'What is private AI, and how is it different from public AI tools?',
		answer:
			'Private AI runs on your own infrastructure instead of third-party platforms. This means your data stays fully under your control, with no external sharing or exposure.',
	},
	{
		question: 'Do you actually deploy the system or just provide a plan?',
		answer:
			'We handle the full deployment. From infrastructure setup to model integration and testing, everything is built and implemented by our team.',
	},
	{
		question: 'Where does the AI system run?',
		answer:
			'It can run on your local servers, private cloud, or dedicated hardware. We recommend the best setup based on your security, scale, and performance needs.',
	},
	{
		question: 'Is my data completely secure?',
		answer:
			'Yes, your data stays within your environment. We design systems with strict security controls, ensuring privacy and compliance at every level.',
	},
	{
		question: 'What can the AI system actually do for my business?',
		answer:
			'It can automate workflows, analyze data, generate content, assist customers, process documents, and support decision-making based on your needs.',
	},
	{
		question: 'How long does deployment take?',
		answer:
			'Most deployments are completed within a few weeks, depending on complexity, integrations, and customization requirements.',
	},
	{
		question: 'Do I need technical expertise to use the system?',
		answer:
			'No, we deliver a ready-to-use system and provide training so your team can easily operate and manage it.',
	},
	{
		question: 'Do you provide support after deployment?',
		answer:
			'Yes, we offer ongoing support, optimization, and upgrades to ensure your AI system continues to perform at its best.',
	},
	{
		question: 'Is this suitable for mid-size teams or only large enterprises?',
		answer:
			'It is suitable for both. We design solutions for mid-size teams and enterprises based on their scale and requirements.',
	},
];

export default function FAQs() {
	return <GenericFAQs faqs={faqs} />;
}
