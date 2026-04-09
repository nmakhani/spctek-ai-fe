import { GlassTile } from '../ui/GlassTile';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

type BusinessType = {
	title: string;
	description: string;
};

const businessTypes: BusinessType[] = [
	{
		title: 'E-commerce Businesses',
		description: 'Marketplace sellers managing Amazon, Shopify, PPC tools, and inventory systems.',
	},
	{
		title: 'SaaS Startups',
		description: 'Companies that are looking to implement AI securely within internal operations.',
	},
	{
		title: 'Agencies & Service Businesses',
		description: 'Teams managing multiple clients, processes, and internal workflows.',
	},
	{
		title: 'Operations-Heavy SMBs',
		description:
			'Businesses with complex processes that benefit from automation and intelligent systems.',
	},
];

export default function BusinessAdoption() {
	return (
		<section className="font-poppins relative px-6 md:px-12">
			<div className="mx-auto max-w-6xl">
				{/* Header Section */}
				<div className="mx-auto mb-16 max-w-4xl text-center">
					<SectionHeading size="large">
						For Businesses That Want to Adopt <br />
						<span className="text-[#606bfa]">AI </span>
						the Right Way
					</SectionHeading>
					<p className="mx-auto mt-6 max-w-3xl font-light leading-relaxed text-white md:text-2xl">
						Designed for businesses that want to adopt AI with clarity, manage complex operations
						across multiple tools, and prioritize security and real-world workflows.
					</p>
				</div>

				{/* Business Types Grid */}
				<div className="mx-auto mb-12 grid max-w-[900px] grid-cols-1 gap-6 md:grid-cols-2">
					{businessTypes.map((type) => (
						<GlassTile key={type.title} title={type.title} description={type.description} />
					))}
				</div>

				{/* Global CTA Button */}
				<div className="flex justify-center">
					<PrimaryButton href="/#contact">Explore Solutions</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
