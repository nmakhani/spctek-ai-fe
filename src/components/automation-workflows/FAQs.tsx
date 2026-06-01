import GenericFAQs from '../generic-sections/FAQs';

const faqs = [
	{
		question: 'What kind of businesses are these automation systems built for?',
		answer:
			'These systems are designed for SMBs, marketing agencies, sales teams, and growing businesses that run recurring manual operations like reporting, campaign management, proposals, and client delivery.',
	},
	{
		question: 'Do I need technical knowledge to implement these workflows?',
		answer:
			'No deep technical expertise is required. The plug-and-play templates are built for fast adoption, and SPCTEK.AI provides implementation support beyond the initial setup so your team can get running quickly.',
	},
	{
		question: 'Which tools and platforms do these systems integrate with?',
		answer:
			'The workflows connect with widely used business tools, including HubSpot, Slack, Google Sheets, Gmail, Meta Ads, Google Ads, Klaviyo, Zoho, Jira, Hunter.io, and more.',
	},
	{
		question: 'Can I request a workflow built specifically for my business process?',
		answer:
			"Yes. Beyond ready-made systems, SPCTEK.AI builds custom automation workflows tailored to specific business processes that are hurting your team's productivity.",
	},
	{
		question: 'What happens if an automation breaks or something goes wrong mid-workflow?',
		answer:
			'The systems are designed with built-in error handling. They can automatically retry failed tasks, trigger alerts, or follow fallback steps to keep operations running without manual intervention.',
	},
	{
		question: 'How is sensitive business data and credential information kept secure?',
		answer:
			"API keys, tokens, and third-party tool connections are managed through structured access controls. Every system also includes built-in approval and review steps, so nothing goes live without your team's sign-off.",
	},
];

export default function FAQs() {
	return <GenericFAQs faqs={faqs} />;
}
