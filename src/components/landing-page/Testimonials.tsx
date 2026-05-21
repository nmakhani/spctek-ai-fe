import { GlowBackground } from '../ui/GlowBackground';
import { SectionHeading } from '../ui/SectionHeading';

export default function Testimonials() {
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
					opacity: 0.4,
				}}
			/>

			<div className="mx-auto max-w-6xl">
				<div className="mb-8 text-center md:mb-10 lg:mb-12">
					<SectionHeading size="large">
						What <span className="text-[#606bfa]">Our Clients</span> Say About Us
					</SectionHeading>
				</div>

				<div className="relative mx-auto w-full max-w-4xl">
					<div className="relative z-10 overflow-hidden rounded-[26px] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl sm:rounded-[35px]">
						{/* 16:9 Aspect Ratio Video Container */}
						<div className="relative w-full pt-[56.25%]">
							<iframe
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
								className="absolute inset-0 h-full w-full rounded-[20px] sm:rounded-[28px]"
								src="https://www.youtube.com/embed/tNJoRVYoJIQ?rel=0&modestbranding=1"
								title="YouTube video player"
								allowFullScreen
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
