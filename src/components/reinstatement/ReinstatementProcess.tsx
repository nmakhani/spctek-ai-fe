'use client';

import { GlassGlow } from '../ui/GlassGlow';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

type StepCard = {
	number: string;
	title: string;
	description: string;
	points?: string[];
};

const reinstatementSteps: StepCard[] = [
	{
		number: '01',
		title: 'Submit Your Suspension Details',
		description: 'Provide key information about your account and suspension.',
	},
	{
		number: '02',
		title: 'AI Analysis',
		description:
			'Our system evaluates your case based on Amazon policies, suspension categories, and historical outcomes.',
	},
	{
		number: '03',
		title: 'Get Your Assessment',
		description: 'Receive an instant assessment report with:',
		points: [
			'Reinstatement viability',
			'Root cause',
			'Recommended strategy',
			'Priority flag for human review if complexity is high',
		],
	},
];

export default function ReinstatementProcess() {
	return (
		<section className="font-poppins px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-7xl">
				<div className="mx-auto mb-12 max-w-4xl text-center md:mb-14 lg:mb-20">
					<SectionHeading size="large">
						A Smarter and Faster <br />
						Way to Approach <span className="text-[#606bfa]">Reinstatement</span>
					</SectionHeading>
					<p className="mx-auto mt-5 max-w-4xl text-base font-normal leading-relaxed text-white sm:text-lg md:mt-6 md:text-xl">
						Our Reinstatement Estimator analyzes your suspension details and provides a clear, structured evaluation of
						your case. Instead of guessing, you get data-backed insights to guide your next steps.
					</p>
				</div>

				<div className="mb-12 grid grid-cols-1 gap-8 md:mb-14 md:grid-cols-3 lg:mb-16">
					{reinstatementSteps.map((step) => (
						<article
							key={step.number}
							className="group relative flex flex-col items-center rounded-[35px] px-5 pb-8 pt-12 transition-all duration-500 hover:scale-[1.02] sm:px-6 sm:pb-10 sm:pt-14 md:px-8 md:pb-12 md:pt-16"
							style={{
								minHeight: '380px',
								backdropFilter: 'blur(20px)',
								boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
							}}
						>
							<div
								className="pointer-events-none absolute inset-0 rounded-[35px]"
								style={{
									padding: '1px',
									background:
										'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.4) 100%)',
									WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
									WebkitMaskComposite: 'destination-out',
									maskComposite: 'exclude',
								}}
							/>

							<GlassGlow angle={135} opacity={0.6} start={15} end={85} radius="35px" />

							<div
								className="absolute -top-8 left-1/2 z-20 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:-top-9 sm:h-20 sm:w-20 md:-top-10 md:h-24 md:w-24"
								style={{
									background: 'linear-gradient(135deg, #606bfa 0%, #131532 100%)',
								}}
							>
								<span className="text-2xl font-bold tracking-tighter text-white sm:text-3xl md:text-4xl">
									{step.number}
								</span>
							</div>

							<div className="relative z-10 mt-8 flex w-full flex-col text-left sm:mt-9 md:mt-10">
								<h3 className="mb-4 min-h-[56px] text-xl font-bold text-white sm:text-2xl md:mb-6">{step.title}</h3>

								<p className="mb-4 text-base font-light leading-relaxed text-white/70 sm:text-lg md:mb-6">
									{step.description}
								</p>

								{step.points && (
									<ul className="space-y-3">
										{step.points.map((point) => (
											<li key={point} className="flex items-start gap-3 text-sm text-white/70 md:text-base">
												<span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#606bfa]" />
												<span className="leading-snug">{point}</span>
											</li>
										))}
									</ul>
								)}
							</div>
						</article>
					))}
				</div>

				<div className="flex justify-center">
					<PrimaryButton href="#free-assessment">Get My Reinstatement Report</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
