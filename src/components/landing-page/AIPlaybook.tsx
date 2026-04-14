import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function AIPlaybook() {
	return (
		<section className="font-poppins relative overflow-hidden px-4 md:px-6 lg:px-12" id="ai-playbook">
			<div className="mx-auto max-w-4xl text-center">
				<SectionHeading size="large">
					Let&apos;s Build Your Custom <br className="hidden md:block" />
					<span className="text-[#606bfa]">AI Playbook</span>
				</SectionHeading>

				<p className="mx-auto mt-5 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:mt-6 md:text-xl lg:mt-8 lg:text-2xl">
					Take a quick assessment, and get a personalized roadmap of where AI and automation can have the biggest impact
					on your business.
				</p>

				<div className="flex justify-center">
					<PrimaryButton href="/contact">Get My AI Playbook</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
