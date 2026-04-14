import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';
import { LeftTextSection } from '../ui/LeftTextSection';

export default function Building() {
	return (
		<section className="font-poppins relative mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center md:px-12">
			<SectionHeading size="large">
				<span className="text-[#606bfa]">Tools & Solutions</span> We Are Building
			</SectionHeading>

			<LeftTextSection>
				SPCTEK.AI is developing a suite of practical AI-powered tools and operational systems designed to help
				businesses understand, improve, and scale their processes. <br />
				<br /> Our focus is not on building complex platforms. We build solutions that are simple, usable, and directly
				connected to real business operations. <br />
				<br /> We encourage businesses to start by evaluating their current systems before adding more tools or
				automation. This helps teams understand where they stand today and what needs to be improved first. <br />
			</LeftTextSection>

			<PrimaryButton href="/process-rating">Rate My Process</PrimaryButton>
		</section>
	);
}
