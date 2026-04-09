import React from 'react';

import { PrimaryButton } from '../ui/PrimaryButton';
import { SectionHeading } from '../ui/SectionHeading';

type ToolComparison = {
	capability: string;
	spctek: 'yes' | 'no' | 'partial';
	enterprise: 'yes' | 'no' | 'partial';
	saas: 'yes' | 'no' | 'partial';
	ai: 'yes' | 'no' | 'partial';
};

const comparisons: ToolComparison[] = [
	{
		capability: 'Unified ops data layer',
		spctek: 'yes',
		enterprise: 'yes',
		saas: 'yes',
		ai: 'no',
	},
	{
		capability: 'Workflow orchestration',
		spctek: 'yes',
		enterprise: 'yes',
		saas: 'partial',
		ai: 'no',
	},
	{
		capability: 'Built-in AI inside ops',
		spctek: 'yes',
		enterprise: 'partial',
		saas: 'yes',
		ai: 'yes',
	},
	{
		capability: 'Secure local AI',
		spctek: 'yes',
		enterprise: 'yes',
		saas: 'yes',
		ai: 'no',
	},
	{
		capability: 'SMB-friendly setup',
		spctek: 'yes',
		enterprise: 'no',
		saas: 'no',
		ai: 'yes',
	},
	{
		capability: 'Cross-tool automation',
		spctek: 'yes',
		enterprise: 'yes',
		saas: 'partial',
		ai: 'no',
	},
	{
		capability: 'System diagnostics',
		spctek: 'yes',
		enterprise: 'partial',
		saas: 'yes',
		ai: 'no',
	},
];

function RenderStatus({ status }: { status: 'yes' | 'no' | 'partial' }) {
	if (status === 'yes') {
		return <span className="text-[1.4rem] font-bold text-[#39FF14]">✓</span>;
	}
	if (status === 'no') {
		return <span className="text-xl font-bold text-[#4D5470]">X</span>;
	}
	return <span className="font-bold text-[#FFD700]">Partial</span>;
}

export default function Tools() {
	return (
		<section className="font-poppins relative overflow-hidden px-6 md:px-12">
			<div className="mx-auto max-w-5xl">
				{/* Title */}
				<div className="mx-auto mb-16 text-center text-white">
					<SectionHeading size="large">
						The <span className="text-[#606bfa]">Tools</span> You`re Using Weren`t Built for
						<br />
						Complex Business Operations
					</SectionHeading>
					<p className="mx-auto mt-6 max-w-2xl font-light leading-relaxed opacity-100 md:text-[1.3rem]">
						Every tool in your stack was built for one layer of the problem. None of them were built
						for the system.
					</p>
				</div>

				{/* Table Container */}
				<div className="overflow-x-auto pb-8">
					<div className="min-w-[800px] overflow-hidden rounded-2xl border-[2px] border-white bg-[#1A1F3C] shadow-[0_0_30px_rgba(255,255,255,0.1)]">
						<table className="w-full border-collapse text-center">
							<thead>
								<tr className="border-b border-white/30 bg-[#0D1127]">
									<th className="w-1/4 border-r border-white/30 px-4 py-6 text-center font-bold text-white">
										Capability
									</th>
									<th className="border-r border-white/30 bg-[#2D345E] px-4 py-6 font-bold text-white">
										SPCTEK
										<br />
										AI Platform
									</th>
									<th className="border-r border-white/30 px-4 py-6 font-bold text-white">
										Enterprise
										<br />
										Platforms
									</th>
									<th className="border-r border-white/30 px-4 py-6 font-bold text-white">
										SaaS Tools
									</th>
									<th className="px-4 py-6 font-bold text-white">AI Tools</th>
								</tr>
							</thead>
							<tbody>
								{comparisons.map((row) => (
									<tr key={row.capability} className="border-b border-white/20 last:border-b-0">
										<td className="border-r border-white/30 px-6 py-4 pl-10 text-left font-medium text-white/90">
											{row.capability}
										</td>
										<td className="border-r border-white/30 bg-[#2D345E] px-4 py-4">
											<RenderStatus status={row.spctek} />
										</td>
										<td className="border-r border-white/30 px-4 py-4">
											<RenderStatus status={row.enterprise} />
										</td>
										<td className="border-r border-white/30 px-4 py-4">
											<RenderStatus status={row.saas} />
										</td>
										<td className="px-4 py-4">
											<RenderStatus status={row.ai} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* CTA Button */}
				<div className="flex justify-center">
					<PrimaryButton href="/#contact">Talk to an Automation Expert</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
