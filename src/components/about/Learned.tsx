import { GlassGlow } from '../ui/GlassGlow';
import { GradientBorder } from '../ui/GradientBorder';
import { SectionHeading } from '../ui/SectionHeading';
import { LeftTextSection } from '../ui/LeftTextSection';

const aiChallenges = [
	{ id: '01', text: 'Trying AI without a clear process' },
	{ id: '02', text: 'Adding automation that did not align with workflows' },
	{ id: '03', text: 'Using too many disconnected tools' },
	{ id: '04', text: 'Facing more complexity instead of efficiency' },
];

export default function Learned() {
	return (
		<section className="font-poppins relative mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center md:px-12">
			<SectionHeading size="large">
				What We <span className="text-[#606bfa]">Learned</span> Along the Way
			</SectionHeading>

			<LeftTextSection>
				Through our years of hands-on work, we began to notice a consistent pattern. <br />
				<br /> Most businesses were not struggling because they lacked tools. They were struggling because their
				processes were unclear, fragmented, or disconnected. <br />
				<br /> Teams were operating across multiple platforms, leads were missed, workflows were inconsistent, and
				decisions were delayed because information was scattered. <br />
				<br /> At the same time, AI was rapidly gaining attention. Businesses wanted to adopt it, but many did not know
				where it actually fit within their operations. <br /> <br /> <br />
				<p className="font-bold">We saw companies:</p>
			</LeftTextSection>

			<div className="relative z-10 my-6 w-full max-w-5xl">
				<GradientBorder thickness={2} radius="12px" />
				<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="12px" />

				<div className="rounded-2xl p-8 shadow-2xl">
					<div className="flex flex-col gap-8">
						{aiChallenges.map((item) => (
							<div key={item.id} className="group flex items-stretch gap-8">
								<div className="relative flex w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white md:w-24">
									<div
										className="absolute inset-0 -z-10"
										style={{
											background: 'linear-gradient(105deg, #131532 0%, #606bfa 40%, #606bfa 60%, #131532 100%)',
											filter: 'blur(8px)',
										}}
									/>
									<span className="relative z-10 text-4xl font-bold text-white md:text-6xl">{item.id}</span>
								</div>

								<div className="relative flex flex-grow items-center overflow-hidden px-8 py-6 text-white shadow-inner">
									<GradientBorder thickness={1.5} radius="12px" />
									<GlassGlow angle={105} opacity={0.5} start={8} end={92} radius="12px" />

									<p className="relative z-10 text-lg font-normal tracking-wide md:text-xl lg:text-2xl">{item.text}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<LeftTextSection>
				This revealed a clear gap between AI&apos;s potential and real business implementation.
			</LeftTextSection>

			{/* end of section  */}
		</section>
	);
}
