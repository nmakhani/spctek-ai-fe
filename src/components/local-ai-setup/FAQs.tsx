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
