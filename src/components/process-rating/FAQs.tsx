import GenericFAQs from '../generic-sections/FAQs';

const faqs = [
	{
		question: 'What exactly will I get after completing the assessment?',
		answer:
			"You'll receive a score that rates the efficiency of your operations and highlights the three most critical operational gaps in your current system.",
	},
	{
		question: 'How accurate is this process rating?',
		answer:
			'The rating is built on real operational frameworks designed to identify common patterns across workflows, systems, and team structures.',
	},
	{
		question: 'How long does it take to complete the assessment?',
		answer:
			'Most users complete the assessment in under 2 minutes, and your results are generated instantly.',
	},
	{
		question: 'Is the assessment really free?',
		answer: 'Yes, the process rating is completely free with no credit card required.',
	},
	{
		question: 'Do I need technical knowledge to understand the results?',
		answer:
			'No. The rating is easy to understand, and the operational gap highlights are designed to be clear and actionable for non-technical users.',
	},
	{
		question: 'Can you help implement the recommendations?',
		answer:
			'Yes. If you prefer a "done-for-you" solution, our team can take your diagnostic results and fully implement the necessary systems and automations. This service is managed under a separate scope.',
	},
	{
		question: 'What types of businesses is the diagnostic for?',
		answer:
			'This diagnostic is designed for e-commerce, agencies, SaaS, and service-based businesses looking to improve efficiency and scale operations.',
	},
	{
		question: 'Will my data be secure?',
		answer:
			'Yes, your information is kept strictly private and is used only to generate your personalized report.',
	},
];

export default function FAQs() {
	return <GenericFAQs faqs={faqs} />;
}
