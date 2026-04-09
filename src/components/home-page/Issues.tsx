'use client';

import Image from 'next/image';

import { GlassNumber } from '../ui/GlassNumber';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

const issuesList = [
	{ number: '1', title: 'Disconnected Tools' },
	{ number: '2', title: 'Operational Blind Spots' },
	{ number: '3', title: 'Decision Paralysis' },
	{ number: '4', title: 'AI Adoption Confusion' },
	{ number: '5', title: 'AI Security Risks' },
	{ number: '6', title: 'Fragmented Solutions' },
];

export default function Issues() {
	return (
		<section className="font-poppins px-6 md:px-12">
			<div className="mx-auto max-w-5xl">
				<SectionHeading size="large">
					Are These Issues Holding Your
					<br className="hidden md:block" /> <span className="text-[#a0a6fc]">Business</span> Back?
				</SectionHeading>

				<div className="mt-16 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
					<div className="flex flex-col items-start">
						<div className="divide-white/2 w-full max-w-[280px] divide-y md:max-w-[340px]">
							{issuesList.map((issue, idx) => (
								<div key={idx} className="flex items-center gap-4 py-4 transition-all duration-300">
									<GlassNumber number={issue.number} />
									<span className="text-lg font-medium tracking-tight text-white/90">
										{issue.title}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="relative flex items-center justify-center">
						<div className="bobbing-image relative flex w-full justify-center">
							<Image
								width={500}
								height={400}
								src="/home-page/ai-robot.png"
								alt="3D AI Robot Illustration"
								className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
							/>
						</div>
					</div>
				</div>

				<div className="mt-24 flex flex-col items-center text-center">
					<p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-white/60">
						If these sound familiar, it&apos;s time to fix how your business operates
						<span className="text-white"> rather than just adding more tools.</span>
					</p>
					<PrimaryButton href="/#contact">Get a Free Operations Assessment</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
