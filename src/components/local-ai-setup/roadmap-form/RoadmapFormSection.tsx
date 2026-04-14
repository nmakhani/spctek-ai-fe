'use client';

import RoadmapForm from './RoadmapForm';

import { SectionHeading } from '../../ui/SectionHeading';

export default function RoadmapFormSection() {
	return (
		<section className="font-poppins relative mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center md:px-12">
			<SectionHeading size="large">
				Get Your Instant Private <br />
				<span className="text-[#606bfa]">AI Deployment Roadmap</span>
			</SectionHeading>

			<p className="mx-auto my-8 max-w-3xl text-xl font-light leading-relaxed text-white md:text-2xl">
				Tell us your requirements, and we&apos;ll instantly map out the ideal local AI setup for your business.
			</p>

			<div className="relative z-10 w-full p-2">
				<RoadmapForm />
			</div>
		</section>
	);
}
