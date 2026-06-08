import CalendlyButton from '../ui/CalendlyButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function AiPowered() {
	return (
		<section className="font-poppins relative overflow-hidden px-4 md:px-6 lg:px-12" id="ai-playbook">
			<div className="mx-auto max-w-4xl text-center">
				<SectionHeading size="large">
					Make Your Business <span className="text-[#606bfa]">AI-Powered</span> Without Compromising Security
				</SectionHeading>

				<p className="mx-auto mt-5 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:mt-8 md:text-xl lg:text-2xl">
					We&apos;ll assess your needs and design a secure, scalable Local AI system for your business requirements.
				</p>

				<div className="flex justify-center">
					<CalendlyButton>Book a Free Consultation</CalendlyButton>
				</div>
			</div>
		</section>
	);
}
