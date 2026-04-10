import { GlassGlow } from './GlassGlow';

export const GlassNumber = ({ number }: { number: string }) => (
	<div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
		<div
			className="absolute inset-0 rounded-lg p-[1px]"
			style={{
				background:
					'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.8) 100%)',
			}}
		>
			<div className="h-full w-full rounded-[7px] bg-[#121212]" />
		</div>

		<div
			className="pointer-events-none absolute inset-[1px] overflow-hidden rounded-[7px]"
			style={{
				background:
					'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
			}}
		/>

		<GlassGlow angle={135} opacity={0.8} start={40} end={100} radius="7px" />

		<span className="relative z-10 text-xl font-bold tracking-tighter text-[#606bfa]">
			{number}
		</span>
	</div>
);
