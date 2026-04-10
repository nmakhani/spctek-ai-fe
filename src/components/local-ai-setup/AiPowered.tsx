import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function AiPowered() {
	return (
		<section className="font-poppins relative overflow-hidden px-6 md:px-12" id="ai-playbook">
			<div className="mx-auto max-w-4xl text-center">
				<SectionHeading size="large">
					Make Your Business <span className="text-[#606bfa]">AI-Powered</span> Without Compromising
					Security
				</SectionHeading>

				<p className="mx-auto mt-8 max-w-3xl text-xl font-light leading-relaxed text-white md:text-2xl">
					We&apos;ll assess your needs and design a secure, scalable Local AI system for your
					business requirements.
				</p>

				<div className="flex justify-center">
					<PrimaryButton href="/contact">Book a Free Consultation</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
