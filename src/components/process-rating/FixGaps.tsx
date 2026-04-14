import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function FixGaps() {
	return (
		<section className="font-poppins relative overflow-hidden px-6 md:px-12" id="ai-playbook">
			<div className="mx-auto max-w-4xl text-center">
				<SectionHeading size="large">
					Found Gaps? <span className="text-[#606bfa]">Let&apos;s Fix Them</span>
				</SectionHeading>

				<p className="mx-auto mt-8 max-w-3xl text-xl font-light leading-relaxed text-white md:text-2xl">
					We take your diagnostic results and turn them into a fully optimized, automated system. So your business runs
					faster, smoother, and with less manual work.
				</p>

				<div className="flex justify-center">
					<PrimaryButton href="/contact">Book a Free Consultation</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
