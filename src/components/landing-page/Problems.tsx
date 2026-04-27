'use client';

import { GlowBackground } from '../ui/GlowBackground';
import { GradientBorder } from '../ui/GradientBorder';
import { SectionHeading } from '../ui/SectionHeading';

const stats = [
	{
		stat: '43%',
		title: 'of SMBs',
		description: 'cite operations as the top bottleneck.',
	},
	{
		stat: '7+',
		title: 'tools',
		description: 'the average SMB uses daily.',
	},
	{
		stat: '78%',
		title: 'of teams',
		description: 'fail to deploy AI effectively.',
	},
];

const GlassBadge = ({ stat }: { stat: string }) => (
	<div className="relative flex h-[64px] w-[64px] shrink-0 items-center justify-center">
		{/* Outer Housing */}
		<div
			className="absolute inset-0 overflow-hidden rounded-xl border border-white/10"
			style={{
				background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.3) 100%)',
				boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.2)',
			}}
		/>

		{/* Inner Acrylic Panel */}
		<div
			className="relative z-10 flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-xl shadow-lg"
			style={{
				background: 'linear-gradient(135deg, #5865F2 0%, #3b44a3 100%)',
				boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
			}}
		>
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)',
				}}
			/>
			<span className="text-lg font-bold tracking-tight text-white drop-shadow-md">{stat}</span>
		</div>

		{/* Top-Left Specular Flare */}
		<div
			className="pointer-events-none absolute -left-12 -top-4 h-8 w-36 rounded-full blur"
			style={{
				mixBlendMode: 'screen',
				background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
			}}
		/>
	</div>
);

export default function Problems() {
	return (
		<section className="font-poppins px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 text-center md:mb-14 lg:mb-20">
					<SectionHeading size="large">
						The Problem Isn&apos;t Lack of <span className="text-[#a0a6fc]">AI Tools.</span>
						<br />
						It&apos;s Lack of Systems
					</SectionHeading>
				</div>

				<div className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-16">
					<div className="lg:col-span-6 lg:pl-8 xl:pl-20">
						<p className="max-w-[600px] text-base font-light leading-relaxed tracking-tight text-white/90 sm:text-lg md:mx-auto md:text-center md:text-xl lg:mx-0 lg:text-left lg:text-2xl">
							Most SMBs are already juggling more tools and dashboards than they can manage. The real challenge is
							connecting data, workflows, and decisions into a system that brings clarity, consistency, and control.
						</p>
					</div>

					<div className="relative flex flex-col gap-5 sm:gap-6 md:items-center md:gap-7 lg:col-span-5 lg:items-start lg:gap-8">
						<GlowBackground
							style={{
								top: '40%',
								left: '50%',
								width: '90%',
								height: '80%',
								background:
									'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.5) 0%, rgba(96, 107, 250, 0.5) 50%, transparent 80%)',
								transform: 'translate(-50%, -50%) rotate(-55deg)',
								filter: 'blur(40px)',
							}}
						/>

						<div className="absolute left-1/2 top-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[#606bfa]/5 blur-[120px]" />
						{stats.map((item, idx) => (
							<div
								key={idx}
								className="group relative flex w-full max-w-[360px] items-center gap-4 rounded-xl p-0 transition-all duration-500 hover:bg-white/[0.03]"
								style={{
									background: 'rgba(10, 10, 20, 0.4)',
									backdropFilter: 'blur(12px)',
								}}
							>
								<GradientBorder thickness={0.5} radius="12px" subtle={true} />

								<GlassBadge stat={item.stat} />

								<div className="flex flex-col pr-4">
									<span className="text-[16px] font-bold leading-tight text-white">{item.title}</span>
									<span className="mt-0.5 text-[14px] leading-snug text-white/60">{item.description}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
