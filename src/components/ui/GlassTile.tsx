import { GlassGlow } from './GlassGlow';

interface GlassTileProps {
	title: string;
	description: string;
}

export const GlassTile = ({ title, description }: GlassTileProps) => {
	return (
		<div
			className="relative flex h-full flex-col rounded-[25px] p-10 transition-all duration-500 hover:scale-[1.01]"
			style={{
				backdropFilter: 'blur(20px)',
				border: '1.5px solid rgba(255, 255, 255, 0.12)',
				boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
			}}
		>
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					borderRadius: '25px',
					padding: '1.2px',
					background:
						'linear-gradient(135deg, #fff 0%, transparent 20%, transparent 80%, #fff 100%)',
					WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
					WebkitMaskComposite: 'destination-out',
					maskComposite: 'exclude',
					opacity: 0.8,
				}}
			/>

			<GlassGlow angle={45} opacity={0.8} start={20} end={80} radius="25px" />

			<div className="relative z-10 flex h-full flex-col">
				<h3 className="text-[1.4rem] font-bold tracking-tight text-[#7c86fc]">{title}</h3>
				<p className="mt-4 text-[1.1rem] font-medium leading-relaxed text-white/90">
					{description}
				</p>
			</div>
		</div>
	);
};
