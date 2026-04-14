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
		link: '/local-ai-setup',
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
		link: '/process-rating',
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
			<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
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
		<section className="font-poppins px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-7xl">
				{/* Header Section */}
				<div className="mx-auto mb-12 max-w-4xl text-center md:mb-14 lg:mb-16">
					<SectionHeading size="large">
						Targeted <span className="text-[#606bfa]">AI Solutions</span> for High-Impact Business Problems
					</SectionHeading>
					<p className="mx-auto mt-5 max-w-3xl text-base font-light leading-relaxed text-white sm:text-lg md:text-[1.2rem] lg:text-[1.3rem]">
						Instead of offering generic AI services, we build targeted solutions that address specific operational
						challenges e-commerce businesses face today.
					</p>
				</div>

				<div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 md:gap-7 lg:mt-14 lg:grid-cols-3 lg:gap-8">
					{/* Solution Cards Section */}
					{solutionCards.map((card) => (
						<article
							key={card.title}
							className="group relative flex h-full flex-col items-center rounded-[30px] px-5 pb-8 pt-8 transition-all duration-500 hover:scale-[1.02] sm:px-6 md:rounded-[32px] md:px-7 md:pb-9 md:pt-10 lg:rounded-[35px] lg:px-8 lg:pb-10 lg:pt-12"
							style={{
								minHeight: '100%',
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
									background: 'linear-gradient(135deg, #fff 0%, transparent 25%, transparent 75%, #fff 100%)',
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

							<div className="relative z-10 flex h-full w-full max-w-[340px] flex-col">
								<p className="text-center text-sm tracking-[0.18em] text-[#7c86fc] sm:text-[1rem]">{card.category}</p>

								<div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8">
									<h3 className="text-center font-heading text-2xl font-bold text-white sm:text-[1.7rem] lg:text-3xl">
										{card.title}
									</h3>
								</div>

								<ul className="mt-7 flex-1 space-y-3 sm:mt-9 md:mt-10 md:space-y-4 lg:mt-12">
									{card.points.map((point) => (
										<li key={point} className="flex items-start gap-2">
											<CheckIcon />
											<span className="text-base font-medium leading-snug text-white sm:text-[1.02rem] md:text-[1.05rem]">
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
				<div className="mt-14 text-center md:mt-16 lg:mt-20">
					<p className="text-lg font-light italic tracking-wide text-white md:text-xl">
						More solutions and tools coming soon
					</p>
				</div>
			</div>
		</section>
	);
}
