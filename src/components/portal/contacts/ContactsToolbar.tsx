import { DarkDropdown } from '@/components/ui/form-parts/DarkDropdown';

interface ContactsToolbarProps {
	sources: string[];
	sourceFilter: string;
	onSourceFilterChange: (source: string) => void;
	onManageStatuses: () => void;
}

export function ContactsToolbar({
	sources,
	sourceFilter,
	onSourceFilterChange,
	onManageStatuses,
}: ContactsToolbarProps) {
	return (
		<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			{sources.length > 0 ? (
				<div className="flex items-center gap-4">
					<label className="text-sm font-medium text-white/75">Filter by Source:</label>
					<div className="w-64">
						<DarkDropdown
							value={sourceFilter === 'all' ? 'All Sources' : (sourceFilter ?? 'All Sources')}
							options={['All Sources', ...sources]}
							onChange={(value) => onSourceFilterChange(value === 'All Sources' ? 'all' : value)}
						/>
					</div>
				</div>
			) : (
				<div />
			)}
			<button
				type="button"
				onClick={onManageStatuses}
				className="w-fit rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2 font-semibold text-white/85 transition hover:bg-white/[0.14]"
			>
				Manage Statuses
			</button>
		</div>
	);
}
