import { useEffect, useState, useRef, useCallback } from 'react';

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
			'Spctek.ai helped us replace disconnected workflows with one operational system. Within weeks, our team cut manual coordination time and made faster decisions with confidence.',
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
			'We needed structure without slowing execution. Spctek.ai delivered workflows that feel lightweight for teams but still give leadership the control and data we needed.',
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

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const triggerNext = useCallback(
		(direction: 'next' | 'prev' = 'next') => {
			if (isTransitioning) return;

			setIsTransitioning(true);

			setTimeout(() => {
				setActiveIndex((prev) => {
					if (direction === 'next') return (prev + 1) % testimonials.length;
					return (prev - 1 + testimonials.length) % testimonials.length;
				});
				setIsTransitioning(false);
			}, 500);
		},
		[isTransitioning]
	);

	const startTimer = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);

		timerRef.current = setInterval(() => {
			triggerNext('next');
		}, 8000);
	}, [triggerNext]);

	useEffect(() => {
		startTimer();
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [startTimer]);

	const handleNext = () => {
		triggerNext('next');
		startTimer();
	};

	const handlePrev = () => {
		triggerNext('prev');
		startTimer();
	};

	const activeTestimonial = testimonials[activeIndex];

	return (
		<section className="font-poppins relative px-4 md:px-6 lg:px-12" id="testimonials">
			<GlowBackground
				style={{
					top: '30%',
					left: '50%',
					width: '80%',
					height: '160%',
					background: 'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.72) 0%, transparent 100%)',
					transform: 'translate(-50%, -50%) rotate(-40deg) scale(1.25)',
					filter: 'blur(100px)',
					opacity: 0.8,
				}}
			/>

			<div className="mx-auto max-w-6xl">
				<div className="mb-8 text-center md:mb-10 lg:mb-12">
					<SectionHeading size="large">
						What <span className="text-[#606bfa]">Our Clients</span> Say About Us
					</SectionHeading>
				</div>

				<div className="relative mx-auto w-full max-w-5xl py-4 sm:py-5 md:py-6">
					{/* The underlying glow */}
					<div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#606bfa]/15 blur-[110px]" />

					<div
						className={`relative z-10 overflow-hidden rounded-[26px] p-5 transition-all duration-700 sm:rounded-[30px] sm:p-6 md:rounded-[35px] md:p-10 lg:p-12 ${
							isTransitioning ? 'saturate-125 opacity-0 blur-[1.5px]' : 'opacity-100 blur-0 saturate-100'
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
								background: 'linear-gradient(135deg, #fff 0%, transparent 25%, transparent 75%, #fff 100%)',
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
								background: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.15) 0%, transparent 30%)',
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
						<div className="relative z-10 flex h-full min-h-[240px] flex-col justify-between">
							{/* TOP SECTION: The Quote */}
							<div className="w-full text-left">
								<p className="text-base font-light leading-relaxed text-white/95 sm:text-lg md:text-xl lg:text-[1.75rem] lg:leading-snug">
									&ldquo;{activeTestimonial.quote}&rdquo;
								</p>
							</div>

							{/* BOTTOM SECTION: Nav on Left, Info on Right */}
							<div className="mt-6 flex flex-row items-end justify-between sm:mt-7 md:mt-8">
								{/* NAVIGATION BUTTONS (Bottom Left) */}
								<div className="flex gap-3 pb-1">
									<button
										onClick={handlePrev}
										className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95"
										aria-label="Previous testimonial"
									>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="m15 18-6-6 6-6" />
										</svg>
									</button>
									<button
										onClick={handleNext}
										className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95"
										aria-label="Next testimonial"
									>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="m9 18 6-6-6-6" />
										</svg>
									</button>
								</div>

								{/* INFO SECTION (Bottom Right) */}
								<div className="flex flex-col items-end text-right">
									<p className="text-lg font-semibold leading-snug text-white sm:text-xl md:text-2xl">
										{activeTestimonial.name}
									</p>
									<p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#7c86fc] sm:text-sm md:text-base">
										{activeTestimonial.role}
									</p>
								</div>
							</div>
						</div>

						{/* ... remainder of code ... */}
					</div>
				</div>
			</div>
		</section>
	);
}
