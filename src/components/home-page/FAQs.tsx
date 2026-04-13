import GenericFAQs from '../generic-sections/FAQs';

const faqs = [
	{
		question: 'Why focus on fixing processes before implementing AI?',
		answer:
			'AI works best when it is built on clear operational systems. If processes are inefficient or disconnected, AI tools often add complexity rather than improving outcomes.',
	},
	{
		question: 'How do I know if my business is ready for AI?',
		answer:
			'Businesses are usually ready for AI when their workflows, data sources, and operational processes are clearly defined. Our approach helps identify where AI can create a meaningful impact.',
	},
	{
		question: 'What makes SPCTEK different from typical AI agencies?',
		answer:
			'Most providers focus on deploying AI tools. SPCTEK focuses on understanding and improving the underlying systems first, so AI solutions actually deliver measurable results.',
	},
	{
		question: 'Why would a business choose Local AI instead of public AI tools?',
		answer:
			'Local AI allows organizations to maintain full control over their data and eliminate recurring API costs. It allows them to operate AI systems within their own infrastructure without exposing sensitive information to external parties.',
	},
	{
		question: 'Do I need technical expertise to use your AI solutions?',
		answer:
			'No. Our solutions are designed to be accessible for non-technical teams through simple interfaces and guided workflows.',
	},
	{
		question: 'Who are your solutions designed for?',
		answer:
			'SPCTEK works primarily with SMBs that want to adopt AI responsibly, improve operational efficiency, and build systems that scale with their business.',
	},
	{
		question: 'Can you help if we are just starting to explore AI?',
		answer:
			'Yes. Many clients come to us early in their AI journey. We help identify practical use cases and implement solutions that align with real operational needs.',
	},
	{
		question: 'What types of businesses benefit the most from your solutions?',
		answer:
			'Businesses with complex workflows, multiple operational tools, or growing teams benefit the most from improved systems, automation, and secure AI deployment.',
	},
];

export default function FAQs() {
	return <GenericFAQs faqs={faqs} />;
}
