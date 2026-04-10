'use client';

import Image from 'next/image';
import { GlassGlow } from '../ui/GlassGlow';
import { GlowBackground } from '../ui/GlowBackground';
import { SectionHeading } from '../ui/SectionHeading';

const techCategories = [
	{
		title: 'AI Agents',
		imagePath: '/home-page/tech-stack/ai-agents.png',
	},
	{
		title: 'CRM and Marketing',
		imagePath: '/home-page/tech-stack/crm-marketing.png',
	},
	{
		title: 'Project Management, Client Success',
		imagePath: '/home-page/tech-stack/project-mgmt.png',
	},
	{
		title: 'Finance, Executive and HR',
		imagePath: '/home-page/tech-stack/finance-hr.png',
	},
];

export default function CuratedTechnologies() {
	return (
		<section className="relative px-6">
			<GlowBackground
				style={{
					top: '60%',
					left: '60%',
					width: '100%',
					height: '60%',
					background:
						'radial-gradient(ellipse at center, rgba(96, 107, 250, 0.72) 0%, transparent 100%)',
					transform: 'translate(-50%, -50%) rotate(-40deg) scale(1.25)',
					filter: 'blur(100px)',
					opacity: 0.8,
				}}
			/>
			<div className="mx-auto max-w-6xl">
				{/* Section Header */}
				<div className="mb-16 text-center">
					<SectionHeading size="large">
						Curated <span className="text-[#606bfa]">AI And Automation</span> Technologies
					</SectionHeading>
				</div>

				{/* LARGE OUTER GLASS CONTAINER */}
				<div
					className="relative overflow-hidden rounded-[40px] p-8 md:p-12"
					style={{
						background: 'rgba(255, 255, 255, 0.02)',
						backdropFilter: 'blur(20px)',
						border: '1px solid rgba(255, 255, 255, 0.1)',
						boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.7)',
					}}
				>
					{/* Outer Container Border Highlights */}
					<div
						className="pointer-events-none absolute inset-0"
						style={{
							borderRadius: '40px',
							padding: '1.5px',
							background:
								'linear-gradient(135deg, #fff 0%, transparent 30%, transparent 70%, #fff 100%)',
							WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
							WebkitMaskComposite: 'xor',
							maskComposite: 'exclude',
							opacity: 0.4,
						}}
					/>

					{/* INNER GRID */}
					<div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2">
						{techCategories.map((cat, idx) => (
							<div
								key={idx}
								className="group relative flex flex-col rounded-xl transition-all duration-500 hover:scale-[1.01]"
								style={{
									boxShadow: '0 25px 60px -10px rgba(0,0,0,0.5)',
								}}
							>
								{/* The Main Card Body (Glass Fill) */}
								<div
									className="absolute inset-0 rounded-xl"
									style={{
										background:
											'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.06) 100%)',
										backdropFilter: 'blur(10px)',
										zIndex: -2,
									}}
								/>

								<GlassGlow angle={135} opacity={0.5} start={20} end={85} radius="12px" />

								<div className="relative m-2 flex h-full flex-col overflow-hidden rounded-xl">
									{/* 1. Card Header - fakes transparency with a gradient matching the card background */}
									<div className="relative z-20 overflow-hidden rounded-t-xl px-6 py-5">
										{/* The Content */}
										<p className="relative z-10 text-2xl font-semibold tracking-tight text-white">
											{cat.title}
										</p>

										{/* The 100% Transparent Gradient Border */}
										<div
											className="pointer-events-none absolute inset-0 rounded-t-xl"
											style={{
												padding: '1.5px',
												background:
													'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.3) 100%)',
												WebkitMask:
													'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
												WebkitMaskComposite: 'xor',
												maskComposite: 'exclude',
											}}
										/>

										{/* Subtle Internal Corner Glow */}
										<div
											className="pointer-events-none absolute inset-0"
											style={{
												background:
													'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)',
											}}
										/>
									</div>

									{/* 2. Logo Area - no bg needed, inherits white from parent */}
									<div className="relative z-10 flex min-h-[160px] flex-grow items-center justify-center bg-white p-8">
										<Image
											width={500}
											height={100}
											alt={cat.title}
											src={cat.imagePath}
											className="relative z-10 h-auto w-auto object-contain"
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* BOTTOM SECTION */}
				<div className="mt-20 text-center">
					<p className="text-[1.25rem] font-light italic tracking-wide text-white">
						And so many more...
					</p>
				</div>
			</div>
		</section>
	);
}
