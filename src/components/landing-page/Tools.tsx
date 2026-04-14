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
		return <span className="text-lg font-bold text-[#39FF14] md:text-[1.4rem]">✓</span>;
	}
	if (status === 'no') {
		return <span className="text-base font-bold text-[#4D5470] md:text-xl">X</span>;
	}
	return <span className="text-xs font-bold text-[#FFD700] md:text-sm">Partial</span>;
}

export default function Tools() {
	return (
		<section className="font-poppins relative overflow-hidden px-4 md:px-6 lg:px-12">
			<div className="mx-auto max-w-5xl">
				{/* Title */}
				<div className="mx-auto mb-10 text-center text-white md:mb-12 lg:mb-16">
					<SectionHeading size="large">
						The <span className="text-[#606bfa]">Tools</span> You`re Using Weren`t Built for
						<br />
						Complex Business Operations
					</SectionHeading>
					<p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed opacity-100 sm:text-lg md:text-[1.2rem] lg:text-[1.3rem]">
						Every tool in your stack was built for one layer of the problem. None of them were built for the system.
					</p>
				</div>

				{/* Table Container */}
				<div className="overflow-x-hidden pb-6 md:overflow-x-auto md:pb-8">
					<div className="w-full overflow-hidden rounded-2xl border-[2px] border-white bg-[#1A1F3C] shadow-[0_0_30px_rgba(255,255,255,0.1)] md:min-w-[800px]">
						<table className="w-full border-collapse text-center">
							<thead>
								<tr className="border-b border-white/30 bg-[#0D1127]">
									<th className="w-[68%] border-r border-white/30 px-3 py-4 text-left text-xs font-bold text-white md:w-1/4 md:px-4 md:py-6 md:text-center md:text-base">
										Capability
									</th>
									<th className="w-[32%] border-r border-white/30 bg-[#2D345E] px-2 py-4 text-xs font-bold text-white md:w-auto md:px-4 md:py-6 md:text-base">
										SPCTEK
										<br />
										AI Platform
									</th>
									<th className="hidden border-r border-white/30 px-3 py-4 text-sm font-bold text-white md:table-cell md:px-4 md:py-6 md:text-base">
										Enterprise
										<br />
										Platforms
									</th>
									<th className="hidden border-r border-white/30 px-3 py-4 text-sm font-bold text-white md:table-cell md:px-4 md:py-6 md:text-base">
										SaaS Tools
									</th>
									<th className="hidden px-3 py-4 text-sm font-bold text-white md:table-cell md:px-4 md:py-6 md:text-base">
										AI Tools
									</th>
								</tr>
							</thead>
							<tbody>
								{comparisons.map((row) => (
									<tr key={row.capability} className="border-b border-white/20 last:border-b-0">
										<td className="border-r border-white/30 px-3 py-3 text-left text-xs font-medium text-white/90 md:px-6 md:py-4 md:pl-10 md:text-base">
											{row.capability}
										</td>
										<td className="border-r border-white/30 bg-[#2D345E] px-2 py-3 md:px-4 md:py-4">
											<RenderStatus status={row.spctek} />
										</td>
										<td className="hidden border-r border-white/30 px-3 py-3 md:table-cell md:px-4 md:py-4">
											<RenderStatus status={row.enterprise} />
										</td>
										<td className="hidden border-r border-white/30 px-3 py-3 md:table-cell md:px-4 md:py-4">
											<RenderStatus status={row.saas} />
										</td>
										<td className="hidden px-3 py-3 md:table-cell md:px-4 md:py-4">
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
					<PrimaryButton href="/contact">Talk to an Automation Expert</PrimaryButton>
				</div>
			</div>
		</section>
	);
}
