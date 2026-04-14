import { GlassGlow } from '../ui/GlassGlow';
import { PrimaryButton } from '../ui/PrimaryButton';
import { GradientBorder } from '../ui/GradientBorder';
import { SectionHeading } from '../ui/SectionHeading';

const deploymentSteps = [
	{ id: '01', text: 'Discovery & Requirements Mapping' },
	{ id: '02', text: 'Infrastructure & Model Selection' },
	{ id: '03', text: 'Deployment & Integration' },
	{ id: '04', text: 'Fine-Tuning & Testing' },
	{ id: '05', text: 'Team Training & Handoff' },
];

export default function DeploymentProcess() {
	return (
		<section className="font-poppins relative mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center md:px-12">
			<SectionHeading size="large">
				From Zero to Private <span className="text-[#606bfa]">AI Deployment</span>
			</SectionHeading>

			<p className="mx-auto my-8 max-w-3xl text-xl font-light leading-relaxed text-white md:text-2xl">
				Our proven processes and AI experts get you from idea to locally deployed AI in weeks, not months.
			</p>

			<div className="relative z-10 my-6 w-full max-w-5xl">
				<GradientBorder thickness={2} radius="24px" />
				<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="24px" />

				<div className="p-8 shadow-2xl">
					<div className="flex flex-col gap-8">
						{deploymentSteps.map((item) => (
							<div key={item.id} className="group flex items-center gap-6">
								<div className="relative flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white">
									<div
										className="absolute inset-0 -z-10"
										style={{
											background: 'linear-gradient(105deg, #131532 0%, #606bfa 40%, #606bfa 60%, #131532 100%)',
											filter: 'blur(8px)',
										}}
									/>
									<span className="relative z-10 text-4xl font-bold text-white md:text-6xl">{item.id}</span>
								</div>

								<div className="relative flex flex-grow items-center overflow-hidden px-8 py-6 text-white shadow-inner">
									<GradientBorder thickness={1.5} radius="12px" />
									<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="12px" />

									<p className="relative z-10 text-lg font-normal tracking-wide md:text-xl lg:text-2xl">{item.text}</p>
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
