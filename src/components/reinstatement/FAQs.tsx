'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

import { SectionHeading } from '../ui/SectionHeading';

interface FAQItemProps {
	question: string;
	answer: string;
	isOpen: boolean;
	onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
	return (
		<div className="border-b border-white/60" onMouseEnter={onClick}>
			<button
				className="group flex w-full items-start justify-between gap-4 py-4 text-left md:py-5"
				onClick={onClick}
				type="button"
			>
				<p
					className={`text-[1.05rem] font-semibold leading-[1.25] transition-colors md:text-[1.5rem] ${
						isOpen ? 'text-[#606bfa]' : 'text-white'
					}`}
				>
					{question}
				</p>
				<span
					className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
						isOpen ? 'border-[#9fb0ff] bg-[#606bfa] text-white' : 'border-white/80 text-white'
					}`}
				>
					{isOpen ? <X size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
				</span>
			</button>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? 'max-h-56 pb-6' : 'max-h-0'
				}`}
			>
				<p className="font-poppins max-w-5xl text-sm leading-[1.5] text-white/90 md:text-lg">
					{answer}
				</p>
			</div>
		</div>
	);
};

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
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section className="font-poppins relative px-6 md:px-12" id="faq">
			<div className="font-poppins relative mx-auto max-w-6xl">
				<div className="mb-8 text-center md:mb-10">
					<SectionHeading size="large">Frequently Asked Questions</SectionHeading>
				</div>

				<div className="mt-8" onMouseLeave={() => setOpenIndex(null)}>
					{faqs.map((faq, index) => (
						<FAQItem
							key={index}
							question={faq.question}
							answer={faq.answer}
							isOpen={openIndex === index}
							onClick={() => setOpenIndex(index)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
