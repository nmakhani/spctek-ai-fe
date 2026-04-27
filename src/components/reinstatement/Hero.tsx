import { GlowBackground } from '../ui/GlowBackground';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function Hero() {
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
				Is Your <span className="text-[#a0a6fc]">Amazon</span> Account <br /> Suspended?
			</SectionHeading>

			<div className="mt-6 max-w-[900px] md:mt-8">
				<h2 className="mb-4 text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">
					Find out if it can be reinstated with the AI Reinstatement Estimator
				</h2>

				<p className="text-gray-300 text-base font-light leading-relaxed sm:text-lg md:text-xl lg:text-2xl">
					It can take 5-7 days to assess if your case is worth pursuing. <br className="hidden md:block" />
					Our Reinstatement Estimator provides an <span className="font-normal text-white">
						instant assessment
					</span> of <br className="hidden md:block" />
					your suspension and reinstatement viability report.
				</p>
			</div>

			{/* Button Container */}
			<div className="flex w-full max-w-[820px] flex-col items-center justify-center gap-4 sm:flex-row">
				<PrimaryButton href="#free-assessment">Get My Reinstatement Report</PrimaryButton>

				<PrimaryButton
					href="/contact"
					config={{
						bgColor: '#e0e7ff',
						hoverColor: '#ffffff',
						textColor: '#1e1b4b',
					}}
				>
					Speak to a Reinstatement Expert
				</PrimaryButton>
			</div>
		</section>
	);
}
