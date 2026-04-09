import { SectionHeading } from '../ui/SectionHeading';
import { GlowBackground } from '../ui/GlowBackground';

export default function Hero() {
	return (
		<section className="font-poppins relative mx-auto mt-36 flex max-w-7xl flex-col items-center justify-center px-6 text-center md:px-12">
			<GlowBackground
				style={{
					top: '-35%',
					width: '100%',
					height: '100%',
					background:
						'radial-gradient(circle at center, rgba(96, 107, 250, 0.3) 0%, transparent 70%)',
					filter: 'blur(100px)',
				}}
			/>

			<SectionHeading size="hero">
				<span className="text-[#606bfa]">Built From Real Operations</span>
				<br /> Not Just AI Trends
			</SectionHeading>

			<div className="mt-8 max-w-[1000px]">
				<p className="text-gray-300 text-lg font-light leading-relaxed md:text-3xl">
					SPCTEK.AI was created from real business experience, not theory. Over the years, our team
					has worked closely with e-commerce brands, agencies, and digital businesses. We have
					helped teams manage operations, improve performance, and scale their systems while
					supporting companies generating over $25M in annual revenue.
				</p>
			</div>
		</section>
	);
}
