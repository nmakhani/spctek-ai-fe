import { GlowBackground } from '../ui/GlowBackground';
import { GradientNumber } from '../ui/GradientNumber';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

const automationStats = [
	{
		value: '7+',
		label: 'Automation Systems',
	},
	{
		value: '100%',
		label: 'Plug-n-Play Ready',
	},
	{
		value: '∞',
		label: 'Scalable Operations',
	},
];

export default function Hero() {
	return (
		<section className="font-poppins relative mx-auto mt-24 flex max-w-7xl flex-col items-center justify-center px-4 text-center md:mt-28 md:px-6 lg:mt-36 lg:px-12">
			<GlowBackground
				style={{
					top: '-35%',
					width: '100%',
					height: '100%',
					background: 'radial-gradient(circle at center, rgba(96, 107, 250, 0.4) 0%, transparent 75%)',
					filter: 'blur(100px)',
				}}
			/>

			<SectionHeading size="hero">
				Browse{' '}
				<span className="text-[#606bfa]">
					Plug-and-Play <br /> Automation Workflows
				</span>{' '}
				Built <br /> for Real Business Operations
			</SectionHeading>

			<p className="font-poppins mt-6 max-w-[800px] text-base font-light leading-relaxed text-white sm:text-lg md:mt-8 md:text-xl lg:text-2xl">
				Explore automation workflow systems designed to automate reporting, proposals, campaigns, approvals, and
				business operations
			</p>

			<div className="mt-8 flex flex-col items-center md:mt-10">
				<div className="flex flex-nowrap items-start justify-center gap-3 sm:gap-4 md:gap-24">
					{automationStats.map((stat) => (
						<div key={stat.label} className="flex w-[110px] flex-col items-center gap-2">
							<GradientNumber value={stat.value} width="180px" height="80px" rotation={90} borderRadius="16px" />
							<span className="whitespace-nowrap text-center text-[9px] font-semibold tracking-wide text-white/65 sm:text-[12px] md:text-[14px]">
								{stat.label}
							</span>
						</div>
					))}
				</div>
				<PrimaryButton href="#roadmap-form">Book a Strategy Call</PrimaryButton>
			</div>
		</section>
	);
}
