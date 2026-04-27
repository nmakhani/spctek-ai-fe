'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

import { GlowBackground } from '../ui/GlowBackground';
import { SectionHeading } from '../ui/SectionHeading';

export type FAQEntry = {
	question: string;
	answer: string;
};

type FAQsProps = {
	faqs: FAQEntry[];
	title?: string;
	id?: string;
	initialOpenIndex?: number | null;
};

interface FAQItemProps {
	question: string;
	answer: string;
	isOpen: boolean;
	onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
	return (
		<div className="border-b border-white/60">
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
				className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-56 pb-6' : 'max-h-0'}`}
			>
				<p className="font-poppins max-w-5xl text-sm leading-[1.5] text-white/90 md:text-lg">{answer}</p>
			</div>
		</div>
	);
};

export default function FAQs({
	faqs,
	title = 'Frequently Asked Questions',
	id = 'faq',
	initialOpenIndex = 0,
}: FAQsProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);

	const handleToggle = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="font-poppins relative px-6 md:px-12" id={id}>
			<GlowBackground
				style={{
					top: '15%',
					left: '60%',
					width: '110%',
					height: '110%',
					background: 'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.72) 0%, transparent 100%)',
					transform: 'translate(-50%, -50%) rotate(-30deg) scale(1.25)',
					filter: 'blur(100px)',
					opacity: 0.8,
				}}
			/>

			<div className="font-poppins relative mx-auto max-w-6xl">
				<div className="mb-8 text-center md:mb-10">
					<SectionHeading size="large">{title}</SectionHeading>
				</div>

				<div className="mt-8">
					{faqs.map((faq, index) => (
						<FAQItem
							key={index}
							question={faq.question}
							answer={faq.answer}
							isOpen={openIndex === index}
							onClick={() => handleToggle(index)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
