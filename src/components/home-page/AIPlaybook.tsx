import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function AIPlaybook() {
	return (
		<section className="font-poppins relative overflow-hidden px-6 md:px-12" id="ai-playbook">
			<div className="mx-auto max-w-4xl text-center">
				<SectionHeading size="large">
					Let&apos;s Build Your Custom <br />
					<span className="text-[#606bfa]">AI Playbook</span>
				</SectionHeading>

				<p className="mx-auto mt-8 max-w-3xl text-xl font-light leading-relaxed text-white md:text-2xl">
					Take a quick assessment, and get a personalized roadmap of where AI and automation can
					have the biggest impact on your business.
				</p>

				<div className="flex justify-center">
					<PrimaryButton href="/#contact">Get My AI Playbook</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
