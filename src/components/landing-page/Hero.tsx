import { GlowBackground } from '../ui/GlowBackground';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

export default function Hero() {
	return (
		<section className="font-poppins relative mx-auto mt-24 flex max-w-7xl flex-col items-center justify-center px-4 text-center md:mt-28 md:px-6 lg:mt-36 lg:px-12">
			<GlowBackground
				style={{
					top: '-30%',
					width: '100%',
					height: '100%',
					background: 'radial-gradient(circle at center, rgba(96, 107, 250, 0.4) 0%, transparent 75%)',
					filter: 'blur(100px)',
				}}
			/>

			<SectionHeading size="hero">
				Transform Operational Chaos <br className="hidden md:block" />
				Into <span className="text-[#a0a6fc]">Intelligent Systems</span>
			</SectionHeading>

			<p className="font-poppins mt-6 max-w-[800px] text-base font-light leading-relaxed text-white/95 md:text-xl lg:text-2xl">
				AI automation is transforming industries, but most SMBs are
				<br className="hidden md:block" /> unsure what to adopt or where to start. We help SMBs solve real operational
				problems using intelligent diagnostics, secure AI systems, and targeted automation solutions.
			</p>

			<div className="mb-8 w-full max-w-[360px]">
				<PrimaryButton href="/ai-playbook">Get My AI Playbook</PrimaryButton>
			</div>

			<div className="flex flex-col items-center justify-center gap-4 md:flex-row">
				<div className="flex -space-x-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-[#818cf8] to-[#4f46e5] text-[10px] font-bold text-white shadow-xl">
						MR
					</div>
					<div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-[#2dd4bf] to-[#0d9488] text-[10px] font-bold text-white shadow-xl">
						JK
					</div>
					<div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-[#fb923c] to-[#ea580c] text-[10px] font-bold text-white shadow-xl">
						SA
					</div>
					<div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-[#f472b6] to-[#db2777] text-[10px] font-bold text-white shadow-xl">
						DP
					</div>
				</div>

				<p className="font-poppins text-sm tracking-wide text-white md:text-base">
					Trusted by <span className="opacity-80">200+ SMB teams across Amazon & Shopify</span>
				</p>
			</div>
		</section>
	);
}
