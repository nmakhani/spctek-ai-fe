import { GlassGlow } from '../ui/GlassGlow';
import { PrimaryButton } from '../ui/PrimaryButton';
import { GradientBorder } from '../ui/GradientBorder';
import { SectionHeading } from '../ui/SectionHeading';
import { GradientNumber } from '../ui/GradientNumber';

const deploymentSteps = [
	{ id: '01', text: 'Discovery & Requirements Mapping' },
	{ id: '02', text: 'Infrastructure & Model Selection' },
	{ id: '03', text: 'Deployment & Integration' },
	{ id: '04', text: 'Fine-Tuning & Testing' },
	{ id: '05', text: 'Team Training & Handoff' },
];

export default function DeploymentProcess() {
	return (
		<section className="font-poppins relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 text-center md:px-6 lg:px-12">
			<SectionHeading size="large">
				From Zero to Private <span className="text-[#606bfa]">AI Deployment</span>
			</SectionHeading>

			<p className="mx-auto my-6 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:my-8 md:text-xl lg:text-2xl">
				Our proven processes and AI experts get you from idea to locally deployed AI in weeks, not months.
			</p>

			<div className="relative z-10 my-6 w-full max-w-5xl">
				<GradientBorder thickness={2} radius="24px" />
				<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="24px" />

				<div className="p-5 shadow-2xl sm:p-6 md:p-8">
					<div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
						{deploymentSteps.map((item) => (
							<div
								key={item.id}
								className="group flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6"
							>
								{/* <div className="relative flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white">
									<div
										className="absolute inset-0 -z-10"
										style={{
											background: 'linear-gradient(105deg, #131532 0%, #606bfa 40%, #606bfa 60%, #131532 100%)',
											filter: 'blur(8px)',
										}}
									/>
									<span className="relative z-10 text-4xl font-bold text-white md:text-6xl">{item.id}</span>
								</div> */}

								<div className="hidden sm:block">
									<GradientNumber id={item.id} width="144px" height="96px" rotation={105} borderRadius="12px" />
								</div>

								<div className="relative flex flex-grow items-center overflow-hidden px-4 py-4 text-white shadow-inner sm:px-6 sm:py-5 md:px-8 md:py-6">
									<GradientBorder thickness={1.5} radius="12px" />
									<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="12px" />

									<p className="relative z-10 text-base font-normal tracking-wide sm:text-lg md:text-xl lg:text-2xl">
										{item.text}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="flex justify-center">
				<PrimaryButton href="#roadmap-form">Get a Free Custom Local AI Plan</PrimaryButton>
			</div>
		</section>
	);
}
