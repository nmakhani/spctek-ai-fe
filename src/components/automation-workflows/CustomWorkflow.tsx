import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function CustomWorkflow() {
	return (
		<section className="font-poppins relative overflow-hidden px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-4xl text-center">
				<SectionHeading size="large">
					Want a <span className="text-[#606bfa]">Custom Automation Workflow</span> Built Specifically for Your Business
					Process?
				</SectionHeading>

				<p className="mx-auto mt-5 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:mt-6 md:text-xl lg:mt-8 lg:text-2xl">
					Get your custom workflow automation for any business process that is hurting your productivity.
				</p>

				<div className="flex justify-center">
					<PrimaryButton href="/contact">Request a Custom Workflow</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
