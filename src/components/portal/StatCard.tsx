interface StatCardProps {
	label: string;
	loading: boolean;
	count: number | string;
}

export function StatCard({ label, loading, count }: StatCardProps) {
	return (
		<div className="mb-7 rounded-2xl border border-white/15 bg-white/[0.05] px-5 py-4 backdrop-blur-xl">
			<p className="text-xs uppercase tracking-[0.1em] text-white/55">{label}</p>
			<p className="mt-2 text-2xl font-semibold text-white">
				{loading ? <span className="animate-pulse">Loading...</span> : count}
			</p>
		</div>
	);
}
