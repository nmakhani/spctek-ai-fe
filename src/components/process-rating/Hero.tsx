import { PrimaryButton } from '../ui/PrimaryButton';
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
						'radial-gradient(circle at center, rgba(96, 107, 250, 0.4) 0%, transparent 75%)',
					filter: 'blur(100px)',
				}}
			/>

			<SectionHeading size="hero">
				Find Out How Efficient Your <br className="hidden md:block" />
				<span className="text-[#606bfa]">Business Processes</span> Really Are
			</SectionHeading>

			<p className="font-poppins mt-8 max-w-[800px] text-xl font-light leading-relaxed text-white md:text-2xl">
				Measure your operational efficiency with an AI-powered process rating and uncover the most
				critical operational flaws.
			</p>

			<div>
				<PrimaryButton href="/contact">Rate My Process</PrimaryButton>
			</div>
		</section>
	);
}
