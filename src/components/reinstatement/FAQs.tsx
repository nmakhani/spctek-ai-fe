'use client';

import GenericFAQs from '../generic-sections/FAQs';

const faqs = [
	{
		question: 'Is the AI assessment really free?',
		answer:
			'Yes. The full AI assessment, including viability score, root cause, and strategy recommendation, is completely free with no credit card required. If you choose to proceed with a fully managed appeal and reinstatement, that is a paid service.',
	},
	{
		question: 'How accurate is the viability score?',
		answer:
			"Our model is trained on Amazon's reinstatement policies, suspension categories, and thousands of historical case outcomes. It correctly identifies high- and low-probability cases and gives a viability percentage score. Complex cases, such as multiple rejections, counterfeit, or Section 3 suspensions, are immediately flagged for human review.",
	},
	{
		question: 'Do you need my Amazon login?',
		answer:
			'No, the AI assessment is based entirely on what you enter in the form. We do not ask for or store your Amazon credentials.',
	},
	{
		question: 'What if my appeal was already rejected?',
		answer:
			"That's useful data. Prior rejection history is factored into the model and often clarifies the real root cause, which is frequently different from what Amazon cited.",
	},
	{
		question: 'What if my case is too complex for the AI?',
		answer:
			'The AI flags complex cases immediately. If your case is flagged, a member of our specialist team will reach out within one business day.',
	},
];

export default function FAQs() {
	return <GenericFAQs faqs={faqs} />;
}
