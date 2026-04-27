'use client';

import Image from 'next/image';

import { GlassNumber } from '../ui/GlassNumber';
import { GlowBackground } from '../ui/GlowBackground';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

const issuesList = [
	{ number: '1', title: 'Waste time with manual assessment & chasing experts' },
	{ number: '2', title: 'Submit appeals without understanding the root cause' },
	{ number: '3', title: 'Use generic templates that get rejected' },
	{ number: '4', title: 'Waste days waiting for unclear guidance' },
	{ number: '5', title: 'Make mistakes that reduce reinstatement chances' },
];

export default function AccountRisk() {
	return (
		<section className="font-poppins px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-5xl">
				<SectionHeading size="large">
					Don&apos;t Risk Your Account <br /> With <span className="text-[#606bfa]">Delays and Wrong</span> Appeals
				</SectionHeading>

				<p className="mx-auto mt-6 max-w-3xl text-center text-base font-normal leading-relaxed text-white sm:text-lg md:mt-8 md:text-xl">
					When your Amazon account gets suspended, every decision matters. It can take 5-7 days to assess if your case
					is worth pursuing, and most sellers:
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
						<div className="bobbing-image relative flex w-full max-w-[360px] justify-center sm:max-w-[460px] md:max-w-[560px] lg:min-w-[600px] lg:max-w-none">
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
								alt="Folder of Files Image"
								src="/reinstatement/files.png"
								className="h-auto w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
							/>
						</div>
					</div>
				</div>

				<div className="mt-10 flex flex-col items-center text-center md:mt-12 lg:mt-16">
					<p className="mx-auto max-w-xl text-base font-light leading-relaxed text-white sm:text-lg">
						One wrong move can delay recovery or permanently damage your account.
					</p>
					<PrimaryButton href="#free-assessment">Get My Reinstatement Report</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
