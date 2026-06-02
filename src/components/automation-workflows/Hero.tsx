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
		enlarge: true,
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
				<div className="flex w-full max-w-[620px] flex-nowrap items-start justify-center gap-2 sm:gap-4 md:gap-12 lg:gap-20">
					{automationStats.map((stat) => (
						<div key={stat.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
							<GradientNumber
								value={stat.value}
								width="clamp(88px, 27vw, 180px)"
								height="clamp(56px, 16vw, 80px)"
								rotation={90}
								borderRadius="16px"
								enlarge={stat.enlarge}
								valueClassName={
									stat.enlarge
										? 'font-bold text-white text-5xl sm:text-6xl md:text-8xl'
										: 'font-bold text-white text-3xl sm:text-4xl md:text-6xl'
								}
							/>
							<span className="max-w-[110px] text-center text-[9px] font-semibold leading-tight tracking-wide text-white/65 sm:max-w-none sm:text-[12px] md:text-[14px]">
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
