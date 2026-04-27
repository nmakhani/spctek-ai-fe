import Image from 'next/image';

import { SectionDivider } from '@/components/ui/SectionDivider';
import { GlowBackground } from '../ui/GlowBackground';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function OperationalFramework() {
	const paragraphStyles =
		'mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-white sm:text-lg md:mt-6 md:text-[1.15rem] lg:mt-8 lg:text-[1.25rem]';

	return (
		<section className="font-poppins overflow-hidden px-4 text-white md:px-6 lg:px-12">
			<GlowBackground
				style={{
					top: '35%',
					left: '55%',
					width: '100%',
					height: '5%',
					background: 'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.72) 0%, transparent 100%)',
					transform: 'translate(-50%, -50%) rotate(-40deg) scale(1.25)',
					filter: 'blur(100px)',
					opacity: 0.8,
				}}
			/>

			<div className="mx-auto max-w-6xl">
				<div className="mx-auto mb-10 max-w-4xl text-center md:mb-12 lg:mb-16">
					<SectionHeading size="large">
						We Fix Your Operations First So <br />
						<span className="text-[#606bfa]">AI Automation</span> <br className="md:hidden" /> Actually Works
					</SectionHeading>

					<p className={paragraphStyles}>
						Most agencies try to implement AI on top of broken operations, creating more chaos than clarity. We fix the
						operations first.
					</p>
				</div>

				<SectionDivider />

				<div className="relative">
					<div className="mx-auto mb-10 max-w-4xl text-center md:mb-12 lg:mb-16">
						<SectionHeading size="large">
							The <span className="text-[#606bfa]">Spctek</span> Operational <br className="md:hidden" /> Intelligence
							Framework
						</SectionHeading>
						<p className={paragraphStyles}>
							Our Operational Intelligence Framework focuses on building strong operational systems first, ensuring that
							AI automation delivers real impact rather than adding complexity.
						</p>
					</div>

					{/* Framework Image & Overlays */}
					<div className="relative mx-auto hidden w-full max-w-5xl overflow-hidden p-2 sm:p-3 md:block">
						<Image
							src="/home-page/framework.png"
							alt="Operational Framework"
							width={1200}
							height={800}
							priority
							className="h-auto w-full rounded-xl object-cover"
						/>
					</div>

					{/* Mobile Fallback */}
					<div className="mt-10 space-y-6 px-2 md:hidden">
						{[
							{
								t: 'Diagnose Operational Gaps',
								d: 'We analyze how your business actually operates and identify inefficiencies.',
							},
							{
								t: 'Structure the Systems',
								d: 'We design operational systems that connect your data and workflows.',
							},
							{
								t: 'Automate the Workflows',
								d: 'We introduce automation to remove repetitive tasks.',
							},
							{
								t: 'Apply Practical AI',
								d: 'We deploy secure AI systems and intelligent tools.',
							},
						].map((item, i) => (
							<div key={i} className="border-l-2 border-[#606bfa] pl-4">
								<h4 className="font-bold text-[#606bfa]">
									{i + 1}. {item.t}
								</h4>
								<p className="mt-1 text-sm leading-relaxed text-white opacity-80">{item.d}</p>
							</div>
						))}
					</div>
				</div>

				{/* CTA Button */}
				<div className="flex justify-center">
					<PrimaryButton href="/contact">Talk to an Automation Expert</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
