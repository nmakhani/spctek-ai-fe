'use client';

import { SectionHeading } from '../../ui/SectionHeading';
import PlaybookForm from './PlaybookForm';

export default function PlaybookFormSection() {
	return (
		<section className="font-poppins relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 text-center md:px-6 lg:px-12">
			<SectionHeading size="large">
				Get Your <br />
				<span className="text-[#606bfa]">Custom AI Playbook</span>
			</SectionHeading>

			<p className="mx-auto my-6 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:my-8 md:text-xl lg:text-2xl">
				Get a focused AI playbook built around your real operational gaps, showing what to automate and where AI
				actually works.
			</p>

			<div className="relative z-10 w-full p-2">
				<PlaybookForm />
			</div>
		</section>
	);
}
