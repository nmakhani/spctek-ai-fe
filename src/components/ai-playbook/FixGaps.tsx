import CalendlyButton from '../ui/CalendlyButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function FixGaps() {
	return (
		<section className="font-poppins relative overflow-hidden px-4 md:px-6 lg:px-12" id="ai-playbook">
			<div className="mx-auto max-w-4xl text-center">
				<SectionHeading size="large">
					Found Gaps? <span className="text-[#606bfa]">Let&apos;s Implement the Fix</span>
				</SectionHeading>

				<p className="mx-auto mt-5 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:mt-8 md:text-xl lg:text-2xl">
					We turn your AI playbook into real workflows and automation systems so your business runs with clarity, speed,
					and less manual effort.
				</p>

				<div className="flex justify-center">
					<CalendlyButton>Book a Free Consultation</CalendlyButton>
				</div>
			</div>
		</section>
	);
}
