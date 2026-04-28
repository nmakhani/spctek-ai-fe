'use client';

import { GlassGlow } from '../ui/GlassGlow';
import { GlassNumber } from '../ui/GlassNumber';
import { GradientBorder } from '../ui/GradientBorder';
import { SectionHeading } from '../ui/SectionHeading';

const break_points = [
	{
		number: '1',
		title: 'Disconnected Data Systems',
		text: 'Your data lives in different tools, but nothing connects. You are forced to piece together insights manually and still do not fully trust the numbers.',
	},
	{
		number: '2',
		title: 'Unstructured Onboarding Process',
		text: 'Every new client feels like starting from scratch with scattered documents, repeated questions, and delays before real work begins.',
	},
	{
		number: '3',
		title: 'Unclear AI Adoption',
		text: 'You know AI can help, but you are unsure where to apply it, which tools to trust or how to integrate it into real workflows.',
	},
	{
		number: '4',
		title: 'Uncontrolled Scope Management',
		text: 'Projects expand beyond the original agreement with extra revisions, untracked tasks, and no clear system to control or bill for them.',
	},
	{
		number: '5',
		title: 'Weak Product Launch Process',
		text: 'Launching feels reactive, with unclear demand, poor coordination, and no structured way to track what is working.',
	},
	{
		number: '6',
		title: 'Non-Predictive Inventory System',
		text: 'You are either overstocked or out of stock with no reliable way to predict demand or align supply with sales patterns.',
	},
];

export default function Breaks() {
	return (
		<section className="font-poppins px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-5xl">
				<SectionHeading size="large">
					Where Your{' '}
					<span className="text-[#606bfa]">
						{' '}
						Processes Break <br /> and AI
					</span>{' '}
					Should Step In
				</SectionHeading>

				<div className="mt-10 w-full md:mt-12 lg:mt-16">
					<div className="flex flex-col gap-6">
						{break_points.map((item, idx) => (
							<div
								key={idx}
								className="relative flex items-start gap-4 px-4 py-4 transition-all duration-300 sm:items-center sm:gap-6 sm:px-6 md:px-8"
							>
								<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="12px" />
								<GradientBorder thickness={1} radius="12px" />
								<GlassNumber number={item.number} size="md" />

								<div className="flex flex-col">
									<p className="text-lg font-medium tracking-tight text-white sm:text-xl lg:text-[24px]">
										{item.title}
									</p>
									<p className="text-base font-light leading-relaxed text-white sm:text-lg lg:text-[20px]">
										{item.text}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
