import Image from 'next/image';

import { SectionHeading } from '../ui/SectionHeading';

export default function Approach() {
	return (
		<section className="font-poppins overflow-hidden px-6 text-white md:px-12">
			<div className="mx-auto max-w-6xl">
				<div className="relative">
					<div className="mx-auto mb-16 max-w-6xl text-center">
						<SectionHeading size="large">
							Our <span className="text-[#606bfa]">Approach</span>
						</SectionHeading>
						<p className="text-gray-300 mt-8 text-lg font-light leading-relaxed md:text-3xl">
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
