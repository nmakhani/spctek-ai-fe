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
					background: 'radial-gradient(circle at center, rgba(96, 107, 250, 0.4) 0%, transparent 75%)',
					filter: 'blur(100px)',
				}}
			/>

			<SectionHeading size="hero">
				<span className="text-[#606bfa]">Automate</span> Your Business Operations With a Tailored
				<span className="text-[#606bfa]"> AI Playbook</span>
			</SectionHeading>

			<p className="font-poppins mt-6 max-w-[800px] text-base font-light leading-relaxed text-white sm:text-lg md:mt-8 md:text-xl lg:text-2xl">
				Get your free practical AI playbook for SMBs, designed to bring structure, clarity, and scalable AI automation
				to your operations.
			</p>

			<div>
				<PrimaryButton href="#playbook-form">Get My Free AI Playbook</PrimaryButton>
			</div>
		</section>
	);
}
