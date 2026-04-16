import Image from 'next/image';

import { SectionHeading } from '../ui/SectionHeading';

export default function Approach() {
	return (
		<section className="font-poppins overflow-hidden px-4 text-white md:px-6 lg:px-12">
			<div className="mx-auto max-w-6xl">
				<div className="relative">
					<div className="mx-auto mb-10 max-w-6xl text-center md:mb-12 lg:mb-16">
						<SectionHeading size="large">
							Our <span className="text-[#606bfa]">Approach</span>
						</SectionHeading>
						<p className="text-gray-300 mt-5 text-base font-light leading-relaxed sm:text-lg md:mt-6 md:text-xl lg:text-2xl">
							At SPCTEK.AI, we follow a simple and execution-focused method:
						</p>
					</div>

					<div className="relative mx-auto w-full max-w-5xl">
						<Image
							src="/about/approach.png"
							alt="Our Approach"
							width={1200}
							height={800}
							priority
							className="h-auto w-full object-contain"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
