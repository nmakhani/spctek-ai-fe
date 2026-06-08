'use client';

import Image from 'next/image';

import { GlassNumber } from '../ui/GlassNumber';
import { GlowBackground } from '../ui/GlowBackground';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

const issuesList = [
	{ number: '1', title: 'Hours lost every week to manual, repetitive tasks' },
	{ number: '2', title: 'Disconnected tools causing errors and delays' },
	{ number: '3', title: "No clear visibility into what's actually slowing things down" },
	{ number: '4', title: 'Bottlenecks that limit team productivity and execution' },
	{ number: '5', title: 'Inefficiencies that compound as you try to scale' },
	{ number: '6', title: 'All tasks need founder approval, causing delays' },
];

export default function Bottlenecks() {
	return (
		<section className="font-poppins px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-5xl">
				<SectionHeading size="large">
					Operational <span className="text-[#606bfa]">Bottlenecks </span>
					Can Quietly <br /> Kill Your Business
				</SectionHeading>

				<p className="mx-auto mt-6 max-w-3xl text-center text-base font-normal leading-relaxed text-white sm:text-lg md:mt-8 md:text-xl">
					Most businesses don&apos;t realize how much time, money, and growth they&apos;re losing to broken processes
					and disconnected systems.
				</p>

				<div className="mt-10 grid grid-cols-1 items-center gap-10 md:mt-12 md:gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
					<div className="flex flex-col items-start">
						<div className="divide-white/2 w-full max-w-[280px] divide-y sm:max-w-[360px] md:max-w-[450px]">
							{issuesList.map((issue, idx) => (
								<div key={idx} className="flex items-center gap-4 py-4 transition-all duration-300">
									<GlassNumber number={issue.number} />
									<span className="text-base font-medium tracking-tight text-white/90 sm:text-lg">{issue.title}</span>
								</div>
							))}
						</div>
					</div>

					<div className="relative flex items-center justify-center">
						<div className="bobbing-image relative flex w-full max-w-[320px] justify-center sm:max-w-[420px] md:max-w-[500px] lg:min-w-[400px] lg:max-w-none">
							<GlowBackground
								style={{
									top: '40%',
									left: '50%',
									width: '90%',
									height: '80%',
									background:
										'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.5) 0%, rgba(96, 107, 250, 0.5) 50%, transparent 80%)',
									transform: 'translate(-50%, -50%) rotate(-55deg) scale(1.2)',
									filter: 'blur(40px)',
								}}
							/>

							<Image
								width={600}
								height={450}
								alt="Declining Graph Image"
								src="/process-rating/decline.png"
								className="h-auto w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center text-center">
					<PrimaryButton href="#process-diagnostic">Rate My Process</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
