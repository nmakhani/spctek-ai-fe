import Image from 'next/image';

import { GlowBackground } from '../ui/GlowBackground';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function StandOut() {
	return (
		<section className="font-poppins relative overflow-hidden px-4 text-white md:px-6 lg:px-12">
			<GlowBackground
				style={{
					top: '46%',
					left: '52%',
					width: '90%',
					height: '8%',
					background: 'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.62) 0%, transparent 100%)',
					transform: 'translate(-50%, -50%) rotate(-34deg) scale(1.2)',
					filter: 'blur(100px)',
					opacity: 0.75,
				}}
			/>

			<div className="mx-auto max-w-6xl">
				<div className="mx-auto mb-10 max-w-4xl text-center md:mb-12 lg:mb-14">
					<SectionHeading size="large">
						Why <span className="text-[#606bfa]">SPCTEK.AI Automation Systems</span> Stand Out
					</SectionHeading>

					<p className="mx-auto mt-5 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:mt-6 md:text-xl lg:mt-8 lg:text-2xl">
						Our automation systems are built around real business processes, reliable operations, and scalable growth.
					</p>
				</div>

				<div className="relative mx-auto w-full max-w-5xl overflow-hidden p-2 sm:p-3">
					<Image
						src="/automation-workflows/stand-out.png"
						alt="SPCTEK.AI automation systems overview"
						width={1200}
						height={800}
						className="h-auto w-full rounded-xl object-cover"
					/>
				</div>

				<div className="flex justify-center">
					<PrimaryButton href="/contact">Book a Strategy Call</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
