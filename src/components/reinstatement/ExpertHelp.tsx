'use client';

import { GlassGlow } from '../ui/GlassGlow';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

const suspensionTypes = ['Multiple rejections', 'Section 3 suspensions', 'IP complaints', 'Counterfeit claims'];

const successStats = [
	{
		value: '55+',
		label: 'Reinstated',
		subLabel: 'Accounts',
	},
	{
		value: '89%',
		label: 'Success',
		subLabel: 'Rate',
	},
];

const expertServices = [
	'Suspension Analysis & Classification',
	'Appeal Submission & Escalation Management',
	'Reinstatement Strategy Based on Your Case',
	'Post-Reinstatement Compliance Support',
	'Amazon-Compliant Plan of Action (POA)',
	'Up to 100% Money-Back Guarantee',
];

export default function ExpertHelp() {
	return (
		<section className="font-poppins px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-6xl text-center">
				{/* Header Section */}
				<SectionHeading size="large">
					Need Expert Help?
					<br />
					Let Us Handle It <span className="text-[#606bfa]">End-to-End</span>
				</SectionHeading>

				{/* Main Feature Container */}
				<div className="relative mt-10 overflow-hidden rounded-3xl p-5 sm:mx-4 sm:p-6 md:mt-12 md:p-8 lg:mt-16">
					{/* Outer Gradient Border - Now White focused */}
					<div
						className="pointer-events-none absolute inset-0 rounded-3xl"
						style={{
							padding: '3px',
							background: 'linear-gradient(135deg, white 0%, transparent 25%, transparent 75%, white 100%)',
							WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
							WebkitMaskComposite: 'destination-out',
							maskComposite: 'exclude',
						}}
					/>

					<GlassGlow angle={110} opacity={0.6} start={10} end={90} radius="25px" />

					<div className="relative z-10">
						{/* Suspension Tags Grid */}
						<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{suspensionTypes.map((type, index) => (
								<div
									key={index}
									className="flex min-h-[64px] items-center justify-center rounded-xl border-2 border-white px-4 py-2 text-lg font-medium text-white shadow-lg sm:text-xl md:min-h-[70px] md:text-2xl"
									style={{
										background: 'linear-gradient(to bottom, #2e358b 0%, #131532 100%)',
									}}
								>
									{type}
								</div>
							))}
						</div>

						{/* Success Statistics Grid */}
						<div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
							{successStats.map((stat, idx) => (
								<div
									key={idx}
									className="flex items-center justify-center gap-6 rounded-xl border border-white p-4 shadow-2xl transition-all duration-500 hover:scale-[1.01] md:p-4"
									style={{
										background: 'linear-gradient(105deg, #131532 0%, #2e358b 30%, #2e358b 70%, #131532 100%)',
									}}
								>
									<span className="text-4xl font-bold tracking-tighter text-white sm:text-6xl md:text-8xl">
										{stat.value}
									</span>
									<div className="text-left">
										<p className="text-xl font-normal leading-[1.1] text-white sm:text-2xl md:text-4xl">
											{stat.label}
											<br />
											{stat.subLabel}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Context Text */}
				<p className="mx-auto mt-10 max-w-4xl text-base font-light leading-relaxed text-white sm:text-lg md:mt-12 md:text-xl lg:text-2xl">
					If your case is complex or your assessment shows low to moderate viability, our expert team can step in to
					take over completely.
				</p>

				{/* Checklist Grid */}
				<div className="mx-auto mb-16 mt-10 grid max-w-5xl grid-cols-1 gap-x-10 gap-y-3 text-left sm:gap-x-12 md:mt-14 md:grid-cols-2 md:gap-x-16 md:gap-y-2 lg:mb-20 lg:mt-16">
					{expertServices.map((service, index) => (
						<div key={index} className="group flex items-start gap-2">
							<span className="text-2xl font-bold transition-transform group-hover:scale-110">✓</span>
							<span className="text-base font-medium leading-snug text-white/90 sm:text-lg md:text-xl lg:text-2xl">
								{service}
							</span>
						</div>
					))}
				</div>

				<PrimaryButton href="/contact">Reinstate My Amazon Account</PrimaryButton>
			</div>
		</section>
	);
}
