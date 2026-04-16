'use client';

import { GlassTile } from '../ui/GlassTile';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

type IntelligenceType = {
	title: string;
	description: string;
};

const intelligenceTypes: IntelligenceType[] = [
	{
		title: 'Deep Case Intelligence',
		description: 'Goes beyond detection to analyze root causes, severity, and reinstatement potential.',
	},
	{
		title: 'Structured Viability Assessment',
		description: 'Evaluates your case holistically to generate a clear reinstatement score and path forward.',
	},
	{
		title: 'Amazon-Trained AI Engine',
		description: 'Built on real Amazon policies, suspension codes, and successful appeals data.',
	},
	{
		title: 'Actionable, Outcome-Focused Guidance',
		description: 'Eliminates guesswork with precise insights that improve appeal success and save time.',
	},
];

export default function Intelligence() {
	return (
		<section className="font-poppins relative px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-6xl">
				{/* Header Section */}
				<div className="mx-auto mb-10 max-w-4xl text-center md:mb-12 lg:mb-16">
					<SectionHeading size="large">
						The Intelligence Behind the <br />
						<span className="text-[#606bfa]">Reinstatement Estimator</span>
					</SectionHeading>
					<p className="mx-auto mt-5 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:mt-6 md:text-xl lg:text-2xl">
						The Reinstatement Estimator analyzes your suspension using Amazon-specific data to deliver a clear viability
						score and the smartest path to reinstatement.
					</p>
				</div>

				{/* Business Types Grid */}
				<div className="mx-auto mb-10 grid max-w-[900px] grid-cols-1 gap-5 md:mb-12 md:grid-cols-2 md:gap-6">
					{intelligenceTypes.map((type) => (
						<GlassTile key={type.title} title={type.title} description={type.description} />
					))}
				</div>

				{/* Global CTA Button */}
				<div className="flex justify-center">
					<PrimaryButton href="#free-assessment">Get My Reinstatement Report</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
