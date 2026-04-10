import { GlassGlow } from '../ui/GlassGlow';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

type SolutionCard = {
	category: string;
	title: string;
	points: string[];
	cta: string;
	link: string;
};

const solutionCards: SolutionCard[] = [
	{
		category: 'Revenue Recovery',
		title: 'Reinstatement Estimator',
		points: [
			'Suspension root cause analysis',
			'Reinstatement probability assessment',
			'Appeal strategy guidance',
			'Automatic flagging of complex cases for review',
		],
		cta: 'Assess Reinstatement',
		link: '/reinstatement',
	},
	{
		category: 'Private AI',
		title: 'Secure Local AI Deployment',
		points: [
			'Open-source LLM deployment',
			'Private & secure hosting',
			'Role-based access control with a user-friendly interface',
			'AI aligned with internal workflows and SOPS',
		],
		cta: 'Deploy Local AI',
		link: 'contact',
	},
	{
		category: 'Custom Solutions',
		title: 'Custom Operational Solutions',
		points: [
			'Operations gap identification',
			'Custom workflow optimization',
			'System integration across tools',
			'AI solutions aligned with your operations',
		],
		cta: 'Get Custom Solutions',
		link: 'contact',
	},
];

function CheckIcon() {
	return (
		<span
			aria-hidden="true"
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '1.1rem',
				height: '1.1rem',
				marginTop: '0.18rem',
				flexShrink: 0,
				color: 'white',
			}}
		>
			<svg
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style={{ width: '100%', height: '100%' }}
			>
				<path
					d="M4 10.5L8 14.5L16 5.5"
					stroke="currentColor"
					strokeWidth="2.2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	);
}

export default function TargetedSolutions() {
	return (
		<section className="font-poppins px-6 md:px-12">
			<div className="mx-auto max-w-7xl">
				{/* Header Section */}
				<div className="mx-auto mb-16 max-w-4xl text-center">
					<SectionHeading size="large">
						Targeted <span className="text-[#606bfa]">AI Solutions</span> for High-Impact Business
						Problems
					</SectionHeading>
					<p className="mx-auto mt-6 max-w-3xl font-light leading-relaxed text-white md:text-[1.3rem]">
						Instead of offering generic AI services, we build targeted solutions that address
						specific operational challenges e-commerce businesses face today.
					</p>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Solution Cards Section */}
					{solutionCards.map((card) => (
						<article
							key={card.title}
							className="group relative flex flex-col items-center rounded-[35px] px-8 pb-10 pt-12 transition-all duration-500 hover:scale-[1.02]"
							style={{
								minHeight: '620px',
								backdropFilter: 'blur(20px)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
							}}
						>
							<div
								className="pointer-events-none absolute inset-0"
								style={{
									borderRadius: '35px',
									padding: '1.5px',
									background:
										'linear-gradient(135deg, #fff 0%, transparent 25%, transparent 75%, #fff 100%)',
									WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
									WebkitMaskComposite: 'destination-out',
									maskComposite: 'exclude',
									opacity: 0.8,
								}}
							/>

							<GlassGlow angle={135} opacity={0.8} start={20} end={85} radius="35px" />

							<div
								className="pointer-events-none absolute inset-0 rounded-[35px]"
								style={{
									background: '',
								}}
							/>

							<div className="relative z-10 flex h-full w-[320px] flex-col">
								<p className="text-center text-[1rem] tracking-[0.2em] text-[#7c86fc]">
									{card.category}
								</p>

								<div className="mt-8">
									<h3 className="text-center font-heading text-3xl font-bold text-white">
										{card.title}
									</h3>
								</div>

								<ul className="mt-12 flex-1 space-y-4">
									{card.points.map((point) => (
										<li key={point} className="flex items-start gap-2">
											<CheckIcon />
											<span className="text-[1.05rem] font-medium leading-snug text-white">
												{point}
											</span>
										</li>
									))}
								</ul>

								<div className="flex justify-center">
									<PrimaryButton href={card.link}>{card.cta}</PrimaryButton>
								</div>
							</div>
						</article>
					))}
				</div>

				{/* BOTTOM SECTION */}
				<div className="mt-20 text-center">
					<p className="text-[1.25rem] font-light italic tracking-wide text-white">
						More solutions and tools coming soon
					</p>
				</div>
			</div>
		</section>
	);
}
