import { GlassTile } from '../ui/GlassTile';
import { SectionHeading } from '../ui/SectionHeading';

const securityCards = [
	{
		title: 'Secure Credential Management',
		description:
			'API keys, tokens, and connected tools are handled through structured and secure access management practices.',
	},
	{
		title: 'Reliable Operational Systems',
		description:
			'Built with monitoring, fallback handling, and structured workflows to support stable day-to-day execution.',
	},
	{
		title: 'Built-In Approval & Review Controls',
		description:
			'Important actions include review steps and approvals, helping your team stay in control before going live.',
	},
];

export default function Security() {
	return (
		<section className="font-poppins relative px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-6xl">
				<div className="mx-auto mb-10 max-w-4xl text-center md:mb-12 lg:mb-16">
					<SectionHeading size="large">
						Security Is Our Priority Across Every <span className="text-[#606bfa]">Automation System</span>
					</SectionHeading>
					<p className="mx-auto mt-5 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:text-xl lg:text-2xl">
						Our workflow systems are built with structured access management, secure infrastructure, and reliable
						operational workflows.
					</p>
				</div>

				<div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 xl:max-w-6xl xl:grid-cols-3">
					{securityCards.map((card) => (
						<GlassTile key={card.title} title={card.title} description={card.description} />
					))}
				</div>
			</div>
		</section>
	);
}
