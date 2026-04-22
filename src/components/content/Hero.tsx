import { SectionHeading } from '../ui/SectionHeading';
import { GlowBackground } from '../ui/GlowBackground';

interface HeroProps {
	titlePrefix: string;
	titleAccent: string;
	description: string;
}

export default function Hero({ titlePrefix, titleAccent, description }: HeroProps) {
	return (
		<section className="font-poppins relative mx-auto mt-24 flex max-w-7xl flex-col items-center justify-center px-4 text-center md:mt-28 md:px-6 lg:mt-36 lg:px-12">
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
				{titlePrefix} <span className="text-[#606bfa]">{titleAccent}</span>
			</SectionHeading>

			<div className="mt-6 max-w-[1000px] md:mt-8">
				<p className="text-gray-300 text-base font-light leading-relaxed sm:text-lg md:text-xl lg:text-2xl">
					{description}
				</p>
			</div>
		</section>
	);
}
