import { useEffect, useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { GlowBackground } from '../ui/GlowBackground';

type Testimonial = {
	quote: string;
	name: string;
	role: string;
};

const testimonials: Testimonial[] = [
	{
		quote:
			'SPCTEK helped us replace disconnected workflows with one operational system. Within weeks, our team cut manual coordination time and made faster decisions with confidence.',
		name: 'Nadia R.',
		role: 'COO, Mehjabeen Pharmaceuticals',
	},
	{
		quote:
			'Our reporting cycle dropped from days to hours. The automation layer removed repetitive tasks and gave our teams real visibility into what needed our attention first.',
		name: 'Ahsan M.',
		role: 'Director Operations, Meridian Foods',
	},
	{
		quote:
			'From lead capture to follow-ups, everything now moves in one clean flow. Conversion improved because no opportunities are slipping through handoff gaps anymore.',
		name: 'Sara K.',
		role: 'Head of Growth, NovaEdge Retail',
	},
	{
		quote:
			'We needed structure without slowing execution. SPCTEK delivered workflows that feel lightweight for teams but still give leadership the control and data we needed.',
		name: 'Bilal T.',
		role: 'VP Strategy, Orion Ventures',
	},
	{
		quote:
			'Implementation was fast and practical. Instead of another dashboard nobody uses, we got a working system teams adopted immediately across departments.',
		name: 'Hira J.',
		role: 'General Manager, Apex Services',
	},
];

export default function Testimonials() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);

	useEffect(() => {
		let swapTimeout: ReturnType<typeof setTimeout> | null = null;

		const interval = setInterval(() => {
			setIsTransitioning(true);

			swapTimeout = setTimeout(() => {
				setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
				setIsTransitioning(false);
			}, 640);
		}, 9600);

		return () => {
			clearInterval(interval);
			if (swapTimeout) clearTimeout(swapTimeout);
		};
	}, []);

	const activeTestimonial = testimonials[activeIndex];

	return (
		<section className="font-poppins relative px-6 md:px-12" id="testimonials">
			<GlowBackground
				style={{
					top: '30%',
					left: '50%',
					width: '80%',
					height: '160%',
					background:
						'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.72) 0%, transparent 100%)',
					transform: 'translate(-50%, -50%) rotate(-40deg) scale(1.25)',
					filter: 'blur(100px)',
					opacity: 0.8,
				}}
			/>

			<div className="mx-auto max-w-6xl">
				<div className="mb-8 text-center md:mb-10">
					<SectionHeading size="large">
						What <span className="text-[#606bfa]">Our Clients</span> Say About Us
					</SectionHeading>
				</div>

				<div className="relative mx-auto w-full max-w-5xl py-6">
					{/* The underlying glow */}
					<div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#606bfa]/15 blur-[110px]" />

					<div
						className={`relative z-10 overflow-hidden rounded-[35px] p-6 transition-all duration-700 md:p-12 ${
							isTransitioning
								? 'saturate-125 opacity-0 blur-[1.5px]'
								: 'opacity-100 blur-0 saturate-100'
						}`}
						style={{
							backdropFilter: 'blur(20px)',
							background: 'rgba(255, 255, 255, 0.03)',
							boxShadow: '0 25px 80px rgba(6, 12, 35, 0.55)',
						}}
					>
						{/* 1. THE CHISELED GRADIENT BORDER (Top-Left & Bottom-Right Shine) */}
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

						{/* 2. TOP-LEFT CORNER GLOW */}
						<div
							className="pointer-events-none absolute inset-0 rounded-[35px]"
							style={{
								background:
									'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.15) 0%, transparent 30%)',
							}}
						/>

						{/* 3. TRANSITION OVERLAY (Appears during isTransitioning) */}
						<div
							className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
								isTransitioning ? 'opacity-70' : 'opacity-0'
							}`}
							style={{
								backgroundImage:
									'radial-gradient(circle at 18% 24%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 46%), radial-gradient(circle at 78% 70%, rgba(128,138,255,0.32) 0%, rgba(128,138,255,0) 50%), linear-gradient(120deg, rgba(15,20,48,0.00) 0%, rgba(15,20,48,0.35) 55%, rgba(15,20,48,0.62) 100%)',
							}}
						/>

						{/* CONTENT SECTION */}
						{/* ... inside the main container ... */}

						<div className="relative z-10 flex h-full min-h-[240px] flex-col justify-between">
							{/* TOP SECTION: The Quote */}
							<div className="w-full text-left">
								<p className="text-xl font-light leading-relaxed text-white/95 md:text-[1.75rem] md:leading-snug">
									&ldquo;{activeTestimonial.quote}&rdquo;
								</p>
							</div>

							{/* BOTTOM SECTION: Aligned Right */}
							<div className="mt-8 flex flex-col items-end text-right">
								<p className="text-xl font-semibold leading-snug text-white md:text-2xl">
									{activeTestimonial.name}
								</p>
								<p className="mt-1 text-sm font-medium uppercase tracking-wide text-[#7c86fc] md:text-base">
									{activeTestimonial.role}
								</p>
							</div>
						</div>

						{/* ... remainder of code ... */}
					</div>
				</div>
			</div>
		</section>
	);
}
