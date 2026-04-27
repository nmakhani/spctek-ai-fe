import { LeftTextSection } from '../ui/LeftTextSection';
import { SectionHeading } from '../ui/SectionHeading';

export default function Started() {
	return (
		<section className="font-poppins relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 text-center md:px-6 lg:px-12">
			<SectionHeading size="large">
				How <span className="text-[#606bfa]">SPCTEK.AI</span> Started
			</SectionHeading>

			<LeftTextSection>
				While helping clients improve their operations, one key realization stood out: AI works best after the process
				is clear. <br />
				<br /> That insight led to the creation of SPCTEK.AI. A platform designed to help businesses adopt AI in a
				structured, practical, and scalable way. Not by adding more tools, but by building better systems. <br />
			</LeftTextSection>
		</section>
	);
}
