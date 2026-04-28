import { GlassGlow } from '../ui/GlassGlow';
import { GradientBorder } from '../ui/GradientBorder';
import { PrimaryButton } from '../ui/PrimaryButton';

export default function Playbook() {
	return (
		<div className="relative z-10 w-full max-w-sm">
			<GradientBorder thickness={1.5} radius="24px" subtle={true} />
			<GlassGlow angle={105} opacity={0.3} start={8} end={92} radius="24px" />

			<div className="relative z-10 overflow-hidden rounded-[24px] p-6 sm:p-8">
				<div className="flex flex-col gap-6">
					<div className="space-y-4 text-center">
						<h2 className="text-[2rem] font-bold leading-[1.1] text-white sm:text-3xl">
							Get your free <br />
							<span className="text-[#606bfa]">AI Automation</span> <br />
							Playbook
						</h2>
						<p className="mx-auto text-sm leading-relaxed text-slate-300">
							Tell us your biggest operational problem. We&apos;ll send you a focused, zero-fluff guide showing exactly
							what to automate first.
						</p>
					</div>

					<PrimaryButton href="/ai-playbook" className="w-full">
						Claim my Playbook
					</PrimaryButton>
				</div>
			</div>
		</div>
	);
}
