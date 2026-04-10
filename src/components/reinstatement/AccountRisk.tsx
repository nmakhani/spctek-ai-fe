'use client';

import Image from 'next/image';

import { GlassNumber } from '../ui/GlassNumber';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';
import { GlowBackground } from '../ui/GlowBackground';

const issuesList = [
	{ number: '1', title: 'Waste time with manual assessment & chasing experts' },
	{ number: '2', title: 'Submit appeals without understanding the root cause' },
	{ number: '3', title: 'Use generic templates that get rejected' },
	{ number: '4', title: 'Waste days waiting for unclear guidance' },
	{ number: '5', title: 'Make mistakes that reduce reinstatement chances' },
];

export default function AccountRisk() {
	return (
		<section className="font-poppins px-6 md:px-12">
			<div className="mx-auto max-w-5xl">
				<SectionHeading size="large">
					Don&apos;t Risk Your Account <br /> With{' '}
					<span className="text-[#606bfa]">Delays and Wrong</span> Appeals
				</SectionHeading>

				<p className="mx-auto mt-8 max-w-3xl text-center text-lg font-normal leading-relaxed text-white md:text-xl">
					When your Amazon account gets suspended, every decision matters. It can take 5-7 days to
					assess if your case is worth pursuing, and most sellers:
				</p>

				<div className="mt-16 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
					<div className="flex flex-col items-start">
						<div className="divide-white/2 w-full max-w-[280px] divide-y md:max-w-[450px]">
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
						<div className="bobbing-image relative flex min-w-[600px] justify-center">
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

				<div className="mt-16 flex flex-col items-center text-center">
					<p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-white">
						One wrong move can delay recovery or permanently damage your account.
					</p>
					<PrimaryButton href="/contact">Get My Reinstatement Report</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
