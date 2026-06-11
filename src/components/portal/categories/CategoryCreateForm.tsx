interface CategoryCreateFormProps {
	name: string;
	creating: boolean;
	onNameChange: (name: string) => void;
	onCreate: () => void | Promise<void>;
}

export function CategoryCreateForm({ name, creating, onNameChange, onCreate }: CategoryCreateFormProps) {
	return (
		<section className="border-white/18 mb-8 mt-6 rounded-3xl border bg-white/[0.04] p-5 md:p-6">
			<div className="mb-4 flex flex-wrap items-end gap-3">
				<div className="min-w-[240px] flex-1">
					<label className="mb-2 block text-sm text-white/70">Add Category</label>
					<input
						type="text"
						value={name}
						onChange={(event) => onNameChange(event.target.value)}
						placeholder="e.g. AI Workflows"
						className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-white outline-none transition focus:border-[#8c96ff] focus:ring-2 focus:ring-[#606bfa]/45"
					/>
				</div>
				<button
					type="button"
					onClick={onCreate}
					disabled={creating}
					className="rounded-xl bg-[#606bfa] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f79ff] disabled:opacity-60"
				>
					{creating ? 'Creating...' : 'Create Category'}
				</button>
			</div>
		</section>
	);
}
