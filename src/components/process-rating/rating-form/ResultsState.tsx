'use client';

import { motion } from 'framer-motion';

import type { Category, Pointer } from './types';

import { GlassGlow } from '../../ui/GlassGlow';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { GradientBorder } from '../../ui/GradientBorder';

type ResultsStateProps = {
	score: number;
	category: Category;
	pointers: Pointer[];
};

const HeroSection = ({ score, category }: { score: number; category: Category }) => {
	const getScoreColor = (score: number) => {
		const ratio = score / 100;
		const r = Math.round(239 + (96 - 239) * ratio);
		const g = Math.round(68 + (107 - 68) * ratio);
		const b = Math.round(68 + (250 - 68) * ratio);
		return `rgb(${r}, ${g}, ${b})`;
	};

	const dynamicColor = getScoreColor(score);

	return (
		<div className="flex flex-col items-center gap-8 border-b border-white/10 pb-10 md:flex-row md:items-start">
			<div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
				{/* SVG Arc Background */}
				<svg className="absolute h-full w-full -rotate-90 transform">
					<circle
						cx="64"
						cy="64"
						r="58"
						stroke="currentColor"
						strokeWidth="6"
						fill="transparent"
						className="text-white/10"
					/>
					<motion.circle
						cx="64"
						cy="64"
						r="58"
						stroke={dynamicColor}
						strokeWidth="6"
						fill="transparent"
						strokeDasharray="364.4" // Circumference (2 * pi * 58)
						initial={{ strokeDashoffset: 364.4 }}
						animate={{ strokeDashoffset: 364.4 - (364.4 * score) / 100 }}
						transition={{ duration: 1, ease: 'easeOut' }}
						strokeLinecap="round"
					/>
				</svg>

				<motion.span
					className="text-4xl font-extrabold"
					style={{ color: dynamicColor }}
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2, type: 'spring' }}
				>
					{score}
				</motion.span>
			</div>

			<div className="flex h-full flex-col justify-center pt-2 text-center md:text-left">
				<p className="text-gray-400 mb-2 text-sm font-bold uppercase tracking-widest">
					Process Health
				</p>
				<p className="mb-2 text-2xl font-bold md:text-3xl" style={{ color: dynamicColor }}>
					{category.label}
				</p>
				<p className="text-gray-300 max-w-lg text-sm">{category.desc}</p>
			</div>
		</div>
	);
};

const ChallengeCard = ({ pointer, index }: { pointer: Pointer; index: number }) => {
	return (
		<div
			className={`group relative z-10 w-full ${
				index > 0
					? 'pointer-events-none select-none opacity-80 blur-[4px] transition-all duration-300'
					: ''
			}`}
		>
			<GradientBorder thickness={1} radius="16px" subtle={true} />
			<GlassGlow angle={105} opacity={0.3} start={5} end={95} radius="16px" />
			<div className="relative overflow-hidden rounded-[15px] bg-[#0A0E17]/80 backdrop-blur-sm transition-all duration-300 hover:bg-[#111827]/90">
				<div className="absolute bottom-0 left-0 top-0 w-2 bg-gradient-to-b from-[#606bfa] to-[#131532]" />

				<div className="flex flex-col gap-3 p-6 pl-8">
					<h4 className="text-lg font-bold text-white">
						{index + 1}. {pointer.title}
					</h4>
					<p className="text-gray-400 text-sm leading-relaxed">{pointer.body}</p>
					<p className="mt-1 text-sm font-bold text-[#606bfa]">Hidden Cost: {pointer.cost}</p>
				</div>
			</div>
		</div>
	);
};

export default function ResultsState({ score, category, pointers }: ResultsStateProps) {
	pointers = pointers.slice(0, 3);

	return (
		<div className="flex flex-col gap-12 text-left">
			<HeroSection score={score} category={category} />

			{/* Challenges Section */}
			<div className="flex flex-col gap-6">
				<h3 className="mb-2 text-xl font-bold text-white">
					Top {pointers.length} Hidden Challenges Detected:
				</h3>
				<div className="flex flex-col gap-5">
					{pointers.map((pointer, index) => (
						<ChallengeCard key={index} pointer={pointer} index={index} />
					))}
				</div>
			</div>

			{/* Call to Action Section */}
			<div className="relative z-10 mt-6 text-center">
				<GlassGlow angle={120} opacity={0.4} start={20} end={80} radius="24px" />

				<div className="relative flex flex-col items-center gap-4 rounded-[23px] bg-white/[0.03] p-8 backdrop-blur-xl">
					<p className="text-2xl font-bold text-white">Ready to fix these in less than 30 days?</p>
					<p className="text-gray-400 max-w-lg text-sm leading-relaxed">
						We&apos;ll map your entire process landscape and identify which automations give you the
						fastest payback, all in a single 30 minute session.
					</p>
					<PrimaryButton href="/contact">Book My Free Strategy Call</PrimaryButton>
					<p className="text-gray-500 text-xs font-medium">No hard sell. No commitment required.</p>
				</div>
			</div>
		</div>
	);
}
