'use client';

import { GlassGlow } from '../ui/GlassGlow';
import { GlassNumber } from '../ui/GlassNumber';
import { PrimaryButton } from '../ui/PrimaryButton';
import { GradientBorder } from '../ui/GradientBorder';
import { SectionHeading } from '../ui/SectionHeading';

const benefits = [
	{
		number: '1',
		title: 'Complete Data Privacy',
		text: 'Your data stays within your infrastructure, with zero exposure to external AI providers.',
	},
	{
		number: '2',
		title: 'Full Control & Ownership',
		text: 'No vendor lock-in, no dependency on third-party APIs.',
	},
	{
		number: '3',
		title: 'No Per-Token Costs',
		text: 'Eliminate recurring API fees with open-source models.',
	},
	{
		number: '4',
		title: 'Built-In Security & Access Control',
		text: 'Role-based access and audit logs for governance and compliance.',
	},
	{
		number: '5',
		title: 'Aligned with Your Business',
		text: 'AI trained on your SOPs, workflows, and internal knowledge.',
	},
	{
		number: '6',
		title: 'Scalable & Cost-Efficient',
		text: 'Lower long-term costs as usage grows, with infrastructure you control.',
	},
];

export default function AccountRisk() {
	return (
		<section className="font-poppins px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-5xl">
				<SectionHeading size="large">
					Why You Need to Move Your <br /> Business to
					<span className="text-[#606bfa]"> Local AI</span>
				</SectionHeading>

				<p className="mx-auto mt-6 max-w-3xl text-center text-base font-normal leading-relaxed text-white sm:text-lg md:mt-8">
					Gain full control over your data, reduce costs, and use AI confidently. <br /> No need to rely on public tools
					or risk your sensitive information.
				</p>

				<div className="mt-10 w-full md:mt-12 lg:mt-16">
					<div className="flex flex-col gap-6">
						{benefits.map((item, idx) => (
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

				<div className="mt-12 flex flex-col items-center text-center">
					<PrimaryButton href="#roadmap-form">Get a Free Custom Local AI Plan</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
