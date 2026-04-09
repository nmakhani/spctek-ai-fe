'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

import { SectionHeading } from '../ui/SectionHeading';
import { GlowBackground } from '../ui/GlowBackground';

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

export default function FAQSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section className="font-poppins relative px-6 md:px-12" id="faq">
			<GlowBackground
				style={{
					top: '15%',
					left: '60%',
					width: '110%',
					height: '110%',
					background:
						'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.72) 0%, transparent 100%)',
					transform: 'translate(-50%, -50%) rotate(-30deg) scale(1.25)',
					filter: 'blur(100px)',
					opacity: 0.8,
				}}
			/>

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
