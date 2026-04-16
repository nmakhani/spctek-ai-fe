import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';
import { GlowBackground } from '../ui/GlowBackground';

export default function Hero() {
	return (
		<section className="font-poppins relative mx-auto mt-24 flex max-w-7xl flex-col items-center justify-center px-4 text-center md:mt-28 md:px-6 lg:mt-36 lg:px-12">
			<GlowBackground
				style={{
					top: '-35%',
					width: '100%',
					height: '100%',
					background: 'radial-gradient(circle at center, rgba(96, 107, 250, 0.4) 0%, transparent 75%)',
					filter: 'blur(100px)',
				}}
			/>

			<SectionHeading size="hero">
				Deploy <span className="text-[#606bfa]">Local AI</span> Without <br /> Compromising Security or Control
			</SectionHeading>

			<p className="font-poppins mt-6 max-w-[800px] text-base font-light leading-relaxed text-white sm:text-lg md:mt-8 md:text-xl lg:text-2xl">
				Run powerful AI inside your own environment with full data ownership, role-based access, and zero risk of data
				leakage.
			</p>

			<div>
				<PrimaryButton href="#roadmap-form">Get a Free Custom Local AI Plan</PrimaryButton>
			</div>
		</section>
	);
}
