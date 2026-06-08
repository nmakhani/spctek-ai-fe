import CalendlyButton from '../ui/CalendlyButton';
import { GlowBackground } from '../ui/GlowBackground';
import { SectionHeading } from '../ui/SectionHeading';

const automationStats = [
	{
		value: 'Free',
		label: 'No Sign-Up',
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
	{
		value: '24/7',
		label: 'Workflow Coverage',
	},
];

export default function Hero() {
	return (
		<section className="font-poppins relative mx-auto mt-20 grid max-w-7xl items-center gap-10 px-4 md:mt-24 md:px-6 lg:mt-28 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-14 lg:px-12">
			<GlowBackground
				style={{
					top: '-35%',
					width: '100%',
					height: '100%',
					background: 'radial-gradient(circle at center, rgba(96, 107, 250, 0.4) 0%, transparent 75%)',
					filter: 'blur(100px)',
				}}
			/>

			<div className="relative z-10 text-center lg:text-left [&_h1]:lg:text-left">
				<SectionHeading size="large" align="center">
					Browse <span className="text-[#606bfa]">Plug-and-Play Automation Workflows</span> Built for Real Business
					Operations
				</SectionHeading>

				<p className="font-poppins mx-auto mt-6 max-w-[760px] text-base font-light leading-relaxed text-white sm:text-lg md:mt-8 md:text-xl lg:mx-0 lg:max-w-[680px] lg:text-2xl">
					Explore automation workflow systems designed to automate reporting, proposals, campaigns, approvals, and
					business operations
				</p>
			</div>

			<div className="relative z-10 flex flex-col items-center">
				<div className="grid w-full max-w-[560px] grid-cols-2 overflow-hidden rounded-2xl border border-white/20 bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm">
					{automationStats.map((stat, index) => (
						<div
							key={stat.label}
							className={`group/stat relative flex min-h-[108px] flex-col items-center justify-center px-4 py-4 text-center transition duration-300 hover:bg-white/[0.06] sm:min-h-[124px] ${
								index % 2 === 0 ? 'border-r border-white/15' : ''
							} ${index < 2 ? 'border-b border-white/15' : ''}`}
						>
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,107,250,0.16),transparent_64%)] opacity-80 transition duration-300 group-hover/stat:opacity-100" />
							<div className="absolute inset-0 opacity-0 transition duration-300 group-hover/stat:opacity-100 group-hover/stat:shadow-[inset_0_0_34px_rgba(96,107,250,0.28),0_0_28px_rgba(96,107,250,0.18)]" />
							<div className="relative mb-2 flex h-[54px] items-center justify-center sm:h-[64px] md:h-[72px] lg:h-[78px]">
								<span
									className={`font-bold text-white transition duration-300 group-hover/stat:scale-105 group-hover/stat:text-[#cfd5ff] ${
										stat.enlarge
											? 'text-[64px] leading-none sm:text-[76px] md:text-[88px] lg:text-[96px]'
											: 'text-3xl leading-none sm:text-4xl md:text-5xl'
									}`}
								>
									{stat.value}
								</span>
							</div>
							<span className="relative max-w-[250px] text-[11px] font-semibold leading-tight tracking-wide text-white/65 transition duration-300 group-hover/stat:text-white/85 sm:text-[13px] md:text-[14px]">
								{stat.label}
							</span>
						</div>
					))}
				</div>
				<div className="flex w-full justify-center">
					<CalendlyButton config={{ marginTop: '2rem' }}>Book a Strategy Call</CalendlyButton>
				</div>
			</div>
		</section>
	);
}
