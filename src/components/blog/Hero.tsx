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
					background: 'radial-gradient(circle at center, rgba(96, 107, 250, 0.3) 0%, transparent 70%)',
					filter: 'blur(100px)',
				}}
			/>

			<SectionHeading size="hero">
				Practical Insights on{' '}
				<span className="text-[#606bfa]">
					AI, Operations, <br /> and Scalable Growth
				</span>
			</SectionHeading>

			<div className="mt-8 max-w-[1000px]">
				<p className="text-gray-300 text-lg font-light leading-relaxed md:text-2xl">
					Practical ideas, real-world strategies, and actionable guides to help you improve processes and implement AI
					effectively.
				</p>
			</div>
		</section>
	);
}
