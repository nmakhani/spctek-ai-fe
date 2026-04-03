"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

import { SectionHeading } from "../ui/SectionHeading";

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
        <h3
          className={`font-heading text-[1.05rem] leading-[1.25] transition-colors md:text-[1.8rem] ${
            isOpen ? "text-[#606bfa]" : "text-white"
          }`}
        >
          {question}
        </h3>
        <span
          className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
            isOpen
              ? "border-[#9fb0ff] bg-[#606bfa] text-white"
              : "border-white/80 text-white"
          }`}
        >
          {isOpen ? (
            <X size={14} strokeWidth={2.5} />
          ) : (
            <Plus size={14} strokeWidth={2.5} />
          )}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-56 pb-6" : "max-h-0"
        }`}
      >
        <p className="max-w-5xl font-poppins text-sm leading-[1.5] text-white/90 md:text-lg">
          {answer}
        </p>
      </div>
    </div>
  );
};

const faqs = [
  {
    question: "Why focus on fixing processes before implementing AI?",
    answer:
      "AI works best when it is built on clear operational systems. If processes are inefficient or disconnected, AI tools often add complexity rather than improving outcomes.",
  },
  {
    question: "How do I know if my business is ready for AI?",
    answer:
      "Businesses are usually ready for AI when their workflows, data sources, and operational processes are clearly defined. Our approach helps identify where AI can create a meaningful impact.",
  },
  {
    question: "What makes SPCTEK different from typical AI agencies?",
    answer:
      "Most providers focus on deploying AI tools. SPCTEK focuses on understanding and improving the underlying systems first, so AI solutions actually deliver measurable results.",
  },
  {
    question:
      "Why would a business choose Local AI instead of public AI tools?",
    answer:
      "Local AI allows organizations to maintain full control over their data and eliminate recurring API costs. It allows them to operate AI systems within their own infrastructure without exposing sensitive information to external parties.",
  },
  {
    question: "Do I need technical expertise to use your AI solutions?",
    answer:
      "No. Our solutions are designed to be accessible for non-technical teams through simple interfaces and guided workflows.",
  },
  {
    question: "Who are your solutions designed for?",
    answer:
      "SPCTEK works primarily with SMBs that want to adopt AI responsibly, improve operational efficiency, and build systems that scale with their business.",
  },
  {
    question: "Can you help if we are just starting to explore AI?",
    answer:
      "Yes. Many clients come to us early in their AI journey. We help identify practical use cases and implement solutions that align with real operational needs.",
  },
  {
    question: "What types of businesses benefit the most from your solutions?",
    answer:
      "Businesses with complex workflows, multiple operational tools, or growing teams benefit the most from improved systems, automation, and secure AI deployment.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 font-poppins pb-36"
      id="faq"
    >
      <div className="relative mx-auto max-w-6xl font-poppins">
        <div className="mb-8 text-center md:mb-10">
          <SectionHeading size="large">
            Frequently Asked Questions
          </SectionHeading>
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
