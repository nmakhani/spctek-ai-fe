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
						'radial-gradient(circle at center, rgba(96, 107, 250, 0.3) 0%, transparent 70%)',
					filter: 'blur(100px)',
				}}
			/>

			<SectionHeading size="hero">
				Is Your <span className="text-[#a0a6fc]">Amazon</span> Account <br /> Suspended?
			</SectionHeading>

			<div className="mt-8 max-w-[900px]">
				<h2 className="mb-4 text-xl font-bold text-white md:text-3xl">
					Find out if it can be reinstated with the AI Reinstatement Estimator
				</h2>

				<p className="text-gray-300 text-lg font-light leading-relaxed md:text-2xl">
					It can take 5-7 days to assess if your case is worth pursuing.{' '}
					<br className="hidden md:block" />
					Our Reinstatement Estimator provides an{' '}
					<span className="font-normal text-white">instant assessment</span> of{' '}
					<br className="hidden md:block" />
					your suspension and reinstatement viability report.
				</p>
			</div>

			{/* Button Container */}
			<div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
				<PrimaryButton
					href="/report"
					config={{
						bgColor: '#6366f1',
						hoverColor: '#5558e3',
					}}
				>
					Get My Reinstatement Report
				</PrimaryButton>

				<PrimaryButton
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
